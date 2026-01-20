# 完整部署指南 - 從零開始

## 📋 前置準備

在開始之前，請確認您有：
- ✅ GitHub 帳號
- ✅ Render 帳號
- ✅ Git 已安裝在電腦上

---

## 第一部分：GitHub Repository 設定

### Step 1: 建立 GitHub Repository

1. **登入 GitHub**
   - 前往 [https://github.com](https://github.com)
   - 使用您的帳號登入

2. **建立新 Repository**
   - 點擊右上角的 **"+"** → 選擇 **"New repository"**
   - 填寫以下資訊：
     - **Repository name**: `hoks` (或您喜歡的名稱)
     - **Description**: `Hybrid Operations Knowledge System`
     - **Visibility**: 選擇 **Private** (建議)
     - **不要勾選** "Add a README file"
     - **不要勾選** "Add .gitignore"
     - **不要勾選** "Choose a license"
   - 點擊 **"Create repository"**

3. **複製 Repository URL**
   - 建立完成後，您會看到一個頁面
   - 複製 HTTPS URL (類似：`https://github.com/你的帳號/hoks.git`)

---

### Step 2: 初始化本地 Git Repository

開啟 PowerShell 或 CMD，切換到專案目錄：

```bash
cd c:\Users\clementine.tseng_the\Documents\skilltest
```

執行以下指令：

```bash
# 初始化 Git (如果還沒有)
git init

# 設定主分支名稱為 main
git branch -M main

# 加入所有檔案
git add .

# 建立第一個 commit
git commit -m "Initial commit: HOKS system ready for deployment"

# 連結到 GitHub (替換成您的 URL)
git remote add origin https://github.com/你的帳號/hoks.git

# 推送到 GitHub
git push -u origin main
```

> **注意：** 如果這是第一次使用 Git，可能需要設定使用者資訊：
> ```bash
> git config --global user.name "Your Name"
> git config --global user.email "your.email@example.com"
> ```

---

### Step 3: 確認檔案已上傳

1. 回到 GitHub 網頁
2. 重新整理頁面
3. 確認您可以看到所有檔案（`src/`, `content/`, `package.json` 等）

---

## 第二部分：Render 部署設定

### Step 4: 登入 Render

1. **前往 Render**
   - 開啟 [https://dashboard.render.com](https://dashboard.render.com)
   - 使用 GitHub 帳號登入（推薦）或註冊新帳號

2. **授權 GitHub**
   - 如果是第一次使用，Render 會要求授權存取您的 GitHub
   - 點擊 **"Authorize Render"**

---

### Step 5: 建立 Blueprint

1. **開始建立服務**
   - 在 Render Dashboard，點擊右上角 **"New +"**
   - 選擇 **"Blueprint"**

2. **連接 Repository**
   - 選擇 **"Connect a repository"**
   - 找到您剛剛建立的 `hoks` repository
   - 點擊 **"Connect"**

3. **套用 Blueprint**
   - Render 會自動偵測到 `render.yaml` 檔案
   - 您會看到以下服務將被建立：
     - ✅ **Web Service**: hoks
     - ✅ **PostgreSQL Database**: hoks-db
   - 點擊 **"Apply"** 開始部署

---

### Step 6: 等待部署完成

部署過程約需 **5-10 分鐘**，您會看到以下階段：

1. **Creating services...** (建立服務)
2. **Installing dependencies...** (安裝套件)
3. **Building...** (編譯 Next.js)
4. **Starting...** (啟動伺服器)

**監控進度：**
- 點擊 **"hoks"** 服務
- 查看 **"Logs"** 標籤
- 等待看到 `✓ Ready in XXXms` 訊息

---

### Step 7: 取得網址並測試

1. **找到您的網址**
   - 在 hoks 服務頁面，您會看到類似：
     ```
     https://hoks-xxxx.onrender.com
     ```
   - 複製這個網址

2. **測試網站**
   - 在瀏覽器開啟該網址
   - **第一次載入會比較慢**（約 30 秒），因為 Free Tier 會 spin down
   - 確認以下功能：
     - [ ] Dashboard 正常顯示
     - [ ] 點擊 "Wiki" 可以看到所有 SOP
     - [ ] 點擊任一 SOP 可以正常顯示
     - [ ] 點擊 "Editor" 可以進入編輯器

---

## 第三部分：初始化資料庫（選用）

如果未來需要使用者進度追蹤功能，需要建立資料表：

### Step 8: 連接到 PostgreSQL

1. **取得資料庫連線資訊**
   - 在 Render Dashboard，點擊 **"hoks-db"** 資料庫
   - 點擊 **"Connect"**
   - 複製 **"External Database URL"**

2. **使用 psql 連線**（需要安裝 PostgreSQL 客戶端）
   ```bash
   psql <貼上您的 DATABASE_URL>
   ```

3. **建立資料表**
   ```sql
   CREATE TABLE IF NOT EXISTS user_progress (
     id SERIAL PRIMARY KEY,
     user_id VARCHAR(255) NOT NULL,
     sop_id VARCHAR(255) NOT NULL,
     completed BOOLEAN DEFAULT FALSE,
     completed_at TIMESTAMP,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     UNIQUE(user_id, sop_id)
   );

   CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
   ```

4. **確認建立成功**
   ```sql
   \dt
   ```
   應該會看到 `user_progress` 表格

---

## 第四部分：後續更新

### 如何更新內容？

**方法一：使用 Web Editor（推薦）**
1. 前往 `https://your-app.onrender.com/editor`
2. 直接在網頁上新增/編輯 SOP
3. 儲存後立即生效（無需重新部署）

**方法二：透過 Git 更新**
1. 在本地修改檔案
2. 執行：
   ```bash
   git add .
   git commit -m "Update SOPs"
   git push origin main
   ```
3. Render 會自動偵測並重新部署（約 5 分鐘）

---

## 常見問題排解

### Q1: Git push 時要求輸入密碼？

**解決方法：**
使用 Personal Access Token 代替密碼：
1. 前往 GitHub → Settings → Developer settings → Personal access tokens
2. 建立新 token，勾選 `repo` 權限
3. 複製 token
4. 在 push 時，密碼欄位貼上 token

### Q2: Render 部署失敗？

**檢查項目：**
1. 確認 `render.yaml` 檔案存在於根目錄
2. 確認 `package.json` 有 `build` 和 `start` scripts
3. 查看 Render Logs 找出錯誤訊息

### Q3: 網站顯示 404？

**解決方法：**
1. 確認 `content/` 資料夾已推送到 GitHub
2. 檢查 Render Logs 是否有檔案讀取錯誤
3. 確認 Next.js build 成功完成

### Q4: 資料庫連線失敗？

**解決方法：**
1. 確認 `DATABASE_URL` 環境變數已設定
2. 檢查 PostgreSQL 服務狀態
3. 確認 `src/lib/db.ts` 檔案存在

---

## 完成檢查清單

部署完成後，請確認：

- [ ] GitHub Repository 已建立並推送成功
- [ ] Render Blueprint 已套用
- [ ] Web Service 顯示 "Live"
- [ ] PostgreSQL Database 顯示 "Available"
- [ ] 可以透過網址存取網站
- [ ] Dashboard、Wiki、Editor 都正常運作
- [ ] 可以在 Editor 建立新 SOP
- [ ] 新建立的 SOP 可以在 Wiki 看到

---

## 需要協助？

如果遇到任何問題，請提供：
1. 錯誤訊息截圖
2. Render Logs 內容
3. 您執行的指令

我會立即協助您排除問題！
