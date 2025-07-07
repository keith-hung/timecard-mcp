import { Browser, BrowserContext, Page, chromium } from 'playwright';

export interface TimeCardSessionInfo {
  authenticated: boolean;
  username?: string;
  sessionStartTime?: Date;
  currentUrl?: string;
}

export class TimeCardSession {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private sessionInfo: TimeCardSessionInfo = { authenticated: false };
  
  private readonly baseUrl: string;

  constructor() {
    const baseUrl = process.env.TIMECARD_BASE_URL;
    
    if (!baseUrl) {
      throw new Error('TIMECARD_BASE_URL environment variable is required. Please set it to your TimeCard server URL including the application path (e.g., http://your-server/app/)');
    }
    
    // Ensure baseUrl ends with a slash
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  }
  
  async initializeBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.context = await this.browser.newContext();
      this.page = await this.context.newPage();
    }
  }

  async login(username: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      await this.initializeBrowser();
      
      if (!this.page) {
        throw new Error('Browser page not initialized');
      }

      await this.page.goto(this.baseUrl);
      await this.page.locator('input[name="name"]').fill(username);
      await this.page.locator('input[name="pw"]').fill(password);
      await this.page.getByRole('button', { name: 'Submit' }).click();

      // Wait for navigation and check if login was successful
      await this.page.waitForLoadState('networkidle');
      
      const currentUrl = this.page.url();
      const isLoginPage = currentUrl.includes('login') || currentUrl === this.baseUrl;
      
      if (isLoginPage) {
        // Check for error messages
        const errorElement = await this.page.locator('.error, .alert, [class*="error"]').first();
        const errorText = await errorElement.textContent().catch(() => null);
        
        return {
          success: false,
          message: errorText || 'Login failed - invalid credentials'
        };
      }

      this.sessionInfo = {
        authenticated: true,
        username,
        sessionStartTime: new Date(),
        currentUrl
      };

      return {
        success: true,
        message: 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        message: `Login error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      if (this.page && this.sessionInfo.authenticated) {
        // Look for logout link/button
        const logoutSelector = 'a[href*="logout"], button[onclick*="logout"], input[value*="logout"]';
        const logoutElement = await this.page.locator(logoutSelector).first();
        
        if (await logoutElement.count() > 0) {
          await logoutElement.click();
          await this.page.waitForLoadState('networkidle');
        }
      }

      await this.closeBrowser();
      this.sessionInfo = { authenticated: false };

      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      // Even if logout fails, we should clean up the session
      await this.closeBrowser();
      this.sessionInfo = { authenticated: false };
      
      return {
        success: true,
        message: 'Session cleared (logout may have failed)'
      };
    }
  }

  async closeBrowser(): Promise<void> {
    try {
      if (this.context) {
        await this.context.close();
        this.context = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
      this.page = null;
    } catch (error) {
      console.error('Error closing browser:', error);
    }
  }

  getSessionInfo(): TimeCardSessionInfo {
    return { ...this.sessionInfo };
  }

  getPage(): Page | null {
    return this.page;
  }

  isAuthenticated(): boolean {
    return this.sessionInfo.authenticated;
  }

  async ensureAuthenticated(): Promise<{ success: boolean; message: string }> {
    // Check if session is too old (10 minutes)
    if (this.sessionInfo.authenticated && this.sessionInfo.sessionStartTime) {
      const sessionAge = Date.now() - this.sessionInfo.sessionStartTime.getTime();
      const maxSessionAge = 10 * 60 * 1000; // 10 minutes
      
      if (sessionAge > maxSessionAge) {
        console.error('Session is older than 10 minutes, forcing re-authentication');
        await this.closeBrowser();
        this.sessionInfo = { authenticated: false };
      }
    }

    // Check if browser is still alive
    if (this.sessionInfo.authenticated) {
      // Check browser connection
      if (!this.browser || !this.browser.isConnected()) {
        console.error('Browser is not connected, forcing re-authentication');
        await this.closeBrowser();
        this.sessionInfo = { authenticated: false };
      } else {
        try {
          // Quick test to see if page is responsive
          if (this.page && !this.page.isClosed()) {
            await this.page.evaluate('1+1', { timeout: 3000 });
            return { success: true, message: 'Session verified' };
          } else {
            console.error('Page is closed, forcing re-authentication');
            await this.closeBrowser();
            this.sessionInfo = { authenticated: false };
          }
        } catch (error) {
          console.error('Browser/page is not responsive, forcing re-authentication');
          await this.closeBrowser();
          this.sessionInfo = { authenticated: false };
        }
      }
    }

    if (this.sessionInfo.authenticated) {
      return { success: true, message: 'Already authenticated' };
    }

    // Try to auto-login using environment variables
    const username = process.env.TIMECARD_USERNAME;
    const password = process.env.TIMECARD_PASSWORD;

    if (!username || !password) {
      return {
        success: false,
        message: 'Not authenticated and no credentials found in environment variables. Set TIMECARD_USERNAME and TIMECARD_PASSWORD or call timecard_login first.'
      };
    }

    return await this.login(username, password);
  }

  async navigateToTimesheet(date: string): Promise<void> {
    if (!this.page || !this.sessionInfo.authenticated) {
      throw new Error('Not authenticated or page not available');
    }

    const timesheetUrl = `${this.baseUrl}Timecard/timecard_week/daychoose.jsp?cho_date=${date}`;
    await this.page.goto(timesheetUrl);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForElement(selector: string, timeout: number = 5000): Promise<boolean> {
    if (!this.page) return false;
    
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch {
      return false;
    }
  }

  async getCurrentWeekRange(): Promise<{ startDate: string; endDate: string; dates: string[] }> {
    if (!this.page || !this.sessionInfo.authenticated) {
      throw new Error('Not authenticated or page not available');
    }

    try {
      // Get current week info from the page
      // TimeCard typically shows the week range in the header or title
      const pageTitle = await this.page.title();
      const currentUrl = this.page.url();
      
      // Extract date from URL if available (cho_date parameter)
      const urlMatch = currentUrl.match(/cho_date=(\d{4}-\d{2}-\d{2})/);
      let referenceDate: Date;
      
      if (urlMatch) {
        referenceDate = new Date(urlMatch[1]);
      } else {
        // Fallback to current date
        referenceDate = new Date();
      }
      
      // Calculate the Monday of the current week
      const dayOfWeek = referenceDate.getDay();
      const mondayDate = new Date(referenceDate);
      mondayDate.setDate(referenceDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      
      // Calculate Saturday (end of work week)
      const saturdayDate = new Date(mondayDate);
      saturdayDate.setDate(mondayDate.getDate() + 5);
      
      // Generate all dates in the week
      const dates: string[] = [];
      for (let i = 0; i < 6; i++) {
        const date = new Date(mondayDate);
        date.setDate(mondayDate.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
      }
      
      return {
        startDate: mondayDate.toISOString().split('T')[0],
        endDate: saturdayDate.toISOString().split('T')[0],
        dates
      };
    } catch (error) {
      throw new Error(`Failed to get current week range: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  isDateInCurrentWeek(date: string): boolean {
    try {
      // This is a synchronous check based on the date format
      // For a more accurate check, use getCurrentWeekRange() but that's async
      const targetDate = new Date(date);
      const today = new Date();
      
      // Calculate Monday of current week
      const dayOfWeek = today.getDay();
      const mondayDate = new Date(today);
      mondayDate.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      
      // Calculate Saturday of current week
      const saturdayDate = new Date(mondayDate);
      saturdayDate.setDate(mondayDate.getDate() + 5);
      
      return targetDate >= mondayDate && targetDate <= saturdayDate;
    } catch {
      return false;
    }
  }
}