# Reservation System

## Overview

The Reservation System allows clients to reserve gas cylinders, choosing between delivery or pickup, with advance payment or proof of payment. The system ensures confirmation, validation, and clarity for all involved profiles.

## Reservation Options

### Delivery
- Reserve for delivery to a specified address
- Earliest delivery time: minimum 30 minutes after confirmation
- Latest delivery time: depends on cell/region

### Pickup
- Reserve for pickup at store or partner collection point
- Available pickup points: selected supplier or collection points
- Earliest pickup time: point's business hours
- Latest pickup time: can be set with a maximum pickup deadline

## Payment Requirements

### Payment Methods
- Express
- Kwik
- Unitel Money
- PayPay
- Bank Transfer
- Proof Upload

### Payment Failure Handling
- For delivery: reservation canceled + notifications
- For pickup: reservation may expire after stipulated deadline

### Amount Due
- Total order amount + reservation fee if applicable

## Database Structure

### Reservations Table

```sql
CREATE TABLE public.reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  type reservation_type NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pickup_point TEXT,
  delivery_address JSON,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'AOA',
  payment_method TEXT,
  payment_status reservation_payment_status DEFAULT 'pending',
  proof_file_path TEXT,
  proof_uploaded_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  status reservation_status DEFAULT 'pending_reservation',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Enums

```sql
CREATE TYPE reservation_type AS ENUM (
  'entrega',
  'levantamento'
);

CREATE TYPE reservation_payment_status AS ENUM (
  'pending',
  'paid',
  'proof_uploaded',
  'failed',
  'rejected'
);

CREATE TYPE reservation_status AS ENUM (
  'pending_reservation',
  'confirmed',
  'cancelled',
  'expired',
  'rejected'
);
```

## State Machine

### States
1. `pending_reservation` - Reservation created, awaiting payment/proof
2. `payment_pending` - Client chooses payment method or proof
3. `proof_uploaded` - Client submits proof
4. `confirmed` - Payment detected or proof validated
5. `cancelled` - Client cancels before confirmation or time limit exceeded
6. `expired` - Time for payment or pickup expired
7. `rejected` - Proof invalid or incomplete

### Transitions
- `pending_reservation` → `payment_pending`: Client chooses payment method or proof
- `payment_pending` → `confirmed`: Payment detected or proof validated
- `payment_pending` → `proof_uploaded`: Client submits proof
- `proof_uploaded` → `confirmed`: Admin/finance verifies and accepts
- `any` → `cancelled`: Client cancels before confirmation or time limit exceeded
- `pending_reservation` → `expired`: Time for payment or pickup expired
- `proof_uploaded` → `rejected`: Proof invalid or incomplete

## Implementation Details

### Service Layer
The `ReservationService` in the shared package provides all necessary functionality:
- Create reservations
- Retrieve reservations by user, ID, or status
- Upload reservation proofs with file integrity verification
- Verify reservations (approve/reject)
- Cancel reservations with business rule validation
- Get reservation proof file URLs
- Verify file integrity using stored hash
- Track overdue reservations
- Process expired reservations automatically
- Handle stock allocation for confirmed reservations
- Generate metrics and analytics

### Enhanced Business Rules Implementation
The service layer now includes comprehensive business rule enforcement:
- **Cancellation Policy**: Validates cancellation requests based on time constraints and reservation status
- **Late Pickup Handling**: Automatically expires pickup reservations that aren't collected within the grace period
- **Stock Management**: Allocates and releases stock based on reservation status changes
- **Reservation Expiry**: Automatically processes overdue reservations for both payment timeouts and pickup deadlines

### File Integrity Verification
- SHA-256 hash is generated for each uploaded file
- Hash is stored in the database for future verification
- `verifyFileIntegrity` method compares stored hash with current file hash

### Timeout Processing
- System automatically identifies overdue reservations for both payment confirmation (default 60 minutes) and pickup deadlines
- Automatic processing of expired reservations with appropriate status updates
- Configurable timeout thresholds for different reservation types

### Metrics and Analytics
- Track total reservations, confirmation/rejection rates
- Monitor average reservation to payment time
- Measure no-show and cancellation rates
- Track stock impact

## Implementation Notes

The reservation system is designed to provide clients with a flexible way to reserve gas cylinders while ensuring proper validation and confirmation processes. It integrates with the existing payment proof system and follows the same security and audit principles.

The enhanced implementation includes:
- Complete state machine implementation matching the specification
- Interactive UI components with proper validation
- Comprehensive business rule enforcement in the service layer
- Automatic reservation expiry processing
- Stock allocation and management
- Enhanced error handling and user feedback
