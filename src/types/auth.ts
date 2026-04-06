export interface LoginBody {
  password: string;
}

export interface PasswordUpdateBody {
  currentPassword: string;
  newPassword: string;
}

export interface AuthenticatedSession {
  token: string;
  sessionId: number;
  expiresAt: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
}

export interface PasswordHash {
  salt: string;
  hash: string;
}

export interface AdminUserRecord {
  id: number;
  username: string;
  password_salt: string;
  password_hash: string;
  is_active: boolean;
  last_login_at: string | Date | null;
  updated_at: string | Date;
}

export interface AdminSummary {
  id: number;
  username: string;
}

export interface AdminSessionRecord {
  id: number;
  expires_at: string | Date;
}
