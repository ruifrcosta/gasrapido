declare module '@gasrapido/shared/services/mfaService' {
  export interface MfaMethod {
    id: string;
    userId: string;
    type: 'totp' | 'sms' | 'email' | 'backup';
    secret?: string;
    phoneNumber?: string;
    emailAddress?: string;
    isPrimary: boolean;
    isVerified: boolean;
    createdAt: Date;
    lastUsedAt?: Date;
  }

  export interface MfaChallenge {
    id: string;
    userId: string;
    methodId: string;
    challenge: string;
    expiresAt: Date;
    createdAt: Date;
  }

  export class MfaService {
    registerMfaMethod(
      userId: string,
      type: 'totp' | 'sms' | 'email' | 'backup',
      options?: {
        phoneNumber?: string;
        emailAddress?: string;
      }
    ): Promise<{ method: MfaMethod; qrCode?: string; secret?: string }>;
    
    verifyMfaMethod(methodId: string, verificationCode: string): Promise<boolean>;
    setPrimaryMfaMethod(methodId: string): Promise<MfaMethod | null>;
    initiateMfaChallenge(userId: string, methodId?: string): Promise<MfaChallenge>;
    verifyMfaChallenge(challengeId: string, code: string): Promise<boolean>;
    removeMfaMethod(methodId: string): Promise<boolean>;
    getUserMfaMethods(userId: string): MfaMethod[];
    generateBackupCodes(userId: string, count?: number): string[];
  }

  const mfaService: MfaService;
  export default mfaService;
}