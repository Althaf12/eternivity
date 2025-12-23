/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_AUTH_REGISTER_URL: string;
  readonly VITE_AUTH_LOGIN_URL: string;
  readonly VITE_AUTH_ME_URL: string;
  readonly VITE_AUTH_PASSWORD_RESET_URL: string;
  readonly VITE_EXPENSE_TRACKER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
