# 鋼筋管理系統 API 與資料庫規格書

本文件依據前端規格需求，設計對應的後端 API 與資料庫架構。
考慮到使用 Next.js 開發的常見技術棧，資料庫規格採用 Prisma ORM 語法作為示範，並以 PostgreSQL 或 MySQL 等關聯式資料庫為目標。

---

## 1. 資料庫規格 (Database Schema)

基於前端需求（進貨、出貨、先進先出 FIFO 庫存扣除、廠商管理、規格管理），設計以下關聯式資料表模型。

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or mysql
  url      = env("DATABASE_URL")
}

// ----------------------------------------------------------------------
// 基本資料管理
// ----------------------------------------------------------------------

// 廠商 (Suppliers)
model Supplier {
  id        String    @id @default(uuid())
  name      String    @unique // 廠商名稱，如 "A 鋼鐵廠"
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // 關聯
  restocks  Restock[] // 該廠商的進貨紀錄
}

// 鋼筋規格 (RebarSpecs)
model RebarSpec {
  id        String    @id @default(uuid())
  code      String    @unique // 規格代碼，如 "4分筋", "#4"
  name      String    // 顯示名稱，如 "#4 (D13)"
  size      String    // 號數分群，如 "#4" (用於前端庫存按號數分群顯示)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // 關聯
  restocks  Restock[]  // 該規格的進貨紀錄
  shipments Shipment[] // 該規格的出貨紀錄
}

// ----------------------------------------------------------------------
// 交易紀錄與庫存管理
// ----------------------------------------------------------------------

// 進貨紀錄 (Restocks) - 同時作為庫存的來源 (支援 FIFO)
model Restock {
  id           String   @id @default(uuid())
  supplierId   String
  specId       String
  date         DateTime // 進貨時間
  qty          Float    // 原始進貨噸數
  cost         Float    // 每噸單價
  remainingQty Float    // 剩餘庫存噸數 (用於 FIFO 計算，預設等於 qty)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // 關聯
  supplier     Supplier @relation(fields: [supplierId], references: [id])
  spec         RebarSpec @relation(fields: [specId], references: [id])

  // 被哪些出貨單扣除 (一對多)
  deductions   ShipmentSource[]
}

// 出貨紀錄 (Shipments)
model Shipment {
  id        String   @id @default(uuid())
  specId    String
  date      DateTime // 出貨時間
  qty       Float    // 出貨總噸數
  note      String?  // 備註 (如：工地 A 使用)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 關聯
  spec      RebarSpec @relation(fields: [specId], references: [id])

  // 該次出貨扣除的庫存來源明細 (FIFO)
  sources   ShipmentSource[]
}

// 出貨來源明細 (ShipmentSources) - 關聯出貨與進貨 (FIFO 扣除紀錄)
model ShipmentSource {
  id           String   @id @default(uuid())
  shipmentId   String
  restockId    String
  qtyDeducted  Float    // 此次出貨從該筆進貨扣除了多少噸數
  cost         Float    // 記錄當時扣除的成本 (Snapshot，可選)
  createdAt    DateTime @default(now())

  // 關聯
  shipment     Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)
  restock      Restock  @relation(fields: [restockId], references: [id])
}

