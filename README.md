# TimeCard MCP

A Model Context Protocol (MCP) implementation for automating timesheet management tasks using Playwright.

---

## 🚀 最快速入門 (Quickest Start)

如果您只是想快速測試 TimeCard MCP 伺服器，而不需要完整的本地設定，可以直接從 Git 倉庫使用 `npx` 執行 (需要 Node.js v16+)。

```bash
# 1. 設定環境變數 (請替換為您的實際憑證)
export TIMECARD_USERNAME="your_username"
export TIMECARD_PASSWORD="your_password"
export TIMECARD_BASE_URL="http://your-timecard-server/app/"

# 2. 執行伺服器
npx git+https://github.com/your-org/timecard-mcp.git
```

**注意：**
*   這將在您目前的終端機會話中執行伺服器。它不適用於持久的後台操作，也不適用於直接與 MCP 客戶端 (如 Claude Desktop) 整合。
*   請確保您的 `TIMECARD_BASE_URL` 包含應用程式路徑 (例如：`http://your-timecard-server/app/`)。

---

## 🛠️ 完整本地設定 (Full Local Setup for Integration)

如果您需要將 TimeCard MCP 伺服器與 Claude Desktop 或其他 MCP 客戶端進行長期整合，請按照以下步驟進行完整本地設定：

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

### 3. 新增至 Claude Desktop

編輯您的 `~/Library/Application Support/Claude/claude_desktop_config.json` 檔案，以新增 TimeCard MCP 伺服器：

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

### 4. 重新啟動 Claude Desktop

設定完成後，重新啟動 Claude Desktop。您現在應該會看到 TimeCard 工具可用了！

---

## 📚 更多文件 (Additional Documentation)

- **[FEATURES.md](./docs/FEATURES.md)** - 詳細說明所有可用的 MCP 工具、其參數、回傳值和使用範例。
- **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** - 供希望了解、修改或擴展 TimeCard MCP 的開發人員參考的指南。

## License

MIT