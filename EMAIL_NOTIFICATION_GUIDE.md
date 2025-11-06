# 📧 EMAIL NOTIFICATION SYSTEM - Complete Setup Guide

## 🎯 Overview

When admin replies to a customer:

1. ✅ Reply saves to database
2. ✅ User sees reply in dashboard
3. ✅ **Email sent to user automatically** ← NEW!

---

## 🚀 QUICK SETUP (30 minutes)

### Step 1: Create Email Table in Supabase (5 mins)

1. **Open Supabase Dashboard** → SQL Editor
2. **Copy** entire content of `EMAIL_SYSTEM_SCHEMA.sql`
3. **Paste and Run**
4. **Verify:** `SELECT * FROM email_notifications;`

**Result:** ✅ Email queue table created

---

### Step 2: Setup Resend Account (10 mins - FREE!)

#### 2.1 Create Account

1. Go to: https://resend.com/
2. Click "Start Building"
3. Sign up with your email
4. Verify your email

#### 2.2 Get API Key

1. Go to **API Keys** in dashboard
2. Click **Create API Key**
3. Name: `Circuit-Crafters-Production`
4. **Copy the key** (starts with `re_`)

#### 2.3 Verify Sender Domain (IMPORTANT!)

**Option A: Use Resend's Test Domain** (Quick Start)

```
From: onboarding@resend.dev
```

- ✅ Works immediately
- ✅ FREE forever
- ⚠️ May go to spam
- ⚠️ Not professional

**Option B: Use Your Own Domain** (Recommended)

1. Go to **Domains** in Resend dashboard
2. Add your domain (e.g., circuitcrafters.com)
3. Add DNS records to your domain provider:
   - SPF record
   - DKIM record
   - DMARC record (optional)
4. Wait 5-10 minutes for verification
5. Use: `noreply@your domain.com`

**For Testing:** Use Option A  
**For Production:** Use Option B

---

### Step 3: Setup Supabase Edge Function (10 mins)

#### 3.1 Install Supabase CLI (if not installed)

**Windows (PowerShell):**

```powershell
# Using Scoop
scoop install supabase

# OR using npm
npm install -g supabase
```

**Verify installation:**

```bash
supabase --version
```

#### 3.2 Login to Supabase

```bash
supabase login
```

- Opens browser
- Click "Allow access"

#### 3.3 Link Your Project

```bash
# Get your project reference ID from Supabase dashboard URL
# Example: https://supabase.com/dashboard/project/qxftyazgvlddmrskwlko
#                                              ^^^^^^^^^^^^^^^^^^^
#                                              This is your ref ID

supabase link --project-ref qxftyazgvlddmrskwlko
```

#### 3.4 Create Edge Function

```bash
# Navigate to your project
cd c:\Users\shudi\Desktop\ssss\Circuit-Crafters-Raw-File\iot-folio-spark-main\iot-folio-spark-main

# Create function
supabase functions new send-emails
```

This creates: `supabase/functions/send-emails/index.ts`

#### 3.5 Copy Function Code

1. **Copy** entire content from `supabase_functions_send-emails.ts`
2. **Paste** into `supabase/functions/send-emails/index.ts`
3. **Update line 33:** Change `noreply@yourdomain.com` to your email

```typescript
from: "Circuit Crafters <noreply@circuitcrafters.com>", // Your domain!
```

#### 3.6 Set Environment Secrets

```bash
# Add Resend API key
supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Supabase secrets are already set automatically
# SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
```

#### 3.7 Deploy Edge Function

```bash
supabase functions deploy send-emails
```

**Result:** ✅ Edge function deployed!

---

### Step 4: Setup Automatic Email Sending (5 mins)

#### Option A: Cron Job (Recommended - Automatic)

