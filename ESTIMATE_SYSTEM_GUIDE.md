# 📊 Estimate System - Phase 2 Complete

## ✅ What's Been Implemented

### 1. **EstimateBuilder Component** (`src/components/EstimateBuilder.tsx`)

A comprehensive modal component for creating cost estimates with the following features:

#### Core Features:

- ✅ **Component Selector**

  - Category dropdown (MCU, Sensor, Display, Power, Component, Actuator, Cable)
  - Product dropdown filtered by category
  - Quantity input
  - Add button to add components to estimate

- ✅ **Selected Components Management**

  - Live component list with quantity and total
  - Inline quantity editing
  - Remove component button
  - Real-time subtotal and total calculation

- ✅ **Timeline Selection**

  - Predefined options: 3-5 days, 5-7 days, 7-10 days, 10-14 days, 2-3 weeks, 3-4 weeks
  - Custom timeline option with text input

- ✅ **Additional Notes**

  - Optional textarea for special instructions or notes

- ✅ **Auto-Generated Estimate Text**
  - Professional format for customer communication
  - Component breakdown with quantities
  - Total cost display
  - Timeline information
  - 30-day validity notice

#### Technical Implementation:

```typescript
// Fetches products from Supabase component_prices table
// Filters by category dynamically
// Real-time price calculations
// Returns formatted text + data object on save
```

### 2. **AdminPanel Integration** (`src/pages/AdminPanel.tsx`)

#### Added Features:

- ✅ **"Create Estimate" Button**

  - Positioned above the reply textarea
  - Opens EstimateBuilder modal on click
  - Available when viewing any service request

- ✅ **Auto-Fill Reply Box**

  - Estimate text automatically inserted into reply message
  - Editable after insertion
  - Success indicator shows total amount

- ✅ **Estimate Data Storage**
  - Stored in component state for future PDF generation
  - Includes all component details, totals, timeline, notes

#### UI Enhancements:

```tsx
// Green success banner shows when estimate is added
// Shows total amount: "Estimate added to reply (₹695.00)"
// Calculator icon on button for visual clarity
```

---

## 📋 Next Steps (Phase 3: Database & Email)

### Step 1: Execute Database Schema ⚡ **DO THIS FIRST**

```sql
-- Open Supabase Dashboard → SQL Editor
-- Copy the entire content of ESTIMATE_SYSTEM_SCHEMA.sql
-- Paste and execute

-- Verify table creation:
SELECT * FROM project_estimates LIMIT 5;
```

### Step 2: Save Estimates to Database (Needs Implementation)

**File to modify:** `src/pages/AdminPanel.tsx`

Add function to save estimate data to Supabase:

```typescript
const handleSaveEstimateToDatabase = async () => {
  if (!currentEstimateData || !selectedRequest) return;

  try {
    const { data, error } = await supabase
      .from("project_estimates")
      .insert({
        request_id: selectedRequest.id,
        customer_id: selectedRequest.user_id,
        customer_email: selectedRequest.user_email,
        customer_name: selectedRequest.user_name,
        estimate_data: currentEstimateData,
        status: "draft",
        admin_id: user?.id,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      })
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Estimate saved",
      description: "Estimate has been saved to database",
    });

    return data.id; // Return estimate ID for PDF generation
  } catch (error) {
    console.error("Error saving estimate:", error);
    toast({
      title: "Error saving estimate",
      description: error.message,
      variant: "destructive",
    });
  }
};
```

### Step 3: Setup Resend Email Service 📧

#### 3.1 Create Resend Account (FREE - No Credit Card)

1. Visit: https://resend.com/
2. Sign up with your email
3. Verify email address
4. Go to **API Keys** section
5. Create new API key: "CircuitCrafters-Estimates"
6. Copy the API key (starts with `re_`)

#### 3.2 Store API Key in Supabase

1. Open Supabase Dashboard
2. Go to **Project Settings** → **Edge Functions** → **Secrets**
3. Add new secret:
   - Name: `RESEND_API_KEY`
   - Value: `re_your_api_key_here`

#### 3.3 Create Supabase Edge Function

```bash
# In terminal (requires Supabase CLI)
supabase functions new send-estimate-email
```

