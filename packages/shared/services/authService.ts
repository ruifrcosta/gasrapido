// Serviço para gerenciar autenticação no GasRápido
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'client' | 'courier' | 'supplier' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: User['role'];
}

class AuthService {
  private currentUser: User | null = null;
  private tokens: AuthTokens | null = null;

  // Fazer login
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    await this.simulateApiCall();
    
    // Simular autenticação bem-sucedida
    this.currentUser = {
      id: this.generateId(),
      name: 'João Silva',
      email: credentials.email,
      role: 'client',
      createdAt: new Date().toISOString()
    };
    
    this.tokens = {
      accessToken: this.generateToken(),
      refreshToken: this.generateToken()
    };
    
    return {
      user: this.currentUser,
      tokens: this.tokens
    };
  }

  // Fazer registro
  async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    await this.simulateApiCall();
    
    // Simular registro bem-sucedido
    this.currentUser = {
      id: this.generateId(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      createdAt: new Date().toISOString()
    };
    
    this.tokens = {
      accessToken: this.generateToken(),
      refreshToken: this.generateToken()
    };
    
    return {
      user: this.currentUser,
      tokens: this.tokens
    };
  }

  // Fazer logout
  async logout(): Promise<void> {
    await this.simulateApiCall();
    
    this.currentUser = null;
    this.tokens = null;
  }

  // Verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.tokens !== null;
  }

  // Obter usuário atual
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Obter tokens de autenticação
  getTokens(): AuthTokens | null {
    return this.tokens;
  }

  // Atualizar token de acesso usando o refresh token
  async refreshAccessToken(): Promise<string | null> {
    if (!this.tokens) {
      return null;
    }
    
    await this.simulateApiCall();
    
    // Simular renovação do token
    this.tokens.accessToken = this.generateToken();
    return this.tokens.accessToken;
  }

  // Redefinir senha
  async resetPassword(email: string): Promise<boolean> {
    await this.simulateApiCall();
    
    // Simular envio de email de redefinição de senha
    console.log(`Email de redefinição de senha enviado para: ${email}`);
    return true;
  }

  // Verificar token de redefinição de senha
  async verifyPasswordResetToken(token: string): Promise<boolean> {
    await this.simulateApiCall();
    
    // Simular verificação do token
    return token.length > 10; // Token válido se tiver mais de 10 caracteres
  }

  // Alterar senha
  async changePassword(newPassword: string, resetToken?: string): Promise<boolean> {
    await this.simulateApiCall();
    
    // Simular alteração de senha
    console.log('Senha alterada com sucesso');
    return true;
  }

  // Verificar permissões do usuário
  hasRole(role: User['role']): boolean {
    return this.currentUser?.role === role;
  }

  // Verificar se o usuário tem uma das permissões especificadas
  hasAnyRole(roles: User['role'][]): boolean {
    if (!this.currentUser) {
      return false;
    }
    
    // Usar indexOf em vez de includes para compatibilidade
    return roles.indexOf(this.currentUser.role) !== -1;
  }

  // Atualizar perfil do usuário
  async updateProfile(updates: Partial<User>): Promise<User | null> {
    if (!this.currentUser) {
      return null;
    }
    
    await this.simulateApiCall();
    
    this.currentUser = { ...this.currentUser, ...updates };
    return this.currentUser;
  }

  // Obter informações do usuário por ID
  async getUserById(userId: string): Promise<User | null> {
    await this.simulateApiCall();
    
    // Simular obtenção de usuário
    if (userId === this.currentUser?.id) {
      return this.currentUser;
    }
    
    return null;
  }

  // Métodos auxiliares
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateToken(): string {
    return Math.random().toString(36).substr(2, 20);
  }

  private async simulateApiCall(): Promise<void> {
    // Simular latência de rede
    return new Promise(resolve => setTimeout(resolve, 500));
  }
}

export default new AuthService();