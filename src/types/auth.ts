export interface User {
  userId: string;
  username: string;
  email: string;
  services: Record<string, unknown>;
  profileImageUrl?: string;
  hasPassword: boolean;
  authProviders: string[];
  mfaEnabled?: boolean;
}

export interface LoginResponse {
  status: 'SUCCESS' | 'MFA_REQUIRED';
  tempToken?: string;
  message?: string;
}

export interface MfaStatusResponse {
  success: boolean;
  message: string;
  mfaEnabled: boolean;
}

export interface MfaSetupResponse {
  secret: string;
  qrCodeUri: string;
  qrCodeImage: string;
  message: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  email: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}
