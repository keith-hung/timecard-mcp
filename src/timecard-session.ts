import * as fs from 'fs';
import * as path from 'path';
import { HttpClient } from './http/client.js';
import {
  parseActivityList,
  parseTimearray,
  parseOvertimeArray,
  parseProjectOptions,
  parseHiddenInputs,
  parseWeekDate,
  isLoginPage,
  isErrorPage,
  parseErrorPage,
  reconstructFormState,
  type ActivityListEntry,
  type TimearrayEntry,
  type ProjectOption,
  type ErrorInfo,
} from './parser/html-parser.js';

export type { ErrorInfo };

export interface TimeCardSessionInfo {
  authenticated: boolean;
  username?: string;
  sessionStartTime?: Date;
  currentUrl?: string;
}

export class TimeCardSession {
  private httpClient: HttpClient;
  private sessionInfo: TimeCardSessionInfo = { authenticated: false };
  private pendingFormUpdates: Map<string, string> = new Map();

  // HTML page cache
  private cachedHtml: string | null = null;
  private cachedDate: string | null = null;

  private readonly baseUrl: string;
  private readonly sessionStatePath: string;

  constructor() {
    const baseUrl = process.env.TIMECARD_BASE_URL;

    if (!baseUrl) {
      throw new Error('TIMECARD_BASE_URL environment variable is required. Please set it to your TimeCard server URL including the application path (e.g., http://your-server/app/)');
    }

    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    this.httpClient = new HttpClient(this.baseUrl);
    this.sessionStatePath = path.join(process.cwd(), '.timecard-session-state.json');

    // Try to restore session on construction
    this.tryRestoreSession();
  }

  // ========== Session Persistence ==========

  private tryRestoreSession(): void {
    try {
      const data = this.httpClient.loadSession(this.sessionStatePath);
      if (!data || !data.sessionInfo) return;

      const startTime = data.sessionInfo.sessionStartTime;
      if (startTime) {
        const age = Date.now() - new Date(startTime).getTime();
        if (age > 25 * 60 * 1000) {
          // Session too old
          this.httpClient.clearCookies();
          return;
        }
      }

      this.sessionInfo = {
        authenticated: data.sessionInfo.authenticated || false,
        username: data.sessionInfo.username,
        sessionStartTime: startTime ? new Date(startTime) : undefined,
        currentUrl: data.sessionInfo.currentUrl,
      };

      if (this.sessionInfo.authenticated) {
        console.log('[Session] Restored session from saved state');
      }
    } catch {
      console.log('[Session] Failed to restore session state, starting fresh');
    }
  }

