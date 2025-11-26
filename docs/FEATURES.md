# TimeCard MCP Features Documentation

## Project Overview

TimeCard MCP is a Model Context Protocol (MCP) tool set designed for automated timesheet management, enabling AI Agents to handle timesheet filling, project management, and report queries.

## Target Use Cases

- Automated weekly timesheet filling
- Batch processing of multiple project hours
- Timesheet data validation and statistics
- Support for various input formats (JSON, tables, natural language)

## MCP Tools Reference

### Authentication

#### `timecard_login`

Login to the TimeCard system and establish a session.

**Parameters:**

- `username` (string, optional): Username (uses `TIMECARD_USERNAME` env var if not provided)
- `password` (string, optional): Password (uses `TIMECARD_PASSWORD` env var if not provided)

**Returns:**

- `success` (boolean): Login success status
- `message` (string): Status message

#### `timecard_logout`

Logout from TimeCard system and clear session.

**Parameters:** None

**Returns:**

- `success` (boolean): Logout success status
- `message` (string): Status message

#### `timecard_check_session`

Check current session status. Recommended after agent/MCP restart or 10+ minutes of inactivity.

**Parameters:** None

**Returns:**

- `authenticated` (boolean): Whether authenticated
- `username` (string): Current logged-in user
- `session_time` (string): Session duration
- `current_url` (string): Current browser page URL

---

### Data Retrieval

#### `timecard_get_timesheet`

Get timesheet data for a specific week. **This retrieves SAVED data only.**

**IMPORTANT:** Changes made with `set_entries`, `set_hours`, or `set_notes` are NOT visible until after calling `save`.

**Parameters:**

- `date` (string, required): Target date in "YYYY-MM-DD" format

**Returns:**

- `week_start` (string): Week start date
- `week_end` (string): Week end date
- `entries` (array): Timesheet entries
- `status` (string): Timesheet status (draft/submitted/approved)

**Example:**

```json
{
  "date": "2025-11-10"
}
```

#### `timecard_get_projects`

Get list of available projects for the user.

**Parameters:** None

**Returns:**

- `projects` (array): Project list
  - `id` (string): Project ID
  - `name` (string): Project name
  - `description` (string): Project description
- `count` (number): Number of projects

#### `timecard_get_activities`

Get list of activities for a specific project. Returns the `value` field needed for `set_entries`.

**Parameters:**

- `project_id` (string, required): Project ID

**Returns:**

- `project_id` (string): Project ID
- `activities` (array): Activity list
  - `id` (string): Activity ID
  - `name` (string): Activity name
  - `description` (string): Activity description
  - `value` (string): Activity value for use with `set_entries` (format: `bottom$uid$pid$progress`)
- `count` (number): Number of activities

**Example Response:**

```json
{
  "project_id": "17647",
  "activities": [
    { "id": "9", "name": "Communication", "description": "Communication", "value": "true$9$17647$100" },
    { "id": "5", "name": "Meeting", "description": "Meeting", "value": "true$5$17647$100" }
  ],
  "count": 2
}
```

---

### Timesheet Operations

All timesheet operations queue updates in memory. You **MUST** call `timecard_save` to permanently save changes.

#### `timecard_set_entries`

Queue project/activity settings for multiple entries.

**WORKFLOW:**
1. Call `timecard_get_activities` first to get the `value` field
2. Use the `value` as `activity_value` in this tool

**Parameters:**

- `updates` (array, required): Array of entry configurations
  - `entry_index` (integer): Entry index (0-9)
  - `project_id` (string): Project ID
  - `activity_value` (string): Activity value from `get_activities` (format: `bottom$uid$pid$progress`)

**Returns:**

- `success` (boolean): Queue success status
- `queued_entries` (number): Number of entries queued
- `total_pending` (number): Total pending updates
- `entries` (array): List of queued entries
- `message` (string): Status message

**Example:**

```json
{
  "updates": [
    { "entry_index": 0, "project_id": "17647", "activity_value": "true$9$17647$100" },
    { "entry_index": 1, "project_id": "17647", "activity_value": "true$5$17647$100" }
  ]
}
```

#### `timecard_set_hours`

Queue hour updates for multiple entries and days.

**Parameters:**

- `updates` (array, required): Array of hour updates
  - `entry_index` (integer): Entry index (0-9)
  - `day` (string): Day - supports multiple formats:
    - Day names: "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
    - Numeric index: "0", "1", "2", "3", "4", "5" (0=Monday)
    - Full date: "2025-11-10"
  - `hours` (number): Hours to set

**Returns:**

- `success` (boolean): Queue success status
- `queued_updates` (number): Number of updates queued
- `total_pending` (number): Total pending updates
- `updates` (array): List of queued updates
- `message` (string): Status message

**Example:**

```json
{
  "updates": [
    { "entry_index": 0, "day": "monday", "hours": 8.0 },
    { "entry_index": 0, "day": "tuesday", "hours": 8.0 },
    { "entry_index": 1, "day": "monday", "hours": 4.0 }
  ]
}
```

#### `timecard_set_notes`

Queue note updates for multiple entries and days.

**RESTRICTION:** Notes **cannot** contain these special characters: `#$%^&*=+{}[]|?'"`

**Parameters:**

- `updates` (array, required): Array of note updates
  - `entry_index` (integer): Entry index (0-9)
  - `day` (string): Day (same format as `timecard_set_hours`)
  - `note` (string): Note content

**Returns:**

- `success` (boolean): Queue success status
- `queued_updates` (number): Number of updates queued
- `total_pending` (number): Total pending updates
- `updates` (array): List of queued updates
- `message` (string): Status message

**Example:**

```json
{
  "updates": [
    { "entry_index": 0, "day": "monday", "note": "Development work" },
    { "entry_index": 1, "day": "tuesday", "note": "Code review" }
  ]
}
```