// 價格趨勢紀錄 (PriceTrends) - 用於首頁圖表 (選配，若不依賴實時計算)
model PriceTrend {
  id        String   @id @default(uuid())
  month     String   // 格式如 "2024-10" 或 "10月"
  size      String   // 號數如 "#3", "#4"
  avgPrice  Float    // 該月平均價格
  createdAt DateTime @default(now())

  @@unique([month, size]) // 確保每個月每個號數只有一筆統計
}
```

---

## 2. API 規格 (API Specification)

所有請求與回應皆採用 JSON 格式 (`application/json`)。

### 2.1 總覽 Dashboard (Home)

#### GET `/api/dashboard`
獲取首頁所需的所有統計資料。

*   **Response (200 OK):**
    ```json
    {
      "priceTrends": [
        { "month": "10月", "#3": 18500, "#4": 19000, "#5": 19200, "#6": 19500 },
        // ...
      ],
      "inventory": [
        {
          "code": "4分筋",
          "name": "#4 (D13) 標準筋",
          "qty": 39,
          "suppliers": [
            { "name": "東鋼", "qty": 20 },
            { "name": "豐興", "qty": 15 }
          ]
        }
      ],
      "recentShipments": [
        {
          "id": "uuid",
          "date": "2025-02-26 14:00",
          "spec": "4分筋 (#4 D13)",
          "qty": 12,
          "note": "工地 A 使用",
          "sources": [
            { "supplier": "C 資源回收", "qty": 12, "cost": 19500 }
          ]
        }
      ]
    }
    ```

### 2.2 基本資料管理 (Management)

#### GET `/api/suppliers`
取得所有廠商名單。
*   **Response (200 OK):**
    ```json
    [
      { "id": "uuid-1", "name": "A 鋼鐵廠" },
      { "id": "uuid-2", "name": "B 貿易商" }
    ]
    ```

#### POST `/api/suppliers`
新增廠商。
*   **Request Body:**
    ```json
    { "name": "台塑鋼鐵" }
    ```
*   **Response (201 Created):** 回傳新增的廠商物件。

#### DELETE `/api/suppliers/:id`
刪除廠商 (需確認無關聯進貨紀錄，或進行軟刪除/限制刪除)。

#### GET `/api/specs`
取得所有鋼筋規格清單。
*   **Response (200 OK):**
    ```json
    [
      { "id": "uuid-1", "code": "3分筋", "name": "#3 (D10)", "size": "#3" },
      { "id": "uuid-2", "code": "4分筋", "name": "#4 (D13)", "size": "#4" }
    ]
    ```

#### POST `/api/specs`
新增鋼筋規格。
*   **Request Body:**
    ```json
    {
      "code": "5分筋",
      "name": "#5 (D16)",
      "size": "#5" // 前端可能無此欄位，後端可從 code/name 解析
    }
    ```

#### DELETE `/api/specs/:id`
刪除規格。

### 2.3 進出貨登錄 (Restock & Ship)

#### POST `/api/restocks`
批次新增進貨紀錄。
*   **Request Body:**
    ```json
    {
      "items": [
        {
          "supplierId": "uuid", // 或 supplierName (後端自動匹配/建立)
          "specId": "uuid",     // 或 specCode
          "date": "2025-02-26T14:00:00Z",
          "qty": 20,
          "cost": 19500
        }
      ]
    }
    ```
*   **Response (201 Created):**
    ```json
    { "message": "Successfully created 1 restock records.", "count": 1 }
    ```

#### POST `/api/shipments`
批次新增出貨紀錄 (**重要：後端需實作 FIFO 邏輯扣除 `Restock.remainingQty`**)。
*   **Request Body:**
    ```json
    {
      "items": [
        {
          "specId": "uuid",    // 或 specCode
          "date": "2025-02-26T14:00:00Z",
          "qty": 12,
          "note": "工地 A 使用"
        }
      ]
    }
    ```
*   **Response (201 Created):**
    *   後端邏輯：
        1. 針對每個出貨項目，尋找該 `specId` 下 `remainingQty > 0` 且 `date` 最早的 `Restock` 紀錄 (先進先出)。
        2. 扣除數量，若該筆 `Restock` 數量不足，則扣除至 0 後，繼續尋找下一筆最早的 `Restock`。
        3. 建立 `Shipment` 紀錄。
        4. 建立 `ShipmentSource` 紀錄，關聯 `Shipment` 與對應扣除的 `Restock` 及 `qtyDeducted`。
    ```json
    { "message": "Successfully created shipments and deducted inventory.", "count": 1 }
    ```

### 2.4 紀錄與月結 (History)

#### GET `/api/history/summary`
取得指定月份的統計數據。
*   **Query Parameters:** `year=2025&month=2` (可選，未傳預設當月)
*   **Response (200 OK):**
    ```json
    {
      "inTons": 100,
      "outTons": 50,
      "totalCost": 1950000
    }
    ```

#### GET `/api/history/restocks`
取得歷史進貨/庫存明細列表 (可按廠商篩選)。
*   **Query Parameters:** `supplierId=uuid` (可選)
*   **Response (200 OK):**
    ```json
    [
      {
        "id": "uuid",
        "date": "2025-02-20T11:00:00Z",
        "supplier": { "id": "uuid", "name": "A 鋼鐵廠" },
        "spec": { "id": "uuid", "code": "4分筋", "name": "#4 (D13)", "size": "#4" },
        "qty": 25,          // 原始進貨量
        "remainingQty": 15, // 剩餘庫存量
        "cost": 21500
      }
    ]
    ```

#### GET `/api/history/shipments`
取得歷史出貨紀錄與 FIFO 扣除明細。
*   **Response (200 OK):**
    ```json
    [
      {
        "id": "uuid",
        "date": "2025-02-26T14:00:00Z",
        "spec": { "id": "uuid", "code": "4分筋", "name": "#4 (D13)" },
        "qty": 12,
        "note": "工地 A 使用",
        "sources": [
          {
            "supplier": "C 資源回收", // 關聯至 Restock -> Supplier
            "qty": 12,              // qtyDeducted
            "cost": 19500           // 扣除時的成本
          }
        ]
      }
    ]
    ```

---

## 後端開發建議 (Next.js App Router 實作)

1.  **資料夾結構：**
    建立 `/src/app/api/...` 目錄處理 Route Handlers。
    例如：`/src/app/api/restocks/route.ts` 處理 `POST /api/restocks`。
2.  **資料庫連線池：**
    使用 Prisma 時，確保在開發環境下不會建立過多連線 (建立 `prisma.ts` global instance)。
3.  **FIFO 交易保證 (Transaction)：**
    在處理 `POST /api/shipments` 時，**必須**使用資料庫交易 (e.g., `$transaction` in Prisma) 來鎖定紀錄並同時更新庫存 (`remainingQty`) 與新增出貨紀錄，避免並發 (Race Condition) 導致庫存扣除錯誤。
4.  **分頁與效能：**
    若紀錄增長迅速，`/api/history/restocks` 與 `/api/history/shipments` 應實作分頁 (Pagination: `limit`, `offset`/`cursor`) 或以日期範圍為條件進行過濾。