  async saveSessionState(): Promise<void> {
    if (!this.sessionInfo.authenticated) return;

    try {
      this.httpClient.saveSession(this.sessionStatePath, {
        ...this.sessionInfo,
        sessionStartTime: this.sessionInfo.sessionStartTime?.toISOString(),
      });
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

  // ========== Authentication ==========

  async login(username: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.httpClient.post('servlet/VerifController', {
        method: 'login',
        name: username,
        pw: password,
      });

      if (response.status === 302) {
        const location = response.headers['location'] || '';

        if (location.includes('ini_mainframe') || location.includes('project')) {
          // Login success — follow redirect to establish full session
          await this.httpClient.get(location);

          this.sessionInfo = {
            authenticated: true,
            username,
            sessionStartTime: new Date(),
            currentUrl: location,
          };

          await this.saveSessionState();

          return { success: true, message: 'Login successful' };
        }

        // Login failure — detect reason from redirect target
        if (location.includes('login_namefail')) {
          return { success: false, message: 'Login failed: Username not found' };
        }
        if (location.includes('login_pwfail')) {
          return { success: false, message: 'Login failed: Wrong password' };
        }
        if (location.includes('login_notavailable')) {
          return { success: false, message: 'Login failed: Account not available' };
        }
        if (location.includes('noseats')) {
          return { success: false, message: 'Login failed: No available seats' };
        }
        if (location.includes('error')) {
          return { success: false, message: 'Login failed: Server error' };
        }
      }

      return {
        success: false,
        message: `Login failed: Unexpected response status ${response.status}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Login error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      if (this.sessionInfo.authenticated) {
        await this.httpClient.get('logout.jsp');
      }

      this.httpClient.clearCookies();
      this.clearSessionState();
      this.sessionInfo = { authenticated: false };
      this.invalidateCache();

      return { success: true, message: 'Logout successful' };
    } catch {
      this.httpClient.clearCookies();
      this.clearSessionState();
      this.sessionInfo = { authenticated: false };
      this.invalidateCache();

      return { success: true, message: 'Session cleared (logout may have failed)' };
    }
  }

  async ensureAuthenticated(): Promise<{ success: boolean; message: string }> {
    // Check session age
    if (this.sessionInfo.authenticated && this.sessionInfo.sessionStartTime) {
      const sessionAge = Date.now() - this.sessionInfo.sessionStartTime.getTime();
      if (sessionAge > 25 * 60 * 1000) {
        this.sessionInfo = { authenticated: false };
        this.httpClient.clearCookies();
      }
    }

    // If we think we're authenticated, verify with a lightweight request
    if (this.sessionInfo.authenticated) {
      try {
        const response = await this.httpClient.get('Timecard/timecard_week/daychoose.jsp');
        if (!isLoginPage(response.body, response.url)) {
          return { success: true, message: 'Session verified' };
        }
        // Session expired on server side
        this.sessionInfo = { authenticated: false };
      } catch {
        this.sessionInfo = { authenticated: false };
      }
    }

    if (this.sessionInfo.authenticated) {
      return { success: true, message: 'Already authenticated' };
    }

    // Try auto-login
    const username = process.env.TIMECARD_USERNAME;
    const password = process.env.TIMECARD_PASSWORD;

    if (!username || !password) {
      return {
        success: false,
        message: 'Not authenticated and no credentials found in environment variables. Set TIMECARD_USERNAME and TIMECARD_PASSWORD or call timecard_login first.',
      };
    }

    return await this.login(username, password);
  }

  getSessionInfo(): TimeCardSessionInfo {
    return { ...this.sessionInfo };
  }

  isAuthenticated(): boolean {
    return this.sessionInfo.authenticated;
  }

  // ========== Page Fetching & Caching ==========

  private invalidateCache(): void {
    this.cachedHtml = null;
    this.cachedDate = null;
  }

  /**
   * Fetch the timesheet page HTML. Uses cache if available for the same date.
   * This is the core method that replaces navigateToTimesheet + page.evaluate.
   */
  async fetchTimesheetPage(date?: string): Promise<string> {
    const normalizedDate = date || null;

    if (this.cachedDate === normalizedDate && this.cachedHtml) {
      return this.cachedHtml;
    }

    const url = date
      ? `Timecard/timecard_week/daychoose.jsp?cho_date=${date}`
      : 'Timecard/timecard_week/daychoose.jsp';

    const response = await this.httpClient.get(url);

    // Check for redirect to login (session expired)
    if (isLoginPage(response.body, response.url)) {
      await this.ensureAuthenticated();
      // Retry after re-authentication
      const retryResponse = await this.httpClient.get(url);
      if (isLoginPage(retryResponse.body, retryResponse.url)) {
        throw new Error('Session expired and re-authentication failed');
      }
      this.cachedHtml = retryResponse.body;
      this.cachedDate = normalizedDate;
      return retryResponse.body;
    }

    // Check for error page
    if (isErrorPage(response.body)) {
      const errorInfo = parseErrorPage(response.body);
      throw new Error(`TimeCard Error: ${errorInfo?.mainMessage || 'Unknown error'}`);
    }

    this.cachedHtml = response.body;
    this.cachedDate = normalizedDate;

    console.log(`[Navigation] Fetched timesheet page${date ? ` for ${date}` : ''} (${response.body.length} bytes)`);
    return response.body;
  }

  /**
   * Navigate to timesheet (compatibility method — just fetches the page).
   */
  async navigateToTimesheet(date: string): Promise<void> {
    await this.fetchTimesheetPage(date);
  }

  // ========== Data Extraction ==========

  async getActivityList(date?: string): Promise<ActivityListEntry[]> {
    const html = await this.fetchTimesheetPage(date);
    return parseActivityList(html);
  }

  async getTimearrayData(date?: string): Promise<TimearrayEntry[]> {
    const html = await this.fetchTimesheetPage(date);
    return parseTimearray(html);
  }

  async getOvertimeData(date?: string): Promise<TimearrayEntry[]> {
    const html = await this.fetchTimesheetPage(date);
    return parseOvertimeArray(html);
  }

  async getProjectOptions(date?: string): Promise<ProjectOption[]> {
    const html = await this.fetchTimesheetPage(date);
    return parseProjectOptions(html);
  }

  // ========== Week Range ==========

  async getCurrentWeekRange(): Promise<{ startDate: string; endDate: string; dates: string[] }> {
    const html = await this.fetchTimesheetPage();
    const cdate = parseWeekDate(html);

    let referenceDate: Date;
    if (cdate) {
      referenceDate = new Date(cdate);
    } else {
      referenceDate = new Date();
    }

    const dayOfWeek = referenceDate.getDay();
    const mondayDate = new Date(referenceDate);
    mondayDate.setDate(referenceDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const saturdayDate = new Date(mondayDate);
    saturdayDate.setDate(mondayDate.getDate() + 5);

    const dates: string[] = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(mondayDate);
      d.setDate(mondayDate.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }

    return {
      startDate: mondayDate.toISOString().split('T')[0],
      endDate: saturdayDate.toISOString().split('T')[0],
      dates,
    };
  }

  isDateInCurrentWeek(date: string): boolean {
    try {
      const targetDate = new Date(date);
      const today = new Date();

      const dayOfWeek = today.getDay();
      const mondayDate = new Date(today);
      mondayDate.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

      const saturdayDate = new Date(mondayDate);
      saturdayDate.setDate(mondayDate.getDate() + 5);

      return targetDate >= mondayDate && targetDate <= saturdayDate;
    } catch {
      return false;
    }
  }

  // ========== Batch Operations ==========

  /**
   * Get current form state from the timesheet page.
   * Reconstructs what the DOM would contain after JavaScript initialization.
   */
  async getCurrentFormState(): Promise<Record<string, string>> {
    const html = await this.fetchTimesheetPage(this.cachedDate ?? undefined);
    const activities = parseActivityList(html);
    const timeEntries = parseTimearray(html);
    const overtimeEntries = parseOvertimeArray(html);

    const formData = reconstructFormState(html, activities, timeEntries, overtimeEntries);
    console.log(`[Batch] Reconstructed ${Object.keys(formData).length} form fields`);
    return formData;
  }

  queueFormUpdate(fieldName: string, value: string): void {
    this.pendingFormUpdates.set(fieldName, value);
    console.log(`[Batch] Queued update: ${fieldName} = ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
  }

  getPendingUpdateCount(): number {
    return this.pendingFormUpdates.size;
  }

  clearPendingUpdates(): void {
    this.pendingFormUpdates.clear();
    console.log('[Batch] Cleared all pending updates');
  }

  private calculateDailyHours(formData: Record<string, string>): Record<number, number> {
    const dailyHours: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const recordPattern = /^record(\d+)_(\d+)$/;

    for (const [fieldName, value] of Object.entries(formData)) {
      const match = fieldName.match(recordPattern);
      if (match && value && value.trim() !== '') {
        const dayIndex = parseInt(match[2], 10);
        if (dayIndex >= 0 && dayIndex <= 6) {
          const hours = parseFloat(value);
          if (!isNaN(hours)) {
            dailyHours[dayIndex] += hours;
          }
        }
      }
    }

    return dailyHours;
  }

  private validateDailyHours(dailyHours: Record<number, number>, maxHoursPerDay: number = 8): string | null {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const violations: string[] = [];

    for (let day = 0; day <= 6; day++) {
      if (dailyHours[day] > maxHoursPerDay) {
        violations.push(`${dayNames[day]}: ${dailyHours[day]}hr (max ${maxHoursPerDay}hr)`);
      }
    }

    return violations.length > 0
      ? `Daily hours exceeded: ${violations.join(', ')}`
      : null;
  }

  /**
   * Save all pending updates via direct form POST.
   * Only 'save' action is allowed. 'submit' is strictly prohibited.
   */
  async batchSave(): Promise<{ success: boolean; message: string }> {
    if (!this.sessionInfo.authenticated) {
      throw new Error('Not authenticated');
    }

    if (this.pendingFormUpdates.size === 0) {
      return { success: true, message: 'No pending updates to save' };
    }

    try {
      console.log(`[Batch] Starting batch save with ${this.pendingFormUpdates.size} pending updates`);

      // 1. Ensure page is fetched (sets session attributes on server)
      //    Use cachedDate to re-fetch the same week — without it, daychoose.jsp
      //    defaults to the current week, which would silently save to the wrong week.
      const html = await this.fetchTimesheetPage(this.cachedDate ?? undefined);

      // 2. Get current form state
      const activities = parseActivityList(html);
      const timeEntries = parseTimearray(html);
      const overtimeEntries = parseOvertimeArray(html);
      const baseFormData = reconstructFormState(html, activities, timeEntries, overtimeEntries);

      // 3. Apply pending updates
      for (const [key, value] of this.pendingFormUpdates) {
        baseFormData[key] = value;
      }

      // 4. Recalculate norTotal after applying pending updates
      //    (weekinfo_deal.jsp reads norTotal{k} — NPE if missing or stale)
      const dailyHours = this.calculateDailyHours(baseFormData);
      for (let k = 0; k < 7; k++) {
        baseFormData[`norTotal${k}`] = (dailyHours[k] || 0).toString();
      }

      // 5. Validate daily hours
      const validationError = this.validateDailyHours(dailyHours, 8);
      if (validationError) {
        console.error(`[Batch] Validation failed: ${validationError}`);
        throw new Error(validationError);
      }
      console.log('[Batch] Daily hours validation passed:', dailyHours);

      // 6. Remove submit buttons (submit is STRICTLY PROHIBITED)
      delete baseFormData['submit'];
      delete baseFormData['submit2'];

      // 7. Add save action
      baseFormData['save'] = ' save ';

      // 8. POST to weekinfo_deal.jsp
      console.log('[Batch] POSTing to weekinfo_deal.jsp');
      const response = await this.httpClient.post(
        'Timecard/timecard_week/weekinfo_deal.jsp',
        baseFormData,
      );

      // 9. Check response
      const status = response.status;
      console.log(`[Batch] Response status: ${status}`);

      if (status === 302 || status === 301) {
        // Redirect means success — follow it to reload data
        const location = response.headers['location'];
        console.log(`[Batch] Success - redirecting to ${location}`);

        if (location) {
          await this.httpClient.get(location);
        }

        const savedCount = this.pendingFormUpdates.size;
        this.clearPendingUpdates();
        this.invalidateCache();

        return {
          success: true,
          message: `Batch save successful - saved ${savedCount} updates`,
        };
      } else if (status === 200) {
        // Check for error in response body
        if (response.body.includes('Error Page')) {
          throw new Error('Server returned error page');
        }

        const savedCount = this.pendingFormUpdates.size;
        this.clearPendingUpdates();
        this.invalidateCache();

        return {
          success: true,
          message: `Batch save completed - saved ${savedCount} updates`,
        };
      } else {
        throw new Error(`Unexpected response status: ${status}`);
      }
    } catch (error) {
      const errorMsg = `Batch save failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(`[Batch] ${errorMsg}`);
      throw new Error(errorMsg);
    }
  }
}
