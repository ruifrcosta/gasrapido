# GasRápido - User State Management Implementation

## Overview

This document describes how user state management is implemented across the GasRápido platform to provide appropriate experiences based on user status.

## User States

The platform implements the following user states:

1. **New**: User has just registered
2. **Pending Documents**: User needs to upload documents
3. **Verified**: Documents have been verified
4. **Active**: User can perform actions
5. **Rejected**: User's application was rejected
6. **Blocked**: User has been blocked by admin

## State Transitions

```
New → Pending Documents → Verified → Active
  ↓         ↓              ↓         ↓
Rejected  Rejected       Rejected  Blocked
  ↑         ↑              ↑         ↑
New      Pending Docs    Verified   Active
```

## Implementation Examples

### 1. Conditional Navigation

Based on user state, users are directed to appropriate screens:

```typescript
// Example navigation logic
const getUserDashboard = (userState: UserState) => {
  switch (userState) {
    case 'new':
      return <WelcomeScreen />;
    case 'pending_documents':
      return <DocumentUploadScreen />;
    case 'verified':
      return <VerificationPendingScreen />;
    case 'active':
      return <ClientDashboardScreen />; // or appropriate role dashboard
    case 'rejected':
      return <ApplicationRejectedScreen />;
    case 'blocked':
      return <AccountBlockedScreen />;
    default:
      return <WelcomeScreen />;
  }
};
```

### 2. Feature Access Control

Different features are enabled based on user state:

```typescript
// Example feature access control
const canPlaceOrder = (userState: UserState) => {
  return userState === 'active';
};

const canUploadDocuments = (userState: UserState) => {
  return userState === 'pending_documents' || userState === 'rejected';
};

const canViewDashboard = (userState: UserState) => {
  return userState === 'active' || userState === 'verified';
};
```

### 3. UI Conditional Rendering

Screens display different content based on user state:

```typescript
// Example conditional rendering in a screen
const UserProfileScreen = ({ userState }: { userState: UserState }) => {
  return (
    <View>
      {userState === 'new' && (
        <Banner 
          type="info" 
          message="Complete seu registro para acessar todas as funcionalidades" 
        />
      )}
      
      {userState === 'pending_documents' && (
        <Banner 
          type="warning" 
          message="Envie seus documentos para verificação" 
          action="Enviar Documentos"
          onAction={() => router.push('/document-upload')}
        />
      )}
      
      {userState === 'verified' && (
        <Banner 
          type="success" 
          message="Seus documentos foram verificados. Sua conta será ativada em breve." 
        />
      )}
      
      {userState === 'rejected' && (
        <Banner 
          type="error" 
          message="Seus documentos foram rejeitados. Verifique o feedback e tente novamente." 
          action="Ver Detalhes"
          onAction={() => router.push('/rejection-details')}
        />
      )}
      
      {userState === 'blocked' && (
        <Banner 
          type="error" 
          message="Sua conta foi bloqueada. Entre em contato com o suporte." 
          action="Contatar Suporte"
          onAction={() => router.push('/support')}
        />
      )}
    </View>
  );
};
```

## Screen-Specific State Handling

### Welcome Screen
- Displays for 'new' users
- Provides options for registration or invitation entry

### Document Upload Screens
- Accessible for 'pending_documents' and 'rejected' users
- Shows rejection reasons for 'rejected' users
- Guides 'pending_documents' users through upload process

### Verification Pending Screen
- Displayed for 'verified' users
- Shows verification timeline and expected completion
- Provides contact support option

### Dashboard Screens
- Accessible only for 'active' users
- Shows role-specific content (client, supplier, courier, admin)
- Provides navigation to role-specific features

### Admin Screens
- Accessible only for 'active' admin users
- Provides user management capabilities
- Shows system health and metrics

## State Management Service

A centralized service manages user states:

```typescript
class UserStateService {
  getUserState(userId: string): Promise<UserState> {
    // Implementation would fetch from backend
  }
  
  canTransition(from: UserState, to: UserState): boolean {
    // Implementation would check business rules
  }
  
  requestStateChange(userId: string, newState: UserState): Promise<boolean> {
    // Implementation would handle state transitions
  }
  
  getStateRequirements(state: UserState): string[] {
    // Implementation would return requirements for each state
  }
}
```

## Notifications Based on State

Users receive notifications relevant to their state:

- **New**: Welcome message, registration completion reminders
- **Pending Documents**: Document upload reminders, verification status
- **Verified**: Account activation notifications
- **Active**: Order updates, promotional offers
- **Rejected**: Rejection details, resubmission guidance
- **Blocked**: Block reason, appeal process information

## Admin State Management

Administrators can manage user states:

- View all users and their current states
- Transition users between states (with appropriate permissions)
- See state history and reasons for transitions
- Bulk state changes for system maintenance

## Testing Considerations

Each state should be tested for:

1. **UI Display**: Correct content and actions for each state
2. **Navigation**: Appropriate screen routing based on state
3. **Feature Access**: Correct enabling/disabling of features
4. **Transitions**: Valid state transitions and error handling
5. **Notifications**: Appropriate messaging for each state
6. **Edge Cases**: Invalid state combinations and error recovery

## Future Enhancements

Planned improvements to state management:

1. **Automated Transitions**: Time-based state changes
2. **Advanced Workflows**: Multi-step verification processes
3. **Audit Trail**: Comprehensive state change logging
4. **Analytics**: State-based user behavior analysis
5. **Personalization**: State-specific user experiences
6. **Integration**: Third-party verification service integration

## Conclusion

The user state management system provides a robust framework for delivering appropriate experiences to users at different stages of their journey with GasRápido. The implementation ensures security, compliance, and usability while supporting the business requirements of the platform.