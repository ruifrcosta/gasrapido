# Payment Proof System

## Overview

The Payment Proof System allows clients to upload payment proofs for manual verification by finance/admin staff until official APIs are available for automated payment processing. This system supports multiple payment methods including Multicaixa Express, KWiK, Unitel Money, PayPay, and bank transfers.

## Supported Payment Methods

1. **Multicaixa Express (EMIS)**
   - Type: Digital payment/proof
   - API Available: No (manual verification only)
   - Description: Angola's primary mobile payment system

2. **KWiK**
   - Type: Instant payment / initial proof
   - API Available: Yes or negotiable (future)
   - Description: Instant payment instrument created by EMIS for transfers or payments within the EMIS system

3. **Unitel Money**
   - Type: Mobile wallet or mobile balance
   - API Available: Yes or in negotiation
   - Description: Mobile payment service by Unitel; allows generating payment requests via AppyPay / API

4. **PayPay**
   - Type: Mobile/digital transfer/payment
   - API Available: No or partial
   - Description: Angolan digital platform operating payment/transfer system; potential for future collaboration

5. **Bank Transfer**
   - Type: Bank account / IBAN / bank reference
   - API Available: Yes (bank involved) or no; usually manual
   - Description: Client sends proof of bank transfer

## Database Structure

### Payment Proofs Table

```sql
CREATE TABLE public.payment_proofs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_method payment_method_with_proof NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'AOA',
  status payment_proof_status DEFAULT 'pending_verification',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  file_path TEXT NOT NULL,
  file_hash TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Enums

```sql
CREATE TYPE payment_method_with_proof AS ENUM (
  'multicaixa_express',
  'kwik',
  'unitel_money',
  'paypay',
  'bank_transfer'
);

CREATE TYPE payment_proof_status AS ENUM (
  'pending_proof',
  'pending_verification',
  'approved',
  'rejected',
  'proof_failure'
);
```

## Storage

- **Service**: Supabase Storage
- **Bucket**: `payment-proofs`
- **Access**: Private - only finance/admin can view
- **File Types**: Images (JPEG, PNG, GIF) and PDF documents
- **Size Limit**: 10MB per file

### Metadata

- `user_id`: UUID of the user who uploaded the proof
- `order_id`: UUID of the associated order
- `payment_method`: Payment method used
- `uploaded_at`: Timestamp of upload
- `file_name`: Original file name
- `file_hash`: SHA-256 hash to confirm file integrity

## Workflow States

1. **pending_proof**: Client has submitted proof, awaiting verification
2. **pending_verification**: Finance/admin evaluating the proof
3. **approved**: Proof accepted, order can proceed to delivery or preparation
4. **rejected**: Proof rejected, client notified with reason and option to resubmit
5. **proof_failure**: If document is invalid or suspicious, temporary block or audit

## Client Flow

1. Client chooses payment method (Express, Kwik, Unitel Money, PayPay, or bank transfer)
2. If method requires proof (all except automatic API), interface for uploading proof (photo or PDF), amount, date, bank reference, etc.
3. Client submits proof; payment_proofs record created with state = pending_verification
4. Notification to client that proof was received and awaits validation

## Finance/Admin Flow

1. Receive notice (internal notification) of new uploaded proof
2. Verify the proof: check amount, match with order_id, visibility of proof, date, bank reference when applicable
3. In dashboard, view proof, document viewer interface, field to accept or reject with reason
4. Update status: approved or rejected, record verified_by, verified_at, rejection_reason if applicable
5. If approved, trigger next step in order flow (e.g., order preparation or shipping), notify client
6. If rejected, allow client to resubmit proof

## Security Controls

### File Validation
- Check file type (image or PDF)
- Maximum file size (e.g., 5-10 MB)
- Anti-malware/scanner if possible

### Hashing
- Store SHA-256 hash of file to prevent manipulation
- Verify file integrity using stored hash

### Access Control
- Only proof owner + finance + admin can view the file
- Row Level Security (RLS) policies enforce access controls

### Audit Log
- Record who verified, when, decision, reason
- All verification activities are logged

## Future Integration

### With API
- EMIS GPO / EMIS Online Payment Gateway when available for Express and Multicaixa Express
- KWiK API (when opened to merchants) for instant payments without manual proof
- UNITEL Money API via AppyPay for digital payment requests

### Fallback
- Continue with proof while API is not installed or in cases of failure/user without access

## Error Handling

### Invalid Proof
- Notify client with reason: illegible image, missing data, wrong amount

### Timeout
- If finance/admin doesn't verify within X hours (e.g., 24-48 hours), alert admin and send reminder

### Disputes
- If client contests rejection, open support ticket that escalates to senior administrator

## User Notifications

### On Upload
- "Thank you! We have received your proof. We will validate it shortly."

### On Approval
- "Payment confirmed. We will process your order."

### On Rejection
- "We're sorry, your proof was rejected: [rejection_reason]. Please resubmit."

### Pending Time Exceeded
- "We haven't verified your proof yet. We apologize for the delay. We are taking action."

## UI Components

### Client Side
- **Screens**:
  - Payment method selection
  - Proof upload
  - Proof status (pending, approved, rejected) with timeline
  - Resubmit proof if rejected
- **Components**:
  - File uploader (image/PDF)
  - Preview of uploaded document
  - Additional data fields (bank reference, date, amount)
  - Resubmit button, status indicator

### Finance/Admin Side
- **Screens**:
  - Dashboard of new pending proofs
  - View proof + order details
  - Accept/reject buttons with reason
  - Verification history
- **Components**:
  - Document viewer (zoom, clear image)
  - Edit fields for notes/rejection
  - Filters by date/status/method
  - Client notification button

## Implementation Details

### Service Layer
The `PaymentProofService` in the shared package provides all necessary functionality:
- Upload payment proofs with file integrity verification
- Retrieve payment proofs by user, order, or ID
- Get pending verification proofs for finance/admin staff
- Verify payment proofs (approve/reject)
- Delete payment proofs when appropriate
- Verify file integrity using stored hash
- Track overdue verification proofs
- Generate metrics and analytics

### File Integrity Verification
- SHA-256 hash is generated for each uploaded file
- Hash is stored in the database for future verification
- `verifyFileIntegrity` method compares stored hash with current file hash

### Timeout Notifications
- System automatically identifies overdue payment proofs (default 48 hours)
- Notifications are sent to admins for overdue proofs
- Configurable timeout threshold

### Metrics and Analytics
- Track total proofs, approval/rejection rates
- Monitor average verification time
- Measure impact on order delays
- Track resubmission and failure rates

## Metrics

- **Time to Verify**: Average time between proof upload and verification
- **Rate of Rejections**: Percentage of rejected proofs
- **Customer Resubmission Rate**: Percentage of clients who need to resubmit proof
- **Failed Uploads**: Errors or invalid uploads
- **Impact on Order Delay**: How many orders are delayed due to proofs

## Implementation Notes

The payment proof system is designed to be a temporary solution until official APIs are available for automated payment processing. It provides a secure and auditable way to handle manual payment verification while maintaining compliance with financial regulations.

### Database Migrations
1. `20250918000006_payment_proofs.sql` - Creates the payment_proofs table and enums
2. `20250918000007_add_file_hash_to_payment_proofs.sql` - Adds file_hash column for integrity verification

### Code Structure
- **Service**: `packages/shared/src/services/paymentProofService.ts`
- **UI Components**: 
  - `packages/ui/src/components/common/PaymentProofUpload.tsx`
  - `packages/ui/src/components/common/PaymentProofVerification.tsx`
- **Types**: `packages/shared/src/types/index.ts`