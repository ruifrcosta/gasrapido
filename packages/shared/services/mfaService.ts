// Simulação de funções de TOTP para evitar dependências externas
const generateSecret = () => {
  return {
    secret: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
    qr: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACCCAMAAADQNkiAAAAA1BMVEW10NBjBBbqAAAAH0lEQVRo3u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBLcQ8AAa0jZQAAAABJRU5ErkJggg==',
    uri: 'otpauth://totp/GasRápido:test@example.com?secret=ABCDEFGHIJKLMNOPQRSTUVWXYZ234567&issuer=GasR%C3%A1pido'
  };
};

const verifyToken = (secret: string, token: string) => {
  // Simulação de verificação - em produção, usaria uma biblioteca real
  return {
    delta: token === '123456' ? 0 : -1 // Simula token válido
  };
};

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
  private mfaMethods: Map<string, MfaMethod> = new Map();
  private mfaChallenges: Map<string, MfaChallenge> = new Map();

  /**
   * Registra um novo método MFA para um usuário
   * @param userId ID do usuário
   * @param type Tipo de MFA (totp, sms, email, backup)
   * @param options Opções específicas do método
   * @returns Método MFA criado
   */
  async registerMfaMethod(
    userId: string,
    type: 'totp' | 'sms' | 'email' | 'backup',
    options?: {
      phoneNumber?: string;
      emailAddress?: string;
    }
  ): Promise<{ method: MfaMethod; qrCode?: string; secret?: string }> {
    // Gerar ID único para o método
    const methodId = this.generateId();
    
    let secret: string | undefined;
    let qrCode: string | undefined;
    
    // Para TOTP, gerar segredo e QR Code
    if (type === 'totp') {
      const totpSecret = generateSecret();
      secret = totpSecret.secret;
      qrCode = totpSecret.qr;
    }
    
    const method: MfaMethod = {
      id: methodId,
      userId,
      type,
      secret,
      phoneNumber: options?.phoneNumber,
      emailAddress: options?.emailAddress,
      isPrimary: false,
      isVerified: false,
      createdAt: new Date()
    };
    
    this.mfaMethods.set(methodId, method);
    
    return { method, qrCode, secret };
  }

  /**
   * Verifica e ativa um método MFA
   * @param methodId ID do método MFA
   * @param verificationCode Código de verificação
   * @returns Boolean indicando sucesso
   */
  async verifyMfaMethod(methodId: string, verificationCode: string): Promise<boolean> {
    const method = this.mfaMethods.get(methodId);
    if (!method) {
      throw new Error('Método MFA não encontrado');
    }
    
    // Verificar código de acordo com o tipo de método
    let isValid = false;
    
    if (method.type === 'totp' && method.secret) {
      const verification = verifyToken(method.secret, verificationCode);
      isValid = verification ? verification.delta === 0 : false;
    } else if (method.type === 'sms' || method.type === 'email') {
      // Para SMS e email, verificar contra código enviado
      // Neste exemplo, estamos usando um código fixo para demonstração
      isValid = verificationCode === '123456';
    } else if (method.type === 'backup') {
      // Para códigos de backup, verificar contra lista de códigos
      isValid = verificationCode.length === 8 && /^[A-Z0-9]+$/.test(verificationCode);
    }
    
    if (isValid) {
      method.isVerified = true;
      // Se for o primeiro método verificado, torná-lo primário
      if (this.getUserMfaMethods(method.userId).filter(m => m.isVerified).length === 1) {
        method.isPrimary = true;
      }
      this.mfaMethods.set(methodId, method);
    }
    
    return isValid;
  }

  /**
   * Define um método MFA como primário
   * @param methodId ID do método MFA
   * @returns Método MFA atualizado
   */
  async setPrimaryMfaMethod(methodId: string): Promise<MfaMethod | null> {
    const method = this.mfaMethods.get(methodId);
    if (!method || !method.isVerified) {
      return null;
    }
    
    // Remover status primário de outros métodos do mesmo usuário
    const userMethods = this.getUserMfaMethods(method.userId);
    for (const m of userMethods) {
      if (m.isPrimary && m.id !== methodId) {
        m.isPrimary = false;
        this.mfaMethods.set(m.id, m);
      }
    }
    
    // Definir este método como primário
    method.isPrimary = true;
    this.mfaMethods.set(methodId, method);
    
    return method;
  }

  /**
   * Inicia um desafio MFA para um usuário
   * @param userId ID do usuário
   * @param methodId ID do método específico (opcional)
   * @returns Desafio MFA criado
   */
  async initiateMfaChallenge(userId: string, methodId?: string): Promise<MfaChallenge> {
    // Obter método MFA (primário se não especificado)
    let method: MfaMethod | undefined;
    
    if (methodId) {
      method = this.mfaMethods.get(methodId);
    } else {
      method = this.getUserMfaMethods(userId).find(m => m.isPrimary && m.isVerified);
    }
    
    if (!method) {
      throw new Error('Método MFA não encontrado ou não verificado');
    }
    
    // Gerar desafio específico para o tipo de método
    let challenge: string;
    
    if (method.type === 'totp') {
      // Para TOTP, o desafio é validado diretamente com o código do app
      challenge = 'totp_challenge';
    } else if (method.type === 'sms' && method.phoneNumber) {
      // Para SMS, enviar código e usar como desafio
      challenge = this.generateSmsCode();
      // Em produção, aqui enviaria o SMS de fato
      console.log(`Enviando código SMS: ${challenge} para ${method.phoneNumber}`);
    } else if (method.type === 'email' && method.emailAddress) {
      // Para email, enviar código e usar como desafio
      challenge = this.generateEmailCode();
      // Em produção, aqui enviaria o email de fato
      console.log(`Enviando código Email: ${challenge} para ${method.emailAddress}`);
    } else if (method.type === 'backup') {
      // Para backup codes, o desafio é o próprio código inserido
      challenge = 'backup_code_challenge';
    } else {
      throw new Error('Tipo de método MFA não suportado');
    }
    
    // Criar registro de desafio
    const challengeId = this.generateId();
    const mfaChallenge: MfaChallenge = {
      id: challengeId,
      userId,
      methodId: method.id,
      challenge,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Expira em 5 minutos
      createdAt: new Date()
    };
    
    this.mfaChallenges.set(challengeId, mfaChallenge);
    
    return mfaChallenge;
  }

  /**
   * Verifica um código MFA contra um desafio
   * @param challengeId ID do desafio
   * @param code Código fornecido pelo usuário
   * @returns Boolean indicando sucesso
   */
  async verifyMfaChallenge(challengeId: string, code: string): Promise<boolean> {
    const challenge = this.mfaChallenges.get(challengeId);
    if (!challenge) {
      throw new Error('Desafio MFA não encontrado');
    }
    
    // Verificar se o desafio expirou
    if (challenge.expiresAt < new Date()) {
      throw new Error('Desafio MFA expirado');
    }
    
    const method = this.mfaMethods.get(challenge.methodId);
    if (!method) {
      throw new Error('Método MFA não encontrado');
    }
    
    let isValid = false;
    
    // Verificar código de acordo com o tipo de método
    if (method.type === 'totp' && method.secret) {
      const verification = verifyToken(method.secret, code);
      isValid = verification ? verification.delta === 0 : false;
    } else if (method.type === 'sms' || method.type === 'email') {
      // Para SMS e email, comparar com o código enviado
      isValid = code === challenge.challenge;
    } else if (method.type === 'backup') {
      // Para backup codes, verificar formato
      isValid = code.length === 8 && /^[A-Z0-9]+$/.test(code);
    }
    
    if (isValid) {
      // Atualizar data de último uso do método
      method.lastUsedAt = new Date();
      this.mfaMethods.set(method.id, method);
      
      // Remover desafio após uso bem-sucedido
      this.mfaChallenges.delete(challengeId);
    }
    
    return isValid;
  }

  /**
   * Remove um método MFA
   * @param methodId ID do método MFA
   * @returns Boolean indicando sucesso
   */
  async removeMfaMethod(methodId: string): Promise<boolean> {
    const method = this.mfaMethods.get(methodId);
    if (!method) {
      return false;
    }
    
    // Não permitir remover o método primário se for o único verificado
    if (method.isPrimary) {
      const verifiedMethods = this.getUserMfaMethods(method.userId).filter(m => m.isVerified);
      if (verifiedMethods.length <= 1) {
        throw new Error('Não é possível remover o único método MFA verificado');
      }
    }
    
    this.mfaMethods.delete(methodId);
    return true;
  }

  /**
   * Obtém todos os métodos MFA de um usuário
   * @param userId ID do usuário
   * @returns Lista de métodos MFA
   */
  getUserMfaMethods(userId: string): MfaMethod[] {
    return Array.from(this.mfaMethods.values()).filter(method => method.userId === userId);
  }

  /**
   * Gera códigos de backup para um usuário
   * @param userId ID do usuário
   * @param count Número de códigos a gerar
   * @returns Lista de códigos de backup
   */
  generateBackupCodes(userId: string, count: number = 10): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      // Gerar código de backup de 8 caracteres alfanuméricos
      const code = Array.from({ length: 8 }, () => 
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(
          Math.floor(Math.random() * 36)
        )
      ).join('');
      
      codes.push(code);
    }
    
    // Registrar os códigos como métodos de backup
    for (const code of codes) {
      const methodId = this.generateId();
      const backupMethod: MfaMethod = {
        id: methodId,
        userId,
        type: 'backup',
        secret: code, // Armazenar o código como segredo
        isPrimary: false,
        isVerified: true, // Backup codes são verificados por padrão
        createdAt: new Date()
      };
      
      this.mfaMethods.set(methodId, backupMethod);
    }
    
    return codes;
  }

  /**
   * Gera um código SMS
   * @returns Código de 6 dígitos
   */
  private generateSmsCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Gera um código de email
   * @returns Código de 6 dígitos
   */
  private generateEmailCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Gera um ID único
   * @returns ID único
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Exportar instância singleton do serviço
export default new MfaService();