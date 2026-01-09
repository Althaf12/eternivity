export interface User {
  userId: string;
  username: string;
  email: string;
  services: Record<string, unknown>;
  profileImageUrl?: string;
}

// Legacy types kept for reference - not used with centralized SSO
// Authentication is now handled entirely by auth.eternivity.com via HttpOnly cookies

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
