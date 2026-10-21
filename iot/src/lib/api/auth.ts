import type { AuthUser, LoginCredentials } from '../types';
import { AuthRoleEnum } from '../constants/enums';
import { apiClient } from './client';

interface BackendLoginResponse {
  token: string;
  expiresAt: string;
}

interface BackendProfileResponse {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export async function loginApi(credentials: LoginCredentials): Promise<AuthUser> {
  const { username, password } = credentials;

  // Gọi API Backend thật
  const loginRes = await apiClient<BackendLoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: username.trim(),
      password: password
    })
  });

  // Lưu tạm token để gọi profile
  const token = loginRes.token;

  let profile: BackendProfileResponse | null = null;
  try {
    profile = await apiClient<BackendProfileResponse>('/api/v1/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch {
    // Nếu chưa lấy được profile thì dùng thông tin cơ bản
  }

  const authUser: AuthUser = {
    id: profile?.id ?? 1,
    username: profile?.username ?? username.trim(),
    fullName: profile?.fullName || (username.trim().toLowerCase() === 'admin' ? 'Nguyễn Anh Tú' : username.trim()),
    role: profile?.role === 'Admin' ? AuthRoleEnum.ADMIN : AuthRoleEnum.STUDENT,
    studentId: 'B23DCCN872',
    classGroup: 'Nhóm 11',
    institution: 'Học viện Công nghệ Bưu chính Viễn thông (PTIT)',
    token: token
  };

  localStorage.setItem('iot_auth_user', JSON.stringify(authUser));
  return authUser;
}

export async function logoutApi(): Promise<void> {
  localStorage.removeItem('iot_auth_user');
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('iot_auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
