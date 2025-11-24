# TimeCard MCP Implementation Notes

## Current Status (2025-11-18)

### Issue: Cannot Access `act` Object from TimeCard Page

**Problem**:
- `page.content()` 取得的 HTML 不包含 `act.append()` 的程式碼
- `page.evaluate()` 無法存取 `act` 全域物件
- 導致 `timecard_get_projects` 和 `timecard_get_activities` 失敗

**Root Cause**:
- TimeCard MCP 使用自己的 Playwright browser session (headless)
- 該 session 在登入後可能因為某些原因導向 error page
- `act` 物件只存在於正常載入的 timesheet 頁面中

**Error Page URL**: `http://tcrs.cybersoft.tw/TCRS/errorMsg/error.jsp`

---

## Error Page Parsing Strategy

### Error Page HTML Structure

```html
<p align="center"><font color="red">Error Page</font></p>

<table align="center">
  <tr>
    <td colspan="2">
      <b>Error occurs when verifying the user through Org Verification! ...</b>
    </td>
  </tr>
  <tr>
    <td>Exception Type: </td>
    <td>class org.apache.axis.AxisFault</td>
  </tr>
  <tr>
    <td>Exception Message: </td>
    <td>java.lang.Exception: Can't auth ad by given username...</td>
  </tr>
</table>
```

### Key Information to Extract

| Field | Description |
|-------|-------------|
| **Title** | "Error Page" (red font) |
| **Main Message** | General error description |
| **Exception Type** | Java exception class |
| **Exception Message** | Detailed error message |

### Detection Method

**Method 1: Check URL**
```typescript
const currentUrl = page.url();
if (currentUrl.includes('/errorMsg/error.jsp')) {
  // Parse error page
}
```

**Method 2: Parse Error Information**
```typescript
const errorInfo = await page.evaluate(() => {
  // Check if this is error page
  const title = document.querySelector('p[align="center"] font[color="red"]')?.textContent;
  if (title !== 'Error Page') {
    return null;
  }

  // Extract error details from table
  const rows = Array.from(document.querySelectorAll('table[align="center"] tr'));

  let mainMessage = '';
  let exceptionType = '';
  let exceptionMessage = '';

  for (const row of rows) {
    const cells = row.querySelectorAll('td');
    if (cells.length === 2 || cells.length === 3) {
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
    isError: true,
    mainMessage,
    exceptionType,
    exceptionMessage
  };
});
```

---

## Proposed Implementation

### 1. Add Error Checking to `timecard-session.ts`

**Add interface:**
```typescript
export interface ErrorInfo {
  isError: true;
  mainMessage: string;
  exceptionType: string;
  exceptionMessage: string;
}
```

**Add method:**
```typescript
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
      if (cells.length === 2 || cells.length === 3) {
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
      isError: true,
      mainMessage,
      exceptionType,
      exceptionMessage
    };
  });

  return errorInfo;
}
```

### 2. Update `login()` Method

```typescript
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
```

### 3. Update Tool Handlers in `data-tools.ts`

**Add error checking after navigation:**
```typescript
handler: async (args, session: TimeCardSession) => {
  const authResult = await session.ensureAuthenticated();
  if (!authResult.success) {
    throw new Error(authResult.message);
  }

  const page = session.getPage();
  if (!page) {
    throw new Error('Browser page not available');
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    await session.navigateToTimesheet(today);

    // Check if redirected to error page
    const errorInfo = await session.checkForErrorPage();
    if (errorInfo) {
      throw new Error(`TimeCard Error: ${errorInfo.mainMessage}\nException: ${errorInfo.exceptionMessage}`);
    }

    // Continue with normal logic...
    const projectsData = await page.evaluate(() => {
      // ...
    });

    // ...
  } catch (error) {
    throw new Error(`Failed to get projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
```

---

## Alternative Solution: Use Playwright MCP Instead

### Consideration

Since Playwright MCP can successfully:
- Navigate to TimeCard pages
- Access `act` object in browser context (verified manually)
- Execute JavaScript in the correct browser environment

**Potential Approach**:
1. Remove the custom Playwright browser session in TimeCard MCP
2. Use Playwright MCP tools as the underlying browser automation layer
3. TimeCard MCP tools become "orchestrators" that call Playwright MCP tools

**Pros**:
- Reuse existing working Playwright browser session
- Avoid duplicate browser sessions
- Simpler implementation

**Cons**:
- TimeCard MCP would depend on Playwright MCP being available
- More complex tool orchestration logic
- Potential session management issues

---

## Next Steps

1. ✅ Analyze error page structure (COMPLETED)
2. ⏳ Implement `checkForErrorPage()` in `timecard-session.ts`
3. ⏳ Update `login()` method to check for error page
4. ⏳ Update all tool handlers to check for error page after navigation
5. ⏳ Test with actual TimeCard server
6. ⏳ Consider alternative approach using Playwright MCP

---

## Current Implementation Code Locations

- **Session Management**: `src/timecard-session.ts`
- **Data Tools**: `src/tools/data-tools.ts`
  - `timecardGetProjects` (lines 16-83)
  - `timecardGetActivities` (lines 85-142)
  - `timecardGetTimesheet` (lines 144-234)
  - `timecardDebugPageContent` (lines 236-282) - Debug tool

- **Auth Tools**: `src/tools/auth-tools.ts`
- **Timesheet Tools**: `src/tools/timesheet-tools.ts`
- **Management Tools**: `src/tools/management-tools.ts`
