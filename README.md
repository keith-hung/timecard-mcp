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

## 🤖 Quick Start for AI Agents

If you're an AI agent using TimeCard MCP to fill timesheets, follow this proven workflow for best results.

### Core Principles

**1. Entry Immutability**
- Once an entry is configured with a project/activity, NEVER change it
- Changing project/activity clears ALL hours for that entry
- Use different entry indices (0-9) for different project/activity combinations

**2. Batch Operations**
- Configure ALL entries first
- Then fill ALL hours
- Then add ALL notes
- Finally save once
- This prevents UI synchronization issues

**3. Data Visibility**
- `set_*` functions only update browser UI (temporary)
- `save_timesheet` writes to server (permanent)
- `get_timesheet` reads from server (only shows saved data)
- Always save before verifying with get_timesheet

### Standard Workflow

```python
# Step 1: Get current timesheet to see what exists
get_timesheet("2025-11-05")

# Step 2: Configure ALL entries you need
set_timesheet_entry(0, "17647", "9")   # Communication
set_timesheet_entry(1, "17647", "5")   # Meeting
set_timesheet_entry(2, "17647", "12")  # Development

# Step 3: Fill ALL hours (batch)
set_daily_hours(0, "monday", 1.5)
set_daily_hours(0, "tuesday", 1.5)
set_daily_hours(1, "monday", 2)
set_daily_hours(1, "tuesday", 3)
set_daily_hours(2, "monday", 4.5)
# ... continue for all entries and days

# Step 4: Add ALL notes (batch)
set_daily_note(1, "monday", "Team meeting")
set_daily_note(2, "monday", "Bug fixing")
# ... continue for all notes

# Step 5: Validate before saving
validate_timesheet()

# Step 6: Save once
save_timesheet()

# Step 7: Verify the saved data
get_timesheet("2025-11-05")
```

### Incremental Filling (Adding More Days)

If the week already has Mon-Wed filled and you need to add Thu-Fri:

```python
# Entries 0-2 already configured with Mon-Wed hours
# Just add new days directly (no need to re-configure entries)

set_daily_hours(0, "thursday", 1.5)
set_daily_hours(0, "friday", 1.5)
set_daily_hours(2, "thursday", 2.5)
# ...

save_timesheet()
get_timesheet("2025-11-05")  # Verify
```

### Common Mistakes to Avoid

❌ **DON'T mix entry setup and hour filling**
```python
# Wrong - causes UI sync issues
set_timesheet_entry(0, "17647", "9")
set_daily_hours(0, "monday", 1.5)  # May fail
set_timesheet_entry(1, "17647", "5")
```

❌ **DON'T check get_timesheet before saving**
```python
# Wrong - won't see changes yet
set_daily_hours(0, "monday", 8)
get_timesheet("2025-11-05")  # Shows old data!
```

❌ **DON'T change project/activity of existing entry**
```python
# Wrong - clears all hours!
set_timesheet_entry(0, "17647", "9")
set_daily_hours(0, "monday", 1.5)
save_timesheet()

set_timesheet_entry(0, "17647", "5")  # Changed activity - hours cleared!
```

### Expected Success Rate

Following this workflow:
- ✅ First-time success rate: 80%+
- ✅ Tool calls needed: <10 for a full week
- ✅ "Selector disabled" errors: Rare

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