1. **Go to Supabase Dashboard** → Database → **Cron Jobs**
2. **Create New Cron Job:**

   - Name: `send-pending-emails`
   - Schedule: `*/5 * * * *` (every 5 minutes)
   - Query:

   ```sql
   SELECT
     net.http_post(
       url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-emails',
       headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
     ) AS request_id;
   ```

3. **Replace:**
   - `YOUR_PROJECT_REF` → `qxftyazgvlddmrskwlko`
   - `YOUR_ANON_KEY` → Your Supabase anon key

**Result:** ✅ Emails send automatically every 5 minutes!

#### Option B: Manual Trigger (Testing Only)

**Test URL:**

```
https://qxftyazgvlddmrskwlko.supabase.co/functions/v1/send-emails
```

**Test with curl:**

```bash
curl -X POST https://qxftyazgvlddmrskwlko.supabase.co/functions/v1/send-emails \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

---

## ✅ VERIFICATION & TESTING

### Test 1: Database Setup

```sql
-- Check email_notifications table exists
SELECT COUNT(*) FROM email_notifications;
-- Should return 0 (no emails yet)
```

### Test 2: Send Test Reply

1. **Go to Admin Panel** → http://localhost:3001/admin
2. **Click on a service request**
3. **Type a reply:** "Thank you for contacting us!"
4. **Click "Send Reply (Under Review)"**
5. **Check database:**

```sql
SELECT * FROM email_notifications ORDER BY created_at DESC LIMIT 5;
```

**Expected:** New row with `status = 'pending'`

### Test 3: Trigger Email Sending

**If using Cron (automatic):** Wait 5 minutes

**If testing manually:**

```bash
curl -X POST https://qxftyazgvlddmrskwlko.supabase.co/functions/v1/send-emails \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Test 4: Verify Email Sent

```sql
SELECT
  recipient_email,
  subject,
  status,
  sent_at,
  error_message
FROM email_notifications
ORDER BY created_at DESC
LIMIT 5;
```

**Expected:**

- `status = 'sent'`
- `sent_at` has timestamp
- No `error_message`

### Test 5: Check User's Inbox

- Check the recipient email inbox
- Email should arrive within 5 minutes
- Subject: "Update on Your Service Request - Circuit Crafters"

---

## 🎨 CUSTOMIZE EMAIL TEMPLATE

### Current Template (in supabaseService.ts):

```typescript
message: `Hi there,

Your service request has been updated to "${replyData.newStatus}".

Admin Reply:
${replyData.replyMessage}

You can view full details in your dashboard at https://your-domain.com/dashboard

Best regards,
Circuit Crafters Team`;
```

### Customize It:

1. Open `src/lib/supabaseService.ts`
2. Find the `submitAdminReply` function
3. Update the `message` field
4. Add your domain URL
5. Add your branding

### Example Professional Template:

```typescript
message: `Dear Customer,

Great news! Your service request has been reviewed by our team.

