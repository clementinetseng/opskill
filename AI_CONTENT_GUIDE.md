# HOKS AI 內容生成指南 (AI Content Production Guide)

本文件定義了 HOKS 系統的內容標準，用於確保外部 AI 模型生成的內容與系統架構完全相容。

---

## 1. 核心格式規範
- **副檔名**: `.mdx`
- **語系**: 繁體中文 (zh-TW)
- **元數據**: 每個檔案必須包含標題、描述、難度與標籤。

```yaml
---
title: "檔案標題"
description: "簡短描述"
difficulty: "Easy" | "Intermediate" | "Senior"
tags: ["標籤"]
---
```

---

## 2. 內容類型架構 (Content Types)

根據目標模組，選擇適用的架構：

### 類型 A： Wiki/知識百科 (適用於 Onboarding, Knowledge Base)
**特點**：側重於資訊傳遞、定義、架構說明，非線性步驟。
- **架構建議**：
  1. **背景/定義**：解釋該業務或產品是什麼。
  2. **核心概念**：使用表格或清單說明重點。
  3. **常見問答 (Optional)**：整理新入職人員最常問的問題。
  4. **相關資源**：連結到其他 SOP 或外部工具。

### 類型 B： SOP/操作手冊 (適用於 Campaign Ops, Risk & CS, Routine)
**特點**：側重於執行動作、檢查點與話術。
- **架構建議**：
  1. **準備工作**：所需權限與工具。
  2. **標準作業流程**：有序列表 (Step 1, 2, 3)。
  3. **異常處理**：如果發生錯誤該怎麼辦。
  4. **互動組件**：如 `<CheckItem />`, `<DepositCalculator />`。

---

## 3. 可用互動組件 (MDX Components)

| 組件名稱 | 用途 | 程式碼範例 |
| :--- | :--- | :--- |
| `<ScriptCopy />` | 複製對話稿/指令 | `<ScriptCopy text="文字" label="標籤" />` |
| `<CheckItem />` | 風險點勾選 | `<CheckItem id="id" severity="high">內容</CheckItem>` |
| `<DepositCalculator />` | 金額/手續費計算 | `<DepositCalculator />` |

---

## 4. 不同類型的範例 (Showcase)

### 範例 1：Wiki 類型 (市場概況)
```mdx
---
title: "東南亞市場概況介紹"
description: "針對越南與印尼市場的支付與用戶行為說明"
difficulty: "Easy"
tags: ["市場知識", "Onboarding"]
---

# 市場概況
本文件提供區域市場的基礎知識，供新進業務人員參考。

## 支付習慣
| 國家 | 主要支付方式 | 注意事項 |
| :--- | :--- | :--- |
| 越南 | MOMO Wallet, 電匯 | 銀行轉帳需備註 ID |
| 印尼 | Dana, OVO | 簡訊驗證碼延遲較高 |

## 用戶特性
- 偏好色彩強烈的廣告。
- 下午 6 點至 10 點為流量高峰。
```

### 範例 2：SOP 類型 (手動補點)
```mdx
---
title: "手動點數注入 SOP"
description: "當系統自動派發失敗時的手動執行流程"
difficulty: "Intermediate"
tags: ["活動營運"]
---

# 執行步驟
1. 進入後台「人工補點」分頁。
2. 使用工具計算最終金額：
<DepositCalculator />

3. 確認風控狀態：
<CheckItem id="risk-check" severity="high">確認用戶無洗錢嫌疑</CheckItem>
```

---

## 5. 模組定位建議
- `00_Onboarding`: **Wiki 為主** (公司文化、基礎設施、產業知識)
- `01_Knowledge_Base`: **Wiki 為主** (產品定義、規則)
- `02_Tools_Tech`: **SOP 為主** (後台操作、各項系統)
- `03_Campaign_Ops`: **SOP 為主** (活動處理流程)
- `04_Risk_CS`: **SOP 為主** (風控審核、客訴處理)
- `05_Daily_Routine`: **混合型** (交班流程、系統檢查清單)