Create file: `supabase/functions/send-estimate-email/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  try {
    const { estimateId, customerEmail, customerName } = await req.json();

    // Fetch estimate from database
    const { data: estimate, error } = await supabaseAdmin
      .from("project_estimates")
      .select("*")
      .eq("id", estimateId)
      .single();

    if (error) throw error;

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Circuit Crafters <estimates@yourdomain.com>",
        to: [customerEmail],
        subject: `Cost Estimate for Your Project - Circuit Crafters`,
        html: generateEmailHTML(estimate, customerName),
        attachments: [
          {
            filename: `estimate-${estimateId}.pdf`,
            content: pdfBase64, // PDF as base64
          },
        ],
      }),
    });

    const emailData = await res.json();

    // Update estimate status
    await supabaseAdmin
      .from("project_estimates")
      .update({
        status: "sent",
        email_sent_at: new Date().toISOString(),
      })
      .eq("id", estimateId);

    return new Response(JSON.stringify({ success: true, emailData }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

### Step 4: PDF Generation Component

**Install PDF library:**

```bash
npm install jspdf jspdf-autotable
```

**Create file:** `src/utils/pdfGenerator.ts`

```typescript
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateEstimatePDF = (
  estimateData: any,
  customerName: string
) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text("Circuit Crafters", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text("Cost Estimate", 105, 30, { align: "center" });

  // Customer Details
  doc.setFontSize(10);
  doc.text(`Customer: ${customerName}`, 20, 50);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
  doc.text(
    `Valid Until: ${new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString()}`,
    20,
    70
  );

  // Components Table
  const tableData = estimateData.components.map((comp: any) => [
    comp.name,
    comp.quantity,
    `₹${comp.price.toFixed(2)}`,
    `₹${comp.total.toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 80,
    head: [["Component", "Quantity", "Unit Price", "Total"]],
    body: tableData,
  });

  // Total
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(`Total: ₹${estimateData.total.toFixed(2)}`, 150, finalY);

  // Timeline
  doc.setFontSize(10);
  doc.text(`Estimated Timeline: ${estimateData.timeline}`, 20, finalY + 20);

  // Notes
  if (estimateData.notes) {
    doc.text(`Notes: ${estimateData.notes}`, 20, finalY + 30);
  }

  // Terms & Conditions
  doc.setFontSize(8);
  doc.text("Terms & Conditions:", 20, finalY + 50);
  doc.text(
    "- This estimate is valid for 30 days from the date of issue.",
    20,
    finalY + 55
  );
  doc.text(
    "- Final pricing may vary based on actual requirements.",
    20,
    finalY + 60
  );
  doc.text("- Payment terms: 50% advance, 50% on completion.", 20, finalY + 65);

  return doc;
};

// Export as base64 for email attachment
export const generateEstimatePDFBase64 = (
  estimateData: any,
  customerName: string
) => {
  const doc = generateEstimatePDF(estimateData, customerName);
  return doc.output("datauristring").split(",")[1];
};

// Download PDF directly
export const downloadEstimatePDF = (
  estimateData: any,
  customerName: string,
  estimateId: string
) => {
  const doc = generateEstimatePDF(estimateData, customerName);
  doc.save(`estimate-${estimateId}.pdf`);
};
```

### Step 5: Email Confirmation Dialog

**Create file:** `src/components/EmailConfirmDialog.tsx`

```typescript
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, FileText, Loader2 } from "lucide-react";

interface EmailConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerEmail: string;
  customerName: string;
  estimateTotal: number;
  sending: boolean;
}

const EmailConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  customerEmail,
  customerName,
  estimateTotal,
  sending,
}: EmailConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-accent" />
            Send Estimate via Email
          </DialogTitle>
          <DialogDescription>
            Confirm sending cost estimate with PDF attachment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm">
              <strong>To:</strong> {customerEmail}
            </p>
            <p className="text-sm">
              <strong>Customer:</strong> {customerName}
            </p>
            <p className="text-sm">
              <strong>Total Amount:</strong> ₹{estimateTotal.toFixed(2)}
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700">
              PDF estimate will be attached to email
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={sending}>
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailConfirmDialog;
```

---

## 🎯 Complete Workflow (Once All Implemented)

### Admin Creates Estimate:

1. Open service request in AdminPanel
2. Click **"Create Estimate"** button
3. EstimateBuilder modal opens
4. Select components by category
5. Add quantities for each component
6. Choose timeline (or enter custom)
7. Add optional notes
8. Click **"Add to Reply"**
9. Estimate text auto-fills reply box
10. Edit reply if needed

### Admin Sends Estimate:

11. Click **"Send with PDF"** button (to be added)
12. Email confirmation dialog appears
13. Preview estimate details
14. Click **"Send Email"**
15. System:
    - Saves estimate to database
    - Generates PDF
    - Sends email via Resend
    - Updates status to "sent"
16. Success notification shown
17. Email delivered to customer with PDF attachment

### Customer Receives:

- Professional email with company branding
- Estimate summary in email body
- PDF attachment with full breakdown
- 30-day validity notice
- Terms & conditions

---

## 📁 Files Modified/Created Summary

### ✅ Created:

- `src/components/EstimateBuilder.tsx` (454 lines)
- `ESTIMATE_SYSTEM_SCHEMA.sql` (85 lines)
- This guide: `ESTIMATE_SYSTEM_GUIDE.md`

### ✅ Modified:

- `src/pages/AdminPanel.tsx`
  - Added EstimateBuilder import
  - Added state for estimate builder
  - Added "Create Estimate" button
  - Added estimate save handler
  - Added success indicator
  - Added EstimateBuilder modal component

### ⏳ Pending Creation:

- `src/utils/pdfGenerator.ts` (PDF generation utility)
- `src/components/EmailConfirmDialog.tsx` (Email confirmation)
- `supabase/functions/send-estimate-email/index.ts` (Edge function)

---

## 🚀 Testing Checklist

### Phase 2 Testing (Current):

- [ ] Click "Create Estimate" button opens modal
- [ ] Select category filters products correctly
- [ ] Add component adds to selected list
- [ ] Quantity updates change totals
- [ ] Remove component works
- [ ] Timeline selection works
- [ ] Custom timeline input works
- [ ] Notes textarea saves
- [ ] "Add to Reply" closes modal
- [ ] Estimate text appears in reply box
- [ ] Success indicator shows correct total

### Phase 3 Testing (After Email Implementation):

- [ ] Execute ESTIMATE_SYSTEM_SCHEMA.sql successfully
- [ ] Verify project_estimates table exists
- [ ] Estimate saves to database with correct data
- [ ] PDF generates with all components
- [ ] PDF includes customer name and date
- [ ] PDF shows correct totals
- [ ] Email confirmation dialog shows correct info
- [ ] Email sends successfully via Resend
- [ ] PDF attaches to email correctly
- [ ] Customer receives email with attachment
- [ ] Estimate status updates to "sent"
- [ ] email_sent_at timestamp recorded

---

## 💡 Tips & Best Practices

### Database:

- Always use UUID for estimate IDs
- Store JSONB data with consistent structure
- Index frequently queried columns (request_id, customer_id, status)
- Use RLS policies to protect customer data

### Email:

- Test with Resend's test emails first
- Monitor Resend dashboard for delivery stats
- FREE tier: 3,000 emails/month (enough for most use cases)
- Add unsubscribe link for compliance

### PDF:

- Keep design simple and professional
- Include company branding/logo
- Always show validity period
- List T&C clearly
- Make PDF filename descriptive: `estimate-[ID].pdf`

### UI/UX:

- Disable buttons while processing
- Show loading states clearly
- Use success/error toasts for feedback
- Make estimate editable after creation
- Allow downloading PDF without sending email

---

## 🐛 Troubleshooting

### EstimateBuilder not opening:

- Check browser console for errors
- Verify Supabase connection is active
- Check component_prices table has data

### Products not loading:

- Verify `is_active = true` for products
- Check RLS policies allow SELECT
- Ensure Supabase client is authenticated

### Estimate text not formatting correctly:

- Check `generateEstimateText()` function
- Verify customer name is passed correctly
- Ensure components array is populated

### Email not sending (Phase 3):

- Verify Resend API key is correct
- Check Edge Function logs in Supabase
- Test with Resend's test endpoint first
- Verify sender email domain is verified in Resend

### PDF not generating (Phase 3):

- Install jspdf and jspdf-autotable
- Check estimateData structure matches expected format
- Test PDF generation separately first

---

## 📞 Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Resend Docs:** https://resend.com/docs
- **jsPDF Docs:** https://raw.githack.com/MrRio/jsPDF/master/docs/
- **React Dialog:** https://ui.shadcn.com/docs/components/dialog

---

## 🎉 Status: Phase 2 Complete!

**What works now:**
✅ EstimateBuilder modal with full component selection
✅ Real-time price calculations
✅ Timeline and notes support
✅ Auto-generated estimate text
✅ AdminPanel integration with "Create Estimate" button
✅ Success indicator after estimate creation

**Next immediate action:**
⚡ Execute `ESTIMATE_SYSTEM_SCHEMA.sql` in Supabase SQL Editor

**Then continue with:**
📧 Setup Resend account and email integration
📄 Implement PDF generation
✉️ Create email confirmation dialog
🧪 End-to-end testing

---

Let's keep the momentum going! 🚀
