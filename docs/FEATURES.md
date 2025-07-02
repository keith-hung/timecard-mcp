# MCP 功能規格文件

## 專案概述

MCP (Model Context Protocol) 是一個專為工時記錄系統設計的 MCP 工具集，讓 AI Agent 能夠自動化處理工時填寫、專案管理和報表查詢等任務。

## 目標應用場景

- 自動化週工時填寫
- 批次處理多個專案的工時記錄
- 工時資料驗證和統計
- 支援各種格式的工時資料輸入（JSON、表格、自然語言等）

## MCP 工具功能清單

### 認證管理

#### `timecard_login`

登入工時系統並建立會話。

**參數：**

- `username` (string): 使用者帳號
- `password` (string): 使用者密碼

**回傳：**

- `success` (boolean): 登入是否成功
- `message` (string): 狀態訊息

**範例：**

```json
{
  "username": "user001",
  "password": "password123"
}
```

#### `timecard_logout`

登出工時系統並清除會話。

**參數：** 無

**回傳：**

- `success` (boolean): 登出是否成功
- `message` (string): 狀態訊息

#### `timecard_check_session`

檢查目前會話狀態。建議在 Agent 或 MCP 重新啟動後，或超過 10 分鐘閒置後呼叫此工具，以確保會話有效。

**參數：** 無

**回傳：**

- `authenticated` (boolean): 是否已認證
- `username` (string): 目前登入的使用者
- `session_time` (string): 會話已持續時間
- `current_url` (string): 瀏覽器目前所在的頁面 URL

### 基礎資料操作

#### `timecard_get_timesheet`

取得指定日期所在週的工時表資料。
**重要：** 此工具只會顯示**已儲存**的資料。使用 `set_timesheet_entry`、`set_daily_hours` 或 `set_daily_note` 進行的變更，必須在呼叫 `timecard_save_timesheet` **之後**才會在此處顯示。

**參數：**

- `date` (string): 目標日期，格式為 "YYYY-MM-DD"

**回傳：**

- `week_start` (string): 該週開始日期
- `week_end` (string): 該週結束日期
- `entries` (array): 工時條目陣列
- `status` (string): 工時表狀態 (draft/submitted/approved)

**範例：**

```json
{
  "date": "2025-07-07"
}
```

#### `timecard_get_projects`

取得使用者可選擇的專案清單。

**參數：** 無

**回傳：**

- `projects` (array): 專案清單
  - `id` (string): 專案 ID
  - `name` (string): 專案名稱
  - `description` (string): 專案描述

#### `timecard_get_activities`

取得指定專案的活動清單。

**參數：**

- `project_id` (string): 專案 ID

**回傳：**

- `activities` (array): 活動清單
  - `id` (string): 活動 ID
  - `name` (string): 活動名稱
  - `description` (string): 活動描述

### 工時條目操作

#### `timecard_set_timesheet_entry`

設定指定位置的專案和活動。
**重要：** 此操作僅暫時更新介面，您**必須**呼叫 `timecard_save_timesheet` 來永久儲存變更。

**參數：**

- `entry_index` (integer): 條目索引 (0-9)
- `project_id` (string): 專案 ID
- `activity_id` (string): 活動 ID

**回傳：**

- `success` (boolean): 設定是否成功
- `entry_index` (integer): 設定的條目索引
- `project_name` (string): 專案名稱
- `activity_name` (string): 活動名稱

**範例：**

```json
{
  "entry_index": 0,
  "project_id": "17647",
  "activity_id": "true$6$17647$0"
}
```

#### `timecard_set_daily_hours`

設定指定條目和日期的工時。
**重要：** 此操作僅暫時更新介面，您**必須**呼叫 `timecard_save_timesheet` 來永久儲存變更。

**參數：**

- `entry_index` (integer): 條目索引 (0-9)
- `day` (string): 日期，支援多種格式：
  - 星期名稱: "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
  - 數字索引: "0", "1", "2", "3", "4", "5" (0=週一)
  - 完整日期: "2025-07-07"
- `hours` (number): 工時數量

**回傳：**

