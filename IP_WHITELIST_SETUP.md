# Dual-Layer IP Whitelist Setup Guide

## Overview

The HOKS system uses two distinct IP whitelists for protection without requiring passwords:
- **Level 1: ALLOWED_IPS** - Controls who can **view** the site (Dashboard, Wiki).
- **Level 2: ALLOWED_EDITOR_IPS** - Controls who can **edit** the site (Create/Edit SOPs).

Only authorized IPs can access the site. **No passwords are required.**

---

## Step 1: Configure Whitelists in Render

1. **Login to Render Dashboard**
   - Click on your "hoks" service

2. **Add Environment Variables**
   - Click **"Environment"** tab
   - Click **"Add Environment Variable"**

3. **Configure the Two Whitelists:**

| Key | Purpose | Required For |
|-----|---------|--------------|
| `ALLOWED_IPS` | Site-wide View Access | Dashboard, Wiki, Learning Mode |
| `ALLOWED_EDITOR_IPS` | Editor/Write Access | /editor routes, Creating/Updating SOPs |

**Example Setup:**

```
ALLOWED_IPS: 38.54.37.172, 123.45.67.89 (All team IPs)
ALLOWED_EDITOR_IPS: 38.54.37.172 (Only supervisor/admin IPs)
```

*Note: If an IP is in ALLOWED_EDITOR_IPS, it should usually also be in ALLOWED_IPS to see the dashboard.*

4. **Save Changes**
   - Render will redeploy (~5 minutes)

---

## Access Denied Behaviors

1. **If IP not in `ALLOWED_IPS`**:
   - ❌ Blocker: **"Access Denied"**
   - User cannot see anything on the site.

2. **If IP in `ALLOWED_IPS` but NOT in `ALLOWED_EDITOR_IPS`**:
   - ✅ Can view Dashboard and Wiki.
   - ❌ Blocker: **"Editor Access Denied"** when clicking "Editor" or trying to save.

3. **If IP in BOTH**:
   - ✅ Full access to view and edit. No password needed.

---

## Managing Access

### Add a Viewer
1. Get their IP.
2. Add to `ALLOWED_IPS` comma-separated list.

### Add an Editor
1. Get their IP.
2. Add to `ALLOWED_IPS` (to let them in).
3. Add to `ALLOWED_EDITOR_IPS` (to let them edit).

---

## Troubleshooting

### Issue: "Editor Access Denied" but I should be an editor
**Solution:**
1. Check the IP shown on the error page.
2. Ensure that specific IP is added to `ALLOWED_EDITOR_IPS` in Render.

### Issue: Cannot see the site at all
**Solution:**
1. Ensure your IP is in `ALLOWED_IPS`.
