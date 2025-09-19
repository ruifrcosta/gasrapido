# Client Business Flow

## Overview

This document describes the complete business flow for clients (gas cylinder customers) using the GasRápido platform.

## 1. Registration and Onboarding

### 1.1 Initial Registration
- Client accesses the platform through web or mobile application
- Provides basic information (name, email, phone number)
- Receives OTP verification code via SMS/email
- Sets up password and security preferences

### 1.2 Address Setup
- Client enters delivery address information
- Validates address through map integration
- Sets default delivery location
- Can add multiple delivery addresses

### 1.3 Account Verification
- Account status set to "NEW"
- Optional: Upload identification documents for faster service
- Account moves to "ACTIVE" status upon first order completion

## 2. Ordering Process

### 2.1 Product Selection
- Browse available gas cylinder products
- Filter by supplier, size, price
- View product details and supplier ratings
- Add products to cart

### 2.2 Order Configuration
- Select delivery address
- Choose delivery time slot (if available)
- Add special instructions for delivery
- Review order summary and pricing

### 2.3 Payment Processing
- Select payment method (cash on delivery, mobile money, card, or manual payment proof)
- For manual payment methods (Multicaixa Express, KWiK, Unitel Money, PayPay, Bank Transfer):
  - Complete payment through preferred method
  - Upload payment proof document (photo or PDF)
  - Enter payment amount and reference details
  - Submit proof for verification
- Process payment through integrated payment gateway (for automated methods)
- Receive payment confirmation

### 2.4 Order Confirmation
- Receive order confirmation with order number
- Order status changes to "PENDING"
- Estimated delivery time provided
- Notification sent to client

## 3. Reservation Process

### 3.1 Reservation Creation
- Choose reservation type (delivery or pickup)
- For delivery: Select delivery address and time window
- For pickup: Select pickup point and time window
- Review reservation details and total amount
- Submit reservation request

### 3.2 Reservation Payment
- Select payment method (cash on delivery, mobile money, card, or manual payment proof)
- For manual payment methods (Multicaixa Express, KWiK, Unitel Money, PayPay, Bank Transfer):
  - Complete payment through preferred method
  - Upload reservation proof document (photo or PDF)
  - Enter payment amount and reference details
  - Submit proof for verification
- Process payment through integrated payment gateway (for automated methods)
- Receive payment confirmation

### 3.3 Reservation Confirmation
- Receive reservation confirmation with reservation number
- Reservation status changes to "PENDING_RESERVATION"
- Scheduled delivery/pickup time provided
- Notification sent to client

## 4. Order Tracking

### 4.1 Real-time Tracking
- View order status in real-time (PENDING, CONFIRMED, PREPARING, IN_TRANSIT, DELIVERED)
- See courier information and location (when assigned)
- Receive notifications for status updates
- Access tracking link to share with others

### 4.2 Payment Verification Status
- Track payment proof verification status (PENDING_VERIFICATION, APPROVED, REJECTED)
- Receive notifications when payment is verified
- Option to resubmit payment proof if rejected

### 4.3 Reservation Tracking
- View reservation status in real-time (PENDING_RESERVATION, CONFIRMED, CANCELLED, EXPIRED)
- See scheduled delivery/pickup time
- Receive notifications for status updates
- Option to cancel reservation before confirmation

### 4.4 Communication
- Communicate with courier through in-app messaging
- Contact supplier for product-related queries
- Report issues or concerns through support system

## 5. Delivery and Completion

### 5.1 Delivery Process
- Courier arrives at specified location
- Client verifies delivery and product quality
- Confirm delivery through app
- Rate courier and supplier experience

### 5.2 Pickup Process
- Client arrives at specified pickup point during scheduled time window
- Supplier verifies reservation and client identity
- Client collects gas cylinder
- Confirm pickup through app
- Rate supplier experience

### 5.3 Order Completion
- Order status changes to "DELIVERED"
- Payment is finalized (for approved payment proofs)
- Receive delivery confirmation and receipt
- Option to leave feedback and reviews

## 6. Post-Delivery Services

### 6.1 Order History
- Access complete order history
- View past invoices and receipts
- Reorder previous products with one click
- Track spending patterns and preferences

### 6.2 Payment History
- View all payment transactions
- Access payment proof documents
- See verification status of manual payments
- Download receipts and payment confirmations

### 6.3 Reservation History
- Access complete reservation history
- View past reservation confirmations
- See payment proof documents for reservations
- Track verification status of manual payments

### 6.4 Support and Issues
- Report delivery issues or product problems
- Request refunds or replacements
- Access customer support through multiple channels
- View resolution status and history

### 6.5 Account Management
- Update personal information and addresses
- Manage payment methods
- View account status and verification level
- Access loyalty programs and promotions

## 7. Notifications and Alerts

### 7.1 Order Updates
- Status change notifications
- Delivery time estimates and updates
- Courier assignment notifications
- Delivery confirmation

### 7.2 Payment Updates
- Payment proof received notification
- Payment verification status updates
- Rejection notifications with reasons
- Approval confirmations

### 7.3 Reservation Updates
- Reservation confirmation notifications
- Payment proof received notification
- Reservation verification status updates
- Rejection notifications with reasons
- Expiration notifications
- Reminder notifications for upcoming reservations

### 7.4 Promotional
- Special offers and discounts
- New supplier or product announcements
- Loyalty program updates
- Seasonal promotions

### 7.5 System Alerts
- Service maintenance notifications
- Security alerts
- Policy updates
- Platform updates

## 8. Security and Compliance

### 8.1 Data Protection
- End-to-end encryption of personal data
- Secure storage of payment information
- GDPR/HIPAA compliant practices
- Regular security audits

### 8.2 Identity Verification
- Optional enhanced verification for premium services
- Document verification workflow
- Multi-factor authentication options
- Fraud detection and prevention

### 8.3 Payment Security
- Secure upload and storage of payment proofs
- File integrity verification
- Access controls for payment documents
- Audit trail of payment activities

### 8.4 Reservation Security
- Secure upload and storage of reservation proofs
- File integrity verification
- Access controls for reservation documents
- Audit trail of reservation activities

## 9. Integration Points

### 9.1 External Services
- Payment gateway integration
- SMS and email notification services
- Map and geolocation services
- Weather services for delivery optimization

### 9.2 Internal Systems
- Order management system
- Inventory management
- Courier assignment system
- Pricing engine
- Analytics and reporting
- Payment proof verification system
- Reservation management system

## 10. Error Handling and Fallbacks

### 10.1 Order Issues
- Failed deliveries and rescheduling
- Product quality issues and replacements
- Payment failures and retries
- Supplier unavailability handling

### 10.2 Payment Issues
- Rejected payment proofs with detailed reasons
- Option to resubmit corrected payment proofs
- Escalation to support for disputed rejections
- Fallback to alternative payment methods

### 10.3 Reservation Issues
- Rejected reservation proofs with detailed reasons
- Option to resubmit corrected reservation proofs
- Escalation to support for disputed rejections
- Fallback to alternative reservation methods
- Expiration handling for unconfirmed reservations

### 10.4 System Failures
- Graceful degradation during outages
- Manual order processing when systems down
- Data backup and recovery procedures
- Incident response protocols

## 11. Performance Metrics

### 11.1 Key Performance Indicators
- Order completion rate
- Average delivery time
- Customer satisfaction score
- Repeat order rate
- Platform usage statistics
- Payment verification time
- Payment rejection rate
- Reservation confirmation rate
- Reservation no-show rate

### 11.2 Service Level Agreements
- Delivery time guarantees
- Availability targets
- Response time commitments
- Resolution timeframes for issues
- Payment verification timeframes
- Reservation confirmation timeframes

This document provides a comprehensive overview of the client business flow in the GasRápido platform, ensuring a seamless and secure experience for gas cylinder customers.