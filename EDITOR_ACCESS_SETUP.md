# Editor Access Control Setup Guide

## Overview

The Editor is now protected by:
1. **IP Whitelist** - Only authorized IPs can access
2. **Password Protection** - Additional security layer
3. **Token Storage** - Remember authentication for 7 days

---

## Step 1: Configure Environment Variables in Render

1. **Login to Render Dashboard**
   - Go to https://dashboard.render.com
   - Click on your "hoks" service

2. **Add Environment Variables**
   - Click **"Environment"** tab
   - Click **"Add Environment Variable"**

3. **Add the following variables:**

   **Variable 1: ALLOWED_EDITOR_IPS**
   ```
   Key: ALLOWED_EDITOR_IPS
   Value: 38.54.37.172
   ```
   
   > **Note:** To add multiple IPs, separate with commas:
   > ```
   > 38.54.37.172,123.45.67.89,98.76.54.32
   > ```

   **Variable 2: EDITOR_PASSWORD**
   ```
   Key: EDITOR_PASSWORD
   Value: your-secure-password-here
   ```
   
   > **Important:** Choose a strong password!
   > Example: `OpSkill2024!Secure`

4. **Save Changes**
   - Click **"Save Changes"**
   - Render will automatically redeploy (takes ~5 minutes)

---

## Step 2: Test Access Control

### Test 1: Access from Authorized IP

1. **From your office/home (IP: 38.54.37.172)**
   - Visit: `https://your-app.onrender.com/editor`
   - You should see a password input page
   - Enter the password you set
   - Click "Access Editor"
   - ✅ You should be redirected to the editor

2. **Token Storage**
   - Close the browser
   - Open again and visit `/editor`
   - ✅ Should automatically log you in (token valid for 7 days)

### Test 2: Access from Unauthorized IP

1. **From a different location (e.g., mobile data)**
   - Visit: `https://your-app.onrender.com/editor`
   - ❌ Should show "Access denied. Your IP (xxx.xxx.xxx.xxx) is not authorized"

---

## Step 3: Managing Access

### Add New Authorized IP

1. Go to Render Dashboard → Environment
2. Edit `ALLOWED_EDITOR_IPS`
3. Add new IP: `38.54.37.172,NEW.IP.HERE`
4. Save (will redeploy)

### Change Password

1. Go to Render Dashboard → Environment
2. Edit `EDITOR_PASSWORD`
3. Enter new password
4. Save (will redeploy)
5. All users will need to re-authenticate

### Remove Access

1. Remove IP from `ALLOWED_EDITOR_IPS`
2. Save
3. That IP will be blocked immediately

---

## Security Features

### ✅ What's Protected

- `/editor` - Editor index (redirects to auth)
- `/editor/new` - Create new SOP
- `/editor/edit/*` - Edit existing SOPs
- `/editor/list` - SOP list (actual editor page)

### ✅ What's NOT Protected (Public Access)

- `/dashboard` - Dashboard
- `/wiki` - Wiki index
- `/sop/*` - View SOPs
- `/learn` - Learning mode

### 🔒 Security Layers

1. **IP Whitelist** - First line of defense
2. **Password** - Second layer
3. **LocalStorage Token** - Convenience (7-day expiry)

---

## Troubleshooting

### Issue: "Access denied" even with correct IP

**Solution:**
- Check if your IP has changed (dynamic IP)
- Update `ALLOWED_EDITOR_IPS` in Render
- Clear browser cache and try again

### Issue: "Invalid password"

**Solution:**
- Double-check the password in Render Environment
- Passwords are case-sensitive
- Clear LocalStorage: Open DevTools → Application → Local Storage → Clear

### Issue: Can't access after 7 days

**Solution:**
- This is normal - token expired
- Simply re-enter the password
- Token will be refreshed for another 7 days

---

## Development Mode

When running locally (`npm run dev`):
- IP whitelist is **disabled** (allows all IPs)
- Password still required
- Default password: `admin123` (if not set)

---

## Quick Reference

| Setting | Purpose | Example |
|---------|---------|---------|
| `ALLOWED_EDITOR_IPS` | IP whitelist | `38.54.37.172,123.45.67.89` |
| `EDITOR_PASSWORD` | Editor password | `OpSkill2024!Secure` |
| Token Expiry | Auto-logout | 7 days |

---

## Next Steps

After deployment completes:
1. Test access from your IP
2. Try accessing from mobile data (should be blocked)
3. Share the password with authorized team members
4. Add their IPs to the whitelist

**Your current authorized IP:** `38.54.37.172`
