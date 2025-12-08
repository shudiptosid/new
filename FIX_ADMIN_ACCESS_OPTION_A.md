# Option A: Automatic Admin Profile Creation

## Step-by-Step Instructions

### Step 1: Sign Out

1. Go to your website
2. Click on your profile/logout button
3. Sign out completely

### Step 2: Sign In Again

1. Go to `/login` page
2. Enter credentials:
   - Email: `circuitcraftersiot@gmail.com`
   - Password: [your password]
3. Click "Sign In"

### Step 3: Check Browser Console

**IMPORTANT:** Open browser console (Press F12) BEFORE logging in

After login, you should see these messages in the console:

✅ **Expected Console Output:**

```
📋 Fetching profile for user: 294b238a-2a78-410b-b979-285a9aaf5732
❌ Profile fetch error: {code: 'PGRST116', ...}
🔧 Profile not found, attempting to create it...
✅ Profile created successfully: { email: 'circuitcraftersiot@gmail.com', role: 'admin', full_name: 'circuitcraftersiot' }
🔄 Auth state changed: SIGNED_IN | User: circuitcraftersiot@gmail.com
✅ Profile loaded: circuitcraftersiot@gmail.com Role: admin
```

### Step 4: Navigate to Admin Panel

1. After successful login, go to `/admin`
2. You should see:
   - "Verifying admin access..." (for 1 second)
   - Then the Admin Panel loads! 🎉

### Step 5: Console Check for Admin Access

When you navigate to `/admin`, console should show:

```
ProtectedRoute: Waiting for profile check... {email: 'circuitcraftersiot@gmail.com', ...}
ProtectedRoute: Admin check {isAdminEmail: true, isAdminRole: true, ...}
ProtectedRoute: Access granted
```

---

## What's Happening Automatically?

The code now:

1. Tries to fetch profile from database
2. Detects error code `PGRST116` (profile doesn't exist)
3. Automatically creates the profile with:
   - `id`: Your user ID from auth.users
   - `email`: circuitcraftersiot@gmail.com
   - `role`: **'admin'** (because email matches)
   - `full_name`: From user metadata or email
4. Saves the profile to database
5. Grants admin access

---

## If It Still Doesn't Work

Share the console output and we'll use Option B (manual SQL fix).

---

## Quick Checklist

- [ ] Sign out completely
- [ ] Open browser console (F12)
- [ ] Sign in with circuitcraftersiot@gmail.com
- [ ] Watch console for "✅ Profile created successfully"
- [ ] Navigate to /admin
- [ ] Admin panel loads successfully!