#### `timecard_save`

Submit all queued updates via direct form POST.

**CRITICAL:** This is the only way to permanently save your changes. All `set_*` operations only queue updates in memory until this is called.

**NOTE:** Only 'save' (draft) is supported. 'submit' (for approval) is strictly prohibited.

**Parameters:** None

**Returns:**

- `success` (boolean): Save success status
- `saved_updates` (number): Number of updates saved
- `message` (string): Result message

#### `timecard_discard`

Discard all pending updates without saving.

**Parameters:** None

**Returns:**

- `success` (boolean): Discard success status
- `cleared_updates` (number): Number of updates cleared
- `message` (string): Status message

---

### Management

#### `timecard_get_summary`

Get summary statistics for a timesheet week.

**Parameters:**

- `date` (string, required): Target date in "YYYY-MM-DD" format

**Returns:**

- `week_start` (string): Week start date
- `week_end` (string): Week end date
- `total_hours` (number): Total hours
- `active_entries` (number): Number of active entries
- `daily_totals` (object): Daily hour totals
- `project_breakdown` (object): Hours by project
- `average_daily_hours` (number): Average daily hours
- `statistics` (object): Additional statistics
  - `max_daily_hours` (number): Maximum daily hours
  - `min_daily_hours` (number): Minimum daily hours
  - `working_days` (number): Days with hours
  - `unique_projects` (number): Number of projects

---

## Usage Examples

### Standard Workflow

```python
# Step 1: Get activities to obtain activity_value
activities = get_activities("17647")
# Returns: [{ id: "9", value: "true$9$17647$100", name: "Communication" }, ...]

# Step 2: Get current timesheet to see what exists
get_timesheet("2025-11-10")

# Step 3: Queue ALL entry configurations (use activity_value from step 1)
set_entries([
  {"entry_index": 0, "project_id": "17647", "activity_value": "true$9$17647$100"},
  {"entry_index": 1, "project_id": "17647", "activity_value": "true$5$17647$100"}
])

# Step 4: Queue ALL hours
set_hours([
  {"entry_index": 0, "day": "monday", "hours": 8.0},
  {"entry_index": 0, "day": "tuesday", "hours": 8.0},
  {"entry_index": 1, "day": "monday", "hours": 4.0}
])

# Step 5: Queue ALL notes (optional)
set_notes([
  {"entry_index": 0, "day": "monday", "note": "Development work"}
])

# Step 6: Submit everything at once
save()

# Step 7: Verify saved data
get_timesheet("2025-11-10")
```

### Incremental Filling (Adding More Days)

```python
# Entries 0-1 already configured with Mon-Wed hours
# Just add new days directly (no need to re-configure entries)

set_hours([
  {"entry_index": 0, "day": "thursday", "hours": 8.0},
  {"entry_index": 0, "day": "friday", "hours": 8.0}
])
save()
get_timesheet("2025-11-10")  # Verify
```

### Modifying Existing Hours

```python
# Direct overwrite (no clear needed)
set_hours([
  {"entry_index": 0, "day": "monday", "hours": 4.0}  # Was 8, change to 4
])
save()
```

### Deleting Hours

```python
# Set hours to 0 to delete
set_hours([
  {"entry_index": 0, "day": "monday", "hours": 0}
])
save()
```

---

## Error Handling

### Common Error Types

1. **Authentication Errors**
   - `AUTHENTICATION_FAILED`: Login failed
   - `SESSION_EXPIRED`: Session expired
   - `PERMISSION_DENIED`: Insufficient permissions

2. **Data Errors**
   - `INVALID_DATE`: Invalid date format
   - `INVALID_PROJECT`: Project not found
   - `INVALID_ACTIVITY`: Activity not found
   - `INVALID_INDEX`: Entry index out of range (0-9)

3. **Business Logic Errors**
   - `TIMESHEET_LOCKED`: Timesheet is locked
   - `HOURS_EXCEEDED`: Hours exceed limit

### Error Response Format

```json
{
  "success": false,
  "error_code": "INVALID_PROJECT",
  "message": "Project ID '12345' not found or no access",
  "details": {
    "requested_project": "12345",
    "available_projects": ["17647", "17648"]
  }
}
```

---

## Best Practices

### Workflow Order

1. **Get activities first** - Call `get_activities` to obtain `activity_value` for each activity
2. **Get current timesheet** - Call `get_timesheet` to see existing data
3. **Configure ALL entries** - Use `set_entries` with `activity_value` from step 1
4. **Fill ALL hours** - Use `set_hours` for all entries and days
5. **Add ALL notes** - Use `set_notes` if needed
6. **Save once** - Call `save` to submit everything in a single POST

### Session Management

- Check session status with `check_session` after restarts or idle periods
- Call `logout` when operations are complete

### Error Recovery

- Re-login automatically on session expiration
- Provide detailed error information to users on validation failures

### Performance

- Batch all operations before saving
- All `set_*` calls queue in memory - single POST on `save`
- Cache project and activity lists when possible

---

## Technical Notes

### entry_index Mapping

- `entry_index: 0` → `project0`, `activity0`, `record0_*`
- `entry_index: 1` → `project1`, `activity1`, `record1_*`
- Up to 10 entries supported (0-9)

### day Parameter Mapping

- `monday/0` → `record*_0`
- `tuesday/1` → `record*_1`
- `wednesday/2` → `record*_2`
- `thursday/3` → `record*_3`
- `friday/4` → `record*_4`
- `saturday/5` → `record*_5`

### System Limits

- Maximum 10 timesheet entries (entry_index 0-9)
- 6 working days per week (Monday to Saturday)
- Hours precision to one decimal place
- Notes cannot contain: `#$%^&*=+{}[]|?'"`