Status: ${replyData.newStatus.toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${replyData.replyMessage}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next Steps:
• View full details: https://circuitcrafters.com/dashboard
• Reply to this email if you have questions
• Track your request status anytime

Need immediate assistance?
📧 Email: support@circuitcrafters.com
📞 Phone: +91-XXXXXXXXXX

Best regards,
${profile.full_name || "Circuit Crafters Team"}
Circuit Crafters - Your IoT Partner

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated message from Circuit Crafters.
Please do not reply directly to this email.
`;
```

---

## 📊 MONITORING EMAILS

### Check Email Queue Status:

```sql
SELECT
  status,
  COUNT(*) as count
FROM email_notifications
GROUP BY status;
```

### View Failed Emails:

```sql
SELECT
  recipient_email,
  subject,
  error_message,
  created_at
FROM email_notifications
WHERE status = 'failed'
ORDER BY created_at DESC;
```

### View Sent Emails (Last 24 hours):

```sql
SELECT
  recipient_email,
  subject,
  sent_at
FROM email_notifications
WHERE status = 'sent'
AND sent_at > NOW() - INTERVAL '24 hours'
ORDER BY sent_at DESC;
```

---

## 💰 COST (FREE!)

### Resend FREE Tier:

- ✅ 3,000 emails per month
- ✅ 100 emails per day
- ✅ No credit card required
- ✅ Forever free

### When You'll Need to Upgrade:

- **> 3,000 emails/month** → $20/month for 50,000 emails
- **> 100 emails/day** → Upgrade to Pro plan

**For a startup with 100 customers, you're safe for 2-3 years!**

---

## 🔧 TROUBLESHOOTING

### Issue 1: Emails Not Sending

**Check:**

```sql
SELECT * FROM email_notifications WHERE status = 'pending';
```

**If pending emails exist:**

- Cron job not running → Check Supabase Dashboard → Cron Jobs
- Edge function error → Check Supabase Dashboard → Edge Functions → Logs

### Issue 2: Emails Going to Spam

**Solutions:**

- ✅ Verify your domain in Resend
- ✅ Add SPF, DKIM, DMARC records
- ✅ Use professional "from" address
- ✅ Don't use spam trigger words

### Issue 3: "Failed" Status in Database

**Check error_message:**

```sql
SELECT error_message FROM email_notifications WHERE status = 'failed' LIMIT 1;
```

**Common causes:**

- Invalid API key → Re-check Resend API key
- Domain not verified → Verify domain in Resend
- Email quota exceeded → Check Resend dashboard

### Issue 4: Edge Function Not Deploying

```bash
# Check CLI is logged in
supabase logout
supabase login

# Re-link project
supabase link --project-ref qxftyazgvlddmrskwlko

# Redeploy
supabase functions deploy send-emails
```

---

## 🎯 CURRENT SYSTEM FLOW

### When Admin Sends Reply:

```
1. Admin types reply in AdminPanel
         ↓
2. Clicks "Send Reply (Under Review)"
         ↓
3. Reply saved to admin_replies table ✅
         ↓
4. Email notification queued (pending) ✅
         ↓
5. Status updated to "under_review" ✅
         ↓
6. [Every 5 minutes] Cron job triggers
         ↓
7. Edge function sends pending emails
         ↓
8. Email delivered to user's inbox ✅
         ↓
9. Status updated to "sent" ✅
         ↓
10. User receives notification! 🎉
```

---

## 📝 FILES MODIFIED/CREATED

### Created:

- ✅ `EMAIL_SYSTEM_SCHEMA.sql` - Database table
- ✅ `supabase_functions_send-emails.ts` - Edge function code
- ✅ `EMAIL_NOTIFICATION_GUIDE.md` - This file

### Modified:

- ✅ `src/lib/supabaseService.ts` - Added email queuing

### To Create (by you):

- ⏳ `supabase/functions/send-emails/index.ts` - Copy from template

---

## ✅ FINAL CHECKLIST

Before going live:

- [ ] Execute `EMAIL_SYSTEM_SCHEMA.sql` in Supabase
- [ ] Create Resend account and get API key
- [ ] Verify sender domain (or use test domain)
- [ ] Install Supabase CLI
- [ ] Create and deploy Edge Function
- [ ] Set RESEND_API_KEY secret
- [ ] Setup Cron Job (every 5 mins)
- [ ] Send test reply from Admin Panel
- [ ] Verify email received in inbox
- [ ] Customize email template
- [ ] Update domain URL in email

---

## 🎉 SUCCESS!

Once complete, your system will:

- ✅ Send emails automatically
- ✅ Queue failed emails for retry
- ✅ Track all email activity
- ✅ Cost $0/month (FREE tier)
- ✅ Professional customer communication

---

**Your customers will love getting instant email updates!** 📧✨

**Total Setup Time: 30 minutes**  
**Monthly Cost: $0 (FREE)**  
**Customer Satisfaction: ↑↑↑**

**Let's go! 🚀**
