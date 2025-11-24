import { Browser, BrowserContext, Page, chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

export interface TimeCardSessionInfo {
  authenticated: boolean;
  username?: string;
  sessionStartTime?: Date;
  currentUrl?: string;
}

export interface ErrorInfo {
  isError: true;
  mainMessage: string;
  exceptionType: string;
  exceptionMessage: string;
}

export class TimeCardSession {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private sessionInfo: TimeCardSessionInfo = { authenticated: false };
  private pendingFormUpdates: Map<string, string> = new Map();

  private readonly baseUrl: string;
  private readonly sessionStatePath: string;

  constructor() {
    const baseUrl = process.env.TIMECARD_BASE_URL;

    if (!baseUrl) {
      throw new Error('TIMECARD_BASE_URL environment variable is required. Please set it to your TimeCard server URL including the application path (e.g., http://your-server/app/)');
    }

    // Ensure baseUrl ends with a slash
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';

    // Set session state file path in temp directory
    this.sessionStatePath = path.join(process.cwd(), '.timecard-session-state.json');
  }
  
  async initializeBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      // Try to restore session from saved state
      try {
        if (fs.existsSync(this.sessionStatePath)) {
          const stateData = fs.readFileSync(this.sessionStatePath, 'utf-8');
          const savedState = JSON.parse(stateData);

          // Check if saved state is still valid (within 25 minutes)
          if (savedState.sessionStartTime) {
            const sessionAge = Date.now() - new Date(savedState.sessionStartTime).getTime();
            const maxSessionAge = 25 * 60 * 1000;

            if (sessionAge < maxSessionAge) {
              // Restore browser context with saved cookies/storage
              this.context = await this.browser.newContext({
                storageState: savedState.storageState
              });
              this.page = await this.context.newPage();
              this.sessionInfo = savedState.sessionInfo;
              console.log('[Session] Restored session from saved state');
              return;
            }
          }
        }
      } catch (error) {
        console.log('[Session] Failed to restore session state, starting fresh');
      }

      // Create new context if restore failed or no saved state
      this.context = await this.browser.newContext();
      this.page = await this.context.newPage();
    }
  }

  async saveSessionState(): Promise<void> {
    if (!this.context || !this.sessionInfo.authenticated) {
      return;
    }

    try {
      const storageState = await this.context.storageState();
      const sessionData = {
        storageState,
        sessionInfo: this.sessionInfo
      };

      fs.writeFileSync(this.sessionStatePath, JSON.stringify(sessionData, null, 2));
      console.log('[Session] Saved session state');
    } catch (error) {
      console.error('[Session] Failed to save session state:', error);
    }
  }

  clearSessionState(): void {
    try {
      if (fs.existsSync(this.sessionStatePath)) {
        fs.unlinkSync(this.sessionStatePath);
        console.log('[Session] Cleared session state file');
      }
    } catch (error) {
      console.error('[Session] Failed to clear session state:', error);
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
      // The form structure is broken - input fields are outside the form tag
      // Click the submit image button directly
      await this.page.locator('input[type="image"][name="Image12"]').click();

      // Wait for navigation and check if login was successful
      await this.page.waitForLoadState('networkidle');

      // Check for error page
      const errorInfo = await this.checkForErrorPage();
      if (errorInfo) {
        return {
          success: false,
          message: `Login failed: ${errorInfo.mainMessage}\nException: ${errorInfo.exceptionMessage}`
        };
      }

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

      // Save session state for future reuse
      await this.saveSessionState();

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

      // Clear saved session state
      this.clearSessionState();

      await this.closeBrowser();
      this.sessionInfo = { authenticated: false };

      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      // Even if logout fails, we should clean up the session
      this.clearSessionState();
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
      // Silently ignore cleanup errors
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
    // Check if session is too old (25 minutes - close to 30 min server timeout)
    if (this.sessionInfo.authenticated && this.sessionInfo.sessionStartTime) {
      const sessionAge = Date.now() - this.sessionInfo.sessionStartTime.getTime();
      const maxSessionAge = 25 * 60 * 1000; // 25 minutes (server timeout is 30 minutes)

      if (sessionAge > maxSessionAge) {
        await this.closeBrowser();
        this.sessionInfo = { authenticated: false };
      }
    }

    // Check if browser is still alive
    if (this.sessionInfo.authenticated) {
      // Check browser connection
      if (!this.browser || !this.browser.isConnected()) {
        await this.closeBrowser();
        this.sessionInfo = { authenticated: false };
      } else {
        try {
          // Quick test to see if page is responsive
          if (this.page && !this.page.isClosed()) {
            await this.page.evaluate('1+1', { timeout: 3000 });
            return { success: true, message: 'Session verified' };
          } else {
            await this.closeBrowser();
            this.sessionInfo = { authenticated: false };
          }
        } catch (error) {
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

  async checkForErrorPage(): Promise<ErrorInfo | null> {
    if (!this.page) return null;

    const currentUrl = this.page.url();
    if (!currentUrl.includes('/errorMsg/error.jsp')) {
      return null;
    }

    const errorInfo = await this.page.evaluate(() => {
      const title = document.querySelector('p[align="center"] font[color="red"]')?.textContent;
      if (title !== 'Error Page') {
        return null;
      }

      const rows = Array.from(document.querySelectorAll('table[align="center"] tr'));

      let mainMessage = '';
      let exceptionType = '';
      let exceptionMessage = '';

      for (const row of rows) {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const label = cells[0].textContent?.trim();
          const value = cells[1]?.textContent?.trim();

          if (label === 'Exception Type:') {
            exceptionType = value || '';
          } else if (label === 'Exception Message:') {
            exceptionMessage = value || '';
          } else if (cells[0].querySelector('b')) {
            mainMessage = cells[0].textContent?.trim() || '';
          }
        }
      }

      return {
        isError: true as const,
        mainMessage,
        exceptionType,
        exceptionMessage
      };
    });

    return errorInfo;
  }

  async navigateToTimesheet(date: string): Promise<void> {
    if (!this.page || !this.sessionInfo.authenticated) {
      throw new Error('Not authenticated or page not available');
    }

    const timesheetUrl = `${this.baseUrl}Timecard/timecard_week/daychoose.jsp?cho_date=${date}`;
    await this.page.goto(timesheetUrl);
    await this.page.waitForLoadState('networkidle');

    // Check if redirected to error page
    const errorInfo = await this.checkForErrorPage();
    if (errorInfo) {
      throw new Error(`TimeCard Error: ${errorInfo.mainMessage}\nException: ${errorInfo.exceptionMessage}`);
    }
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

  // ========== Batch Operations (Performance Optimization) ==========

  /**
   * Get current form state from the timesheet page.
   * This reads all form fields to prepare for direct POST submission.
   */
  async getCurrentFormState(): Promise<Record<string, string>> {
    if (!this.page || !this.sessionInfo.authenticated) {
      throw new Error('Not authenticated or page not available');
    }

    try {
      const formData = await this.page.evaluate(() => {
        const form = document.forms.namedItem('weekly_info');
        if (!form) {
          throw new Error('Form "weekly_info" not found on page');
        }

        const data: Record<string, string> = {};

        // Serialize all form elements
        for (let i = 0; i < form.elements.length; i++) {
          const element = form.elements[i] as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
          if (element.name) {
            // Get value based on element type
            if (element instanceof HTMLSelectElement) {
              data[element.name] = element.value || '';
            } else if (element instanceof HTMLInputElement) {
              if (element.type === 'checkbox' || element.type === 'radio') {
                if (element.checked) {
                  data[element.name] = element.value || 'on';
                }
              } else {
                data[element.name] = element.value || '';
              }
            } else if (element instanceof HTMLTextAreaElement) {
              data[element.name] = element.value || '';
            }
          }
        }

        return data;
      });

      console.log(`[Batch] Retrieved ${Object.keys(formData).length} form fields`);
      return formData;
    } catch (error) {
      throw new Error(`Failed to get current form state: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Queue a form field update for batch submission.
   * Updates are accumulated in memory and submitted together with batchSave().
   */
  queueFormUpdate(fieldName: string, value: string): void {
    this.pendingFormUpdates.set(fieldName, value);
    console.log(`[Batch] Queued update: ${fieldName} = ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
  }

  /**
   * Get the number of pending updates.
   */
  getPendingUpdateCount(): number {
    return this.pendingFormUpdates.size;
  }

  /**
   * Clear all pending updates without submitting.
   */
  clearPendingUpdates(): void {
    this.pendingFormUpdates.clear();
    console.log('[Batch] Cleared all pending updates');
  }

  /**
   * Submit all pending updates via direct form POST.
   * This bypasses UI operations and directly submits to weekinfo_deal.jsp.
   */
  async batchSave(action: 'save' | 'submit' = 'save'): Promise<{ success: boolean; message: string }> {
    if (!this.page || !this.sessionInfo.authenticated) {
      throw new Error('Not authenticated or page not available');
    }

    if (this.pendingFormUpdates.size === 0) {
      return {
        success: true,
        message: 'No pending updates to save'
      };
    }

    try {
      console.log(`[Batch] Starting batch ${action} with ${this.pendingFormUpdates.size} pending updates`);

      // 1. Get current form state
      const baseFormData = await this.getCurrentFormState();

      // 2. Apply pending updates
      for (const [key, value] of this.pendingFormUpdates) {
        baseFormData[key] = value;
      }

      // 3. Add action button
      if (action === 'save') {
        baseFormData['save'] = ' save ';
      } else {
        baseFormData['submit'] = 'submit';
      }

      // 4. POST to weekinfo_deal.jsp
      const targetUrl = `${this.baseUrl}Timecard/timecard_week/weekinfo_deal.jsp`;
      console.log(`[Batch] POSTing to ${targetUrl}`);

      const response = await this.page.request.post(targetUrl, {
        form: baseFormData
        // Note: Playwright's request API doesn't have followRedirects option
        // It automatically returns redirect status codes without following
      });

      // 5. Check response
      const status = response.status();
      console.log(`[Batch] Response status: ${status}`);

      if (status === 302 || status === 301) {
        // Redirect means success
        const redirectUrl = response.headers()['location'];
        console.log(`[Batch] Success - redirecting to ${redirectUrl}`);

        // Navigate to the redirected page to update page state
        if (redirectUrl) {
          const fullRedirectUrl = redirectUrl.startsWith('http')
            ? redirectUrl
            : `${this.baseUrl}Timecard/timecard_week/${redirectUrl}`;
          await this.page.goto(fullRedirectUrl);
          await this.page.waitForLoadState('networkidle');
        }

        // Clear pending updates after successful save
        const savedCount = this.pendingFormUpdates.size;
        this.clearPendingUpdates();

        return {
          success: true,
          message: `Batch ${action} successful - saved ${savedCount} updates`
        };
      } else if (status === 200) {
        // Check if there's an error on the page
        const pageContent = await response.text();
        if (pageContent.includes('error') || pageContent.includes('Error')) {
          throw new Error('Server returned error page');
        }

        // 200 might be success too, clear pending updates
        const savedCount = this.pendingFormUpdates.size;
        this.clearPendingUpdates();

        return {
          success: true,
          message: `Batch ${action} completed - saved ${savedCount} updates`
        };
      } else {
        throw new Error(`Unexpected response status: ${status}`);
      }
    } catch (error) {
      const errorMsg = `Batch ${action} failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(`[Batch] ${errorMsg}`);
      throw new Error(errorMsg);
    }
  }
}