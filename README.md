# TimeCard MCP

A Model Context Protocol (MCP) implementation for automating timesheet management tasks using Playwright.

---

## 🚀 快速開始 (Quick Start)

推薦使用 `npx` 方式執行 TimeCard MCP 伺服器，這樣可以自動獲取最新版本且無需手動維護 (需要 Node.js v18+)。

```bash
# 1. 設定環境變數 (請替換為您的實際憑證)
export TIMECARD_USERNAME="your_username"
export TIMECARD_PASSWORD="your_password"
export TIMECARD_BASE_URL="http://your-timecard-server/app/"

# 2. 執行伺服器
npx git+https://github.com/keith-hung/timecard-mcp.git
```

### 與 Claude Desktop 整合

您可以直接在 Claude Desktop 配置中使用 `npx` 方式：

```json
{
  "mcpServers": {
    "timecard": {
      "command": "npx",
      "args": ["git+https://github.com/keith-hung/timecard-mcp.git"],
      "env": {
        "TIMECARD_USERNAME": "your_username",
        "TIMECARD_PASSWORD": "your_password",
        "TIMECARD_BASE_URL": "http://your-timecard-server/app/"
      }
    }
  }
}
```

**優點：**
*   自動保持最新版本
*   無需手動安裝和建置
*   配置簡潔
*   npx 會快取已下載的套件，不會每次都重新下載

**注意：** 請確保您的 `TIMECARD_BASE_URL` 包含應用程式路徑 (例如：`http://your-timecard-server/app/`)。

---

## 🛠️ 進階設定：本地開發 (Advanced Setup: Local Development)

如果您是開發者或需要特定版本控制、離線使用、或進行程式碼修改，可以選擇本地安裝：

### 1. 本地設定

```bash
# 1. 複製倉庫
git clone https://github.com/your-org/timecard-mcp.git
cd timecard-mcp

# 2. 安裝依賴並建置專案
npm install
npm run build
```

### 2. 設定環境變數

伺服器需要以下環境變數才能連接到您的 TimeCard 系統。您可以在專案根目錄建立 `.env` 檔案，或在您的 shell 中設定它們：

```bash
export TIMECARD_USERNAME="your_username"
export TIMECARD_PASSWORD="your_password"
export TIMECARD_BASE_URL="http://your-timecard-server/app/"
```

### 3. 新增至 Claude Desktop (本地版本)

編輯您的 `~/Library/Application Support/Claude/claude_desktop_config.json` 檔案：

```json
{
  "mcpServers": {
    "timecard": {
      "command": "node",
      "args": ["/absolute/path/to/timecard-mcp/dist/index.js"],
      "env": {
        "TIMECARD_USERNAME": "your_username",
        "TIMECARD_PASSWORD": "your_password",
        "TIMECARD_BASE_URL": "http://your-timecard-server/app/"
      }
    }
  }
}
```
**注意：** 請將 `/absolute/path/to/timecard-mcp/` 替換為您複製此倉庫的實際路徑。

**本地安裝的適用情況：**
*   需要修改或擴展程式碼
*   需要特定版本控制
*   完全離線環境
*   開發和調試需求

### 4. 重新啟動 Claude Desktop

設定完成後，重新啟動 Claude Desktop。您現在應該會看到 TimeCard 工具可用了！

---

## 📚 更多文件 (Additional Documentation)

- **[FEATURES.md](./docs/FEATURES.md)** - 詳細說明所有可用的 MCP 工具、其參數、回傳值和使用範例。
- **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** - 供希望了解、修改或擴展 TimeCard MCP 的開發人員參考的指南。

## License

MIT