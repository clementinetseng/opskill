# Site-wide IP Whitelist Setup Guide

## Overview

The entire HOKS system is now protected by IP Whitelist:
- **Dashboard** - Restricted
- **Wiki** - Restricted
- **Editor** - Double protection (IP + Password)
- **Learning Mode** - Restricted

Only authorized IPs can access the site.

---

## Step 1: Configure IP Whitelist in Render

1. **Login to Render Dashboard**
   - Go to https://dashboard.render.com
   - Click on your "hoks" service

2. **Add Environment Variable**
   - Click **"Environment"** tab
   - Click **"Add Environment Variable"**

3. **Add ALLOWED_IPS:**

   ```
   Key: ALLOWED_IPS
   Value: 38.54.37.172
   ```
   
   **To add multiple IPs (office, home, VPN):**
   ```
   Value: 38.54.37.172,123.45.67.89,98.76.54.32
   ```

4. **Keep existing Editor variables:**
   - `ALLOWED_EDITOR_IPS` - Editor-specific IPs (can be same as ALLOWED_IPS)
   - `EDITOR_PASSWORD` - Editor password

5. **Save Changes**
   - Click **"Save Changes"**
   - Render will redeploy (~5 minutes)

---

## Step 2: Test Access Control

### Test 1: Authorized IP

**From your office/home (IP: 38.54.37.172):**
1. Visit: `https://your-app.onrender.com`
2. ✅ Should see the Dashboard normally
3. Navigate to Wiki, Editor, etc.
4. ✅ Everything works

### Test 2: Unauthorized IP

**From mobile data or different location:**
1. Visit: `https://your-app.onrender.com`
2. ❌ Should see "Access Denied" page
3. Shows your current IP
4. Cannot access any part of the site

---

## Access Levels

### Level 1: Site Access (ALLOWED_IPS)
**Who:** All employees
**Access:** Dashboard, Wiki, SOPs, Learning Mode
**Restriction:** IP Whitelist only

### Level 2: Editor Access (ALLOWED_EDITOR_IPS + Password)
**Who:** Content managers, supervisors
**Access:** Create/Edit SOPs
**Restriction:** IP Whitelist + Password

---

## Common Scenarios

### Scenario 1: Office Only Access

```
ALLOWED_IPS=123.45.67.89
ALLOWED_EDITOR_IPS=123.45.67.89
EDITOR_PASSWORD=YourPassword
```

**Result:**
- Only office IP can view site
- Same IP can edit (with password)

### Scenario 2: Multiple Locations

```
ALLOWED_IPS=123.45.67.89,98.76.54.32,38.54.37.172
ALLOWED_EDITOR_IPS=123.45.67.89
EDITOR_PASSWORD=YourPassword
```

**Result:**
- 3 IPs can view site
- Only office IP (123.45.67.89) can edit

### Scenario 3: Your Current Setup

```
ALLOWED_IPS=38.54.37.172
ALLOWED_EDITOR_IPS=38.54.37.172
EDITOR_PASSWORD=YourPassword
```

**Result:**
- Only your IP can access anything
- Same IP can edit (with password)

---

## Managing IPs

### Add New Employee IP

1. Get their IP: https://whatismyipaddress.com
2. Go to Render → Environment
3. Edit `ALLOWED_IPS`
4. Add: `existing-ips,new-ip-here`
5. Save (will redeploy)

### Remove Employee Access

1. Remove their IP from `ALLOWED_IPS`
2. Save
3. They will be blocked immediately

### Dynamic IP Handling

If employees have dynamic IPs (home internet):
- **Option A:** Use VPN with static IP
- **Option B:** Add IP range (not recommended)
- **Option C:** Update IP when it changes

---

## Security Features

### 🔒 Protection Layers

1. **Middleware IP Check** - First line of defense
   - Blocks at Next.js level
   - Custom 403 page
   - Shows blocked IP

2. **Editor Password** - Second layer
   - Only for content editing
   - 7-day token storage

### ✅ What's Protected

- **Everything** - Dashboard, Wiki, SOPs, Editor, Learning Mode
- **Except** - Static files (_next/static, images)

---

## Troubleshooting

### Issue: Can't access from office

**Solution:**
1. Check your current IP: https://whatismyipaddress.com
2. Verify it matches `ALLOWED_IPS` in Render
3. If different, update the environment variable
4. Wait for redeploy (~5 minutes)

### Issue: Works at office, not at home

**Solution:**
- This is expected if home IP not in whitelist
- Add home IP to `ALLOWED_IPS`
- Or use VPN

### Issue: "Access Denied" shows wrong IP

**Solution:**
- The IP shown is what Render sees
- Might be different from whatismyipaddress.com
- Use the IP shown on the error page
- Add that IP to whitelist

---

## Development Mode

When running locally (`npm run dev`):
- IP whitelist is **disabled**
- Allows all IPs for development
- Editor password still required

---

## Quick Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `ALLOWED_IPS` | Site-wide access | `38.54.37.172,123.45.67.89` |
| `ALLOWED_EDITOR_IPS` | Editor access | `38.54.37.172` |
| `EDITOR_PASSWORD` | Editor password | `OpSkill2024!` |

---

## Your Current Configuration

**Authorized IP:** `38.54.37.172`

**Recommended Settings:**
```
ALLOWED_IPS=38.54.37.172
ALLOWED_EDITOR_IPS=38.54.37.172
EDITOR_PASSWORD=YourSecurePassword
```

This gives you:
- ✅ Full site access from your IP
- ✅ Editor access with password
- ❌ Everyone else blocked

---

## Next Steps

1. Wait for Render deployment to complete
2. Test access from your IP
3. Test from mobile data (should be blocked)
4. Add team member IPs as needed
