# TimeCard MCP

A Model Context Protocol (MCP) server for automating TimeCard timesheet management using Playwright browser automation.

---

## 🚀 Quick Start

**Recommended:** Use `npx` to run the TimeCard MCP server. This approach automatically fetches the latest version without manual maintenance (requires Node.js v18+).

```bash
# 1. Set environment variables (replace with your actual credentials)
export TIMECARD_USERNAME="your_username"
export TIMECARD_PASSWORD="your_password"
export TIMECARD_BASE_URL="http://your-timecard-server/app/"

# 2. Run the server
npx git+https://github.com/keith-hung/timecard-mcp.git
```

### Claude Desktop Integration

You can use the `npx` method directly in Claude Desktop configuration:

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

**Benefits:**
* Automatically stays up-to-date
* No manual installation or build required
* Simple configuration
* npx caches downloaded packages - won't re-download every time

**Note:** Ensure your `TIMECARD_BASE_URL` includes the application path (e.g., `http://your-timecard-server/app/`).

---

## 🛠️ Advanced Setup: Local Development

For developers or users requiring specific version control, offline usage, or code modifications, you can opt for local installation:

### 1. Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/keith-hung/timecard-mcp.git
cd timecard-mcp

# 2. Install dependencies and build
npm install
npm run build
```

### 2. Environment Configuration

The server requires the following environment variables to connect to your TimeCard system. You can create a `.env` file in the project root or set them in your shell:

```bash
export TIMECARD_USERNAME="your_username"
export TIMECARD_PASSWORD="your_password"
export TIMECARD_BASE_URL="http://your-timecard-server/app/"
```

### 3. Add to Claude Desktop (Local Version)

Edit your `~/Library/Application Support/Claude/claude_desktop_config.json` file:

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
**Note:** Replace `/absolute/path/to/timecard-mcp/` with the actual path where you cloned this repository.

**When to use local installation:**
* Code modification or extension required
* Specific version control needs
* Fully offline environment
* Development and debugging requirements

### 4. Restart Claude Desktop

After configuration, restart Claude Desktop. You should now see TimeCard tools available!

---

## 📚 Documentation

- **[FEATURES.md](./docs/FEATURES.md)** - Detailed documentation of all available MCP tools, parameters, return values, and usage examples
- **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** - Developer guide for understanding, modifying, or extending TimeCard MCP

## 🔧 Available Tools

The TimeCard MCP server provides 13 tools organized into 4 categories:

### Authentication
- `timecard_login` - Login to TimeCard system
- `timecard_logout` - Logout from TimeCard system
- `timecard_check_session` - Check current session status

### Data Retrieval
- `timecard_get_projects` - Get available projects
- `timecard_get_activities` - Get activities for a project
- `timecard_get_timesheet` - Get timesheet data for a week

### Timesheet Operations
- `timecard_set_timesheet_entry` - Set project and activity for an entry
- `timecard_set_daily_hours` - Set hours for a specific day
- `timecard_set_daily_note` - Set note for a specific day
- `timecard_clear_daily_hours` - Clear all hours for a specific day

### Management
- `timecard_save_timesheet` - Save timesheet changes permanently
- `timecard_validate_timesheet` - Validate timesheet for errors
- `timecard_get_summary` - Get timesheet summary statistics

See [FEATURES.md](./docs/FEATURES.md) for detailed usage.

## License

MIT