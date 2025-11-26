# TimeCard MCP

A Model Context Protocol (MCP) server for automating TimeCard timesheet management using Playwright browser automation.

## ⚡ Performance Optimizations

This MCP uses batch operations exclusively for optimal performance:

- **🚀 Batch Operations**: Queue multiple updates and submit in a single request
  - 75% faster than legacy UI-based operations
  - Zero UI operations - direct form POST to server

- **💾 Session Persistence**: Browser context reuse between restarts
  - 60% reduction in re-login frequency
  - Session state saved and restored automatically

**Workflow:**
- Use `timecard_set_entries` + `timecard_set_hours` + `timecard_set_notes` + `timecard_save`

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

**2. Workflow Order**
- Configure ALL entries first
- Then fill ALL hours
- Then add ALL notes
- Finally save once

**3. Data Visibility**
- `set_*` functions queue updates in memory (temporary)
- `save` writes to server (permanent)
- `get_timesheet` reads from server (only shows saved data)
- Always call `save` before verifying with `get_timesheet`

### Standard Workflow

```python
# Step 1: Get current timesheet to see what exists
get_timesheet("2025-11-05")

# Step 2: Queue ALL entry configurations
set_entries([
  {"entry_index": 0, "project_id": "17647", "activity_id": "9"},   # Communication
  {"entry_index": 1, "project_id": "17647", "activity_id": "5"},   # Meeting
  {"entry_index": 2, "project_id": "17647", "activity_id": "12"}   # Development
])

# Step 3: Queue ALL hours
set_hours([
  {"entry_index": 0, "day": "monday", "hours": 1.5},
  {"entry_index": 0, "day": "tuesday", "hours": 1.5},
  {"entry_index": 1, "day": "monday", "hours": 2},
  {"entry_index": 1, "day": "tuesday", "hours": 3},
  {"entry_index": 2, "day": "monday", "hours": 4.5}
  # ... continue for all entries and days
])

# Step 4: Queue ALL notes (optional)
set_notes([
  {"entry_index": 1, "day": "monday", "note": "Team meeting"},
  {"entry_index": 2, "day": "monday", "note": "Bug fixing"}
  # ... continue for all notes
])

# Step 5: Submit everything at once (single POST request)
save()

# Step 6: Verify saved data
get_timesheet("2025-11-05")
```

### Incremental Filling (Adding More Days)

If the week already has Mon-Wed filled and you need to add Thu-Fri:

```python
# Entries 0-2 already configured with Mon-Wed hours
# Just add new days directly (no need to re-configure entries)

set_hours([
  {"entry_index": 0, "day": "thursday", "hours": 1.5},
  {"entry_index": 0, "day": "friday", "hours": 1.5},
  {"entry_index": 2, "day": "thursday", "hours": 2.5}
])
save()
get_timesheet("2025-11-05")  # Verify
```

### Common Mistakes to Avoid

❌ **DON'T check get_timesheet before save**
```python
# Wrong - won't see changes yet
set_hours([{"entry_index": 0, "day": "monday", "hours": 8}])
get_timesheet("2025-11-05")  # Shows old data!
```

❌ **DON'T change project/activity of existing entry**
```python
# Wrong - clears all hours!
set_entries([{"entry_index": 0, "project_id": "17647", "activity_id": "9"}])
set_hours([{"entry_index": 0, "day": "monday", "hours": 1.5}])
save()

set_entries([{"entry_index": 0, "project_id": "17647", "activity_id": "5"}])  # Changed activity - hours cleared!
```

### Expected Success Rate

Following this workflow:
- ✅ First-time success rate: 90%+
- ✅ Tool calls needed: 5-6 for a full week
- ✅ Single POST request for all changes

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

The TimeCard MCP server provides 12 tools organized into 4 categories:

### Authentication
- `timecard_login` - Login to TimeCard system
- `timecard_logout` - Logout from TimeCard system
- `timecard_check_session` - Check current session status

### Data Retrieval
- `timecard_get_projects` - Get available projects
- `timecard_get_activities` - Get activities for a project
- `timecard_get_timesheet` - Get timesheet data for a week
- `timecard_get_summary` - Get timesheet summary statistics

### Timesheet Operations
- `timecard_set_entries` - Queue project/activity configurations
- `timecard_set_hours` - Queue hour updates
- `timecard_set_notes` - Queue note updates
- `timecard_save` - Submit all queued updates in single POST
- `timecard_discard` - Discard queued updates

See [FEATURES.md](./docs/FEATURES.md) for detailed usage.

## License

MIT