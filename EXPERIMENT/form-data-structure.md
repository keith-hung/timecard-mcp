# TimeCard Form Data Structure Analysis

這份文件詳細說明 TimeCard 系統儲存工時表單時的 POST 資料格式結構。

## 基本控制參數

| 參數     | 值           | 說明                         |
| -------- | ------------ | ---------------------------- |
| `save2`  | `+save+`     | 儲存動作識別碼               |
| `caller` | `this_week`  | 呼叫來源，表示從本週頁面發起 |
| `cdate`  | `2025-09-01` | 選擇的基準日期               |

## 工時記錄結構

TimeCard 支援最多 25 個工時記錄項目（索引 0-24），每個項目包含以下欄位：

**說明**: `{N}` 代表工時記錄項目的索引編號，範圍從 0 到 24

### 專案與活動設定

- `project{N}` - 專案 ID，例如：`project0=17647`（第 0 個記錄項目的專案 ID）
- `activity{N}` - 活動設定字串（URL 編碼），例如：`activity0=true%2412%2417647%240`

### 每日工時記錄（週一到週日：0-6）

每個工時項目針對一週的每一天都有對應的記錄欄位：

#### 週一（索引 0）

- `record{N}_0` - 週一工時數，例如：`record0_0=4.0`
- `note{N}_0` - 週一備註，例如：`note0_0=cccc`

#### 週二（索引 1）

- `record{N}_1` - 週二工時數
- `note{N}_1` - 週二備註

#### 週三（索引 2）

- `record{N}_2` - 週三工時數
- `note{N}_2` - 週三備註

#### 週四（索引 3）

- `record{N}_3` - 週四工時數
- `note{N}_3` - 週四備註

#### 週五（索引 4）

- `record{N}_4` - 週五工時數
- `note{N}_4` - 週五備註

#### 週六（索引 5）

- `record{N}_5` - 週六工時數
- `note{N}_5` - 週六備註

#### 週日（索引 6）

- `record{N}_6` - 週日工時數
- `note{N}_6` - 週日備註

## 每日總計

系統會計算每天的正常工時總計（**必要欄位**）：

- `norTotal0` - 週一總計（必須提供，可直接寫死為 0）
- `norTotal1` - 週二總計（必須提供，可直接寫死為 0）
- `norTotal2` - 週三總計（必須提供，可直接寫死為 0）
- `norTotal3` - 週四總計（必須提供，可直接寫死為 0）
- `norTotal4` - 週五總計（必須提供，可直接寫死為 0）
- `norTotal5` - 週六總計（必須提供，可直接寫死為 0）
- `norTotal6` - 週日總計（必須提供，可直接寫死為 0）

**重要**: 這 7 個 norTotal 參數是必要的，但可以直接寫死為 0，不會影響系統運作。

## 完整 HTTP Request 範例

### Request 基本資訊

- **URL**: `http://tcrs.cybersoft.tw/TCRS/Timecard/timecard_week/weekinfo_deal.jsp`
- **Method**: `POST`
- **Content-Type**: `application/x-www-form-urlencoded`

### 必要 Headers

```javascript
{
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "content-type": "application/x-www-form-urlencoded",
}
```

### Fetch API 完整範例

```javascript
fetch(
  "http://tcrs.cybersoft.tw/TCRS/Timecard/timecard_week/weekinfo_deal.jsp",
  {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "content-type": "application/x-www-form-urlencoded",
    },
    referrer:
      "http://tcrs.cybersoft.tw/TCRS/Timecard/timecard_week/daychoose.jsp?cho_date=2025-09-01",
    body: "save2=+save+&caller=this_week&cdate=2025-09-01&project0=17647&activity0=true%2412%2417647%240&record0_0=1.0&note0_0=Z&record0_1=0.5&note0_1=&record0_2=&note0_2=&record0_3=&note0_3=&record0_4=&note0_4=&record0_5=&note0_5=&record0_6=&note0_6=&norTotal0=0&norTotal1=0&norTotal2=0&norTotal3=0&norTotal4=0&norTotal5=0&norTotal6=0",
    method: "POST",
    mode: "cors",
    credentials: "include",
  }
);
```

## 最小可成功的 Form Data

以下是一個最小且可成功執行的 form data 範例：

```
save2=+save+&
caller=this_week&
cdate=2025-09-01&
project0=17647&
activity0=true%2412%2417647%240&
record0_0=1.0&note0_0=Z&
record0_1=0.5&note0_1=&
record0_2=&note0_2=&
record0_3=&note0_3=&
record0_4=&note0_4=&
record0_5=&note0_5=&
record0_6=&note0_6=&
norTotal0=0&
norTotal1=0&
norTotal2=0&
norTotal3=0&
norTotal4=0&
norTotal5=0&
norTotal6=0
```

**關鍵要素**:

1. **基本控制參數**: `save2`, `caller`, `cdate`
2. **至少一個完整的 entry**: `project0`, `activity0` 加上完整週資料
3. **完整週記錄**: `record0_0` 到 `record0_6`, `note0_0` 到 `note0_6`（即使某些天是空值）
4. **必要總計**: `norTotal0` 到 `norTotal6`（可全部設為 0）

**注意**: 移除了所有 `progress` 相關參數，證實這些參數不是必要的。

## 實際資料範例分析

從提供的 form data 可以看出：

### Entry 0（唯一有資料的項目）

- **專案**: `project0=17647`
- **活動**: `activity0=true%2412%2417647%240`
- **週一**: `record0_0=4.0`, `note0_0=cccc`（4 小時，備註"cccc"）
- **其他天**: 全部空值

### Entry 1-24

- 所有其他項目（project1 到 project24）都沒有設定專案和活動
- 所有工時記錄和備註都是空值

### 每日總計

- `norTotal0=4` - 週一總計 4 小時（來自 record0_0）
- `norTotal1-6=0` - 其他天數總計都是 0

## 資料格式特點

1. **索引範圍**: 支援 0-24 共 25 個工時記錄項目
2. **日期索引**: 0-6 分別代表週一到週日
3. **空值處理**: 未使用的欄位會以空值（`=&`）傳送
4. **URL 編碼**: 特殊字元會進行 URL 編碼（如 `%24` 代表 `$`）
5. **完整週資料要求**: 當某個 entry 設定了 `project{N}` 和 `activity{N}` 後，**必須包含該 entry 一整週的所有欄位**（`record{N}_0` 到 `record{N}_6`、`note{N}_0` 到 `note{N}_6`、`progress{N}_0` 到 `progress{N}_6`），否則無法順利更新
6. **norTotal 參數**: norTotal0~6 是必要參數，可以直接寫死為 0
