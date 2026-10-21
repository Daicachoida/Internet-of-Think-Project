import type { DemoAccount } from './type';

export const DEMO_ACCOUNTS: (DemoAccount & { pass: string })[] = [
  {
    title: 'Admin / Tú',
    username: 'admin',
    pass: 'Admin@123',
    roleDescription: 'admin / Admin@123'
  }
];

export const LOGIN_MESSAGES = {
  EMPTY_ERROR: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu (BR1.1)',
  INVALID_CREDENTIALS: 'Tên đăng nhập hoặc mật khẩu không chính xác (HTTP 401 Unauthorized)',
  AUTHENTICATING: 'Đang xác thực JWT Token...',
  BUTTON_SUBMIT: 'Đăng nhập vào Dashboard'
} as const;
