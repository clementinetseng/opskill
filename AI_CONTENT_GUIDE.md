# HOKS AI 內容生成指南 (AI Content Production Guide)

本文件定義了 HOKS 系統的內容標準，請將此文件內容作為 Prompt 提供給其他 AI 模型（如 Claude, GPT-4），以確保生成的 SOP 格式與系統完全相容。

---

## 1. 核心格式規範
- **副檔名**: `.mdx`
- **語系**: 繁體中文 (zh-TW)
- **目錄結構**: `content/[模組名稱]/[檔案名稱].mdx`

## 2. Frontmatter (元數據)
每個 MDX 檔案開頭必須包含 YAML 格式的元數據：

```yaml
---
title: "流程完整標題"
description: "一句話描述此流程的用途"
difficulty: "Easy" | "Intermediate" | "Senior"
tags: ["標籤1", "標籤2"]
---
```

## 3. 標準 SOP 結構
1.  **概述**: 說明此 SOP 的適用場景。
2.  **準備工作**: 工具、權限或前置檢查。
3.  **操作步驟**: 使用有序列表 (Numbered List)。
4.  **互動組件**: 插入下述 MDX 客製化組件。
5.  **AI 操作建議**: 放在檔案最末尾。

---

## 4. 可用組件 (MDX Components)

系統支援以下互動組件，請在生成時按需插入：

### A. 快捷腳本複製 (`<ScriptCopy />`)
用於客服對話稿或系統指令。
- `text`: 要複製的文字內容。
- `label`: 顯示在側邊的標籤。

```jsx
<ScriptCopy text="您好，關於您提到的存提款問題..." label="客服話術" />
```

### B. 關鍵檢查項 (`<CheckItem />`)
用於需要人工核對的風險點。
- `id`: 唯一 ID (英文)。
- `severity`: "low" | "medium" | "high"。

```jsx
<CheckItem id="verify-id" severity="high">
  請核對 VIP 證件照片是否與系統資料一致
</CheckItem>
```

### C. 存款/計算工具 (`<DepositCalculator />`)
用於手動補點或計算手續費。不需參數。

```jsx
<DepositCalculator />
```

---

## 5. AI 生成範例 (Golden Sample)

請參考以下範例格式進行生成：

```mdx
---
title: "會員身分異常解鎖流程"
description: "處理因多次登入失敗導致的帳號鎖定"
difficulty: "Easy"
tags: ["帳號安全", "客服常見問題"]
---

# 概述
當會員反映帳號被鎖定時，需依照此 SOP 進行身分驗證並解鎖。

## 1. 準備工作
- [ ] 進入後台「會員管理」頁面
- [ ] 確認該會員目前狀態為「LOCKED」

## 2. 操作流程

### 步驟 A：確認身分
詢問會員註冊之手機門號，並使用下述話術：
<ScriptCopy text="為了確保您的帳號安全，請提供您註冊時填寫的手機門號末五碼。" label="驗證話術" />

### 步驟 B：關鍵核對
<CheckItem id="phone-match" severity="medium">
  核對會員提供的手機門號是否與系統後台相符
</CheckItem>

### 步驟 C：執行解鎖
1. 點擊「解鎖帳號」按鈕。
2. 填寫解鎖原因。

---

### AI 指令 (專供 AI Agent 使用)
1. 獲取 [手機號碼] 後，比對 [後台數據]。
2. 若相符，提醒操作人員執行 [解鎖]。
```

## 6. 模組列表
請根據以下目錄結構存放內容：
- `00_Onboarding`: 入職與基礎
- `01_Knowledge_Base`: 平台知識
- `02_Tools_Tech`: 工具使用指南
- `03_Campaign_Ops`: 活動營運
- `04_Risk_CS`: 風控與客服
- `05_Daily_Routine`: 日常交班