- `success` (boolean): 設定是否成功
- `entry_index` (integer): 條目索引
- `day` (string): 設定的日期
- `hours` (number): 設定的工時

**範例：**

```json
{
  "entry_index": 0,
  "day": "monday",
  "hours": 8.0
}
```

#### `timecard_set_daily_note`

設定指定條目和日期的工作備註。
**重要：** 此操作僅暫時更新介面，您**必須**呼叫 `timecard_save_timesheet` 來永久儲存變更。
**限制：** 備註內容**不可**包含以下特殊字元：`#$%^&*=+{}[]|?'"`

**參數：**

- `entry_index` (integer): 條目索引 (0-9)
- `day` (string): 日期（格式同 `timecard_set_daily_hours`）
- `note` (string): 備註內容

**回傳：**

- `success` (boolean): 設定是否成功
- `entry_index` (integer): 條目索引
- `day` (string): 設定的日期
- `note` (string): 設定的備註

#### `timecard_clear_timesheet_entry`

清空指定條目的所有資料。
**重要：** 此操作僅暫時更新介面，您**必須**呼叫 `timecard_save_timesheet` 來永久儲存變更。

**參數：**

- `entry_index` (integer): 條目索引 (0-9)

**回傳：**

- `success` (boolean): 清空是否成功
- `entry_index` (integer): 清空的條目索引

### 狀態檢查與儲存

#### `timecard_save_timesheet`

永久儲存目前的工時表。
**關鍵步驟：** 在使用任何 `set_*` 或 `clear_*` 工具後，您**必須**呼叫此工具以保存您的變更。

**參數：** 無

**回傳：**

- `success` (boolean): 儲存是否成功
- `message` (string): 儲存結果訊息
- `timestamp` (string): 儲存時間
- `current_url` (string): 儲存後所在的頁面 URL

#### `timecard_validate_timesheet`

檢查目前工時表（包含未儲存的變更）的完整性和有效性。建議在儲存前呼叫此工具。

**參數：** 無

**回傳：**

- `valid` (boolean): 工時表是否有效
- `errors` (array): 錯誤訊息清單
- `warnings` (array): 警告訊息清單
- `total_hours` (number): 總工時數
- `details` (object): 包含詳細統計的物件
  - `error_count` (number): 錯誤數量
  - `warning_count` (number): 警告數量

#### `timecard_get_summary`

取得目前工時表（包含未儲存的變更）的統計資訊。

**參數：**

- `date` (string): 目標日期，格式為 "YYYY-MM-DD"

**回傳：**

- `week_start` (string): 週開始日期
- `week_end` (string): 週結束日期
- `total_hours` (number): 總工時
- `active_entries` (number): 有效的條目數量
- `daily_totals` (object): 每日工時統計
- `project_breakdown` (object): 專案工時分佈
- `average_daily_hours` (number): 平均每日工時
- `statistics` (object): 其他統計數據
  - `max_daily_hours` (number): 最高單日工時
  - `min_daily_hours` (number): 最低單日工時
  - `working_days` (number): 有工時的天數
  - `unique_projects` (number): 專案總數

## 使用範例

### 基本工時填寫流程

```python
# 1. 登入系統
result = timecard_login("username", "password")

# 2. 取得本週工時表 (可選，用於查看已儲存資料)
timesheet = timecard_get_timesheet("2025-07-07")

# 3. 設定第一個條目：專案開發
timecard_set_timesheet_entry(0, "17647", "true$6$17647$0")

# 4. 填寫週一到週三的工時和備註
for day_index, hours in enumerate([8.0, 8.0, 8.0]):
    timecard_set_daily_hours(0, str(day_index), hours)
    timecard_set_daily_note(0, str(day_index), "系統開發工作")

# 5. 設定第二個條目：測試活動
timecard_set_timesheet_entry(1, "17647", "true$5$17647$0")
timecard_set_daily_hours(1, "thursday", 8.0)
timecard_set_daily_note(1, "thursday", "系統測試")

# 6. 驗證並儲存 (關鍵步驟)
validation = timecard_validate_timesheet()
if validation["valid"]:
    print("工時表驗證通過，正在儲存...")
    timecard_save_timesheet()
    print("儲存成功！")
else:
    print("工時表驗證失敗:", validation["errors"])

# 7. 重新取得工時表以確認變更
updated_timesheet = timecard_get_timesheet("2025-07-07")
print("更新後的工時表:", updated_timesheet)
```

### 批次處理範例

```python
# Agent 接收 JSON 格式的工時資料
timesheet_data = {
    "week": "2025-07-07",
    "entries": [
        {
            "project_id": "17647",
            "activity_id": "true$6$17647$0",
            "hours": {"monday": 8, "tuesday": 8, "wednesday": 8, "thursday": 8, "friday": 4},
            "notes": {"daily": "系統開發工作"}
        },
        {
            "project_id": "17647",
            "activity_id": "true$5$17647$0",
            "hours": {"friday": 4},
            "notes": {"friday": "系統測試"}
        }
    ]
}

# Agent 自動轉換為 MCP 調用序列
timecard_get_timesheet(timesheet_data["week"])
for i, entry in enumerate(timesheet_data["entries"]):
    timecard_set_timesheet_entry(i, entry["project_id"], entry["activity_id"])
    for day, hours in entry["hours"].items():
        timecard_set_daily_hours(i, day, hours)
        # 處理備註邏輯...
# (此處應接續儲存邏輯)
timecard_save_timesheet()
```

## 錯誤處理

### 常見錯誤類型

1. **認證錯誤**

   - `AUTHENTICATION_FAILED`: 登入失敗
   - `SESSION_EXPIRED`: 會話過期
   - `PERMISSION_DENIED`: 權限不足

2. **資料錯誤**

   - `INVALID_DATE`: 日期格式錯誤
   - `INVALID_PROJECT`: 專案不存在
   - `INVALID_ACTIVITY`: 活動不存在
   - `INVALID_INDEX`: 條目索引超出範圍

3. **業務邏輯錯誤**
   - `TIMESHEET_LOCKED`: 工時表已鎖定
   - `DUPLICATE_ENTRY`: 重複條目
   - `HOURS_EXCEEDED`: 工時超出限制

### 錯誤回應格式

```json
{
  "success": false,
  "error_code": "INVALID_PROJECT",
  "message": "專案 ID '12345' 不存在或無權限存取",
  "details": {
    "requested_project": "12345",
    "available_projects": ["17647", "17648"]
  }
}
```

## 最佳實踐

### Agent 使用建議

1. **關鍵工作流程**
   - **修改 -> 儲存 -> 驗證**：始終遵循 `set_*` -> `save` -> `get` 的順序。
   - **儲存前驗證**：在呼叫 `timecard_save_timesheet` 之前，先使用 `timecard_validate_timesheet` 檢查錯誤。

2. **會話管理**

   - 開始操作前使用 `timecard_check_session` 檢查會話狀態。
   - 操作完成後建議呼叫 `timecard_logout`。

3. **錯誤恢復**

   - 遇到會話過期時自動重新登入。
   - 資料驗證失敗時提供詳細錯誤資訊給使用者。

4. **效能最佳化**

   - 批次操作時，先進行所有 `set_*` 修改，最後再進行**一次** `timecard_save_timesheet` 呼叫。
   - 快取不常變動的資料，如專案和活動清單。

## 技術備註

### entry_index 對應關係

- `entry_index: 0` 對應工時系統的 `activity0`, `record0_*`, `weekrecord0`
- `entry_index: 1` 對應工時系統的 `activity1`, `record1_*`, `weekrecord1`
- 以此類推，最多支援 10 個條目 (0-9)

### day 參數映射

- `monday/0` → `record*_0` (週一)
- `tuesday/1` → `record*_1` (週二)
- `wednesday/2` → `record*_2` (週三)
- `thursday/3` → `record*_3` (週四)
- `friday/4` → `record*_4` (週五)
- `saturday/5` → `record*_5` (週六)

### 系統限制

- 最多 10 個工時條目 (entry_index 0-9)
- 每週 6 個工作日 (週一到週六)
- 工時精度支援到小數點後一位
- 備註長度限制需依系統實際限制調整