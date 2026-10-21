import React, { useState, useCallback } from 'react';
import { Cpu, ShieldCheck, RefreshCw, AlertTriangle, User, Lock, Eye, EyeOff, Key } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { DEMO_ACCOUNTS, LOGIN_MESSAGES } from './const';
import type { LoginPageProps } from './type';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  // ─── Biến ──────────────────────────────────────────────────────────────────
  const { login, isLoading, error, clearError } = useAuthStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // ─── Function (useCallback) ────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLocalError(null);
      clearError();

      if (!username.trim() || !password.trim()) {
        setLocalError(LOGIN_MESSAGES.EMPTY_ERROR);
        return;
      }

      const ok = await login({ username, password });
      if (ok) {
        const user = useAuthStore.getState().authUser;
        if (user && onLoginSuccess) {
          onLoginSuccess(user);
        }
      }
    },
    [username, password, login, clearError, onLoginSuccess]
  );

  const handleFillDemo = useCallback((u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setLocalError(null);
  }, []);

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const activeError = localError || error;

  // ─── Render JSX ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-900 relative">
      <div className="w-full max-w-md relative z-10">
        {/* Institutional Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#7a1f36] text-white shadow-md mb-3 border border-white/10">
            <Cpu size={24} />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-medium mb-1.5">
            Học viện Công nghệ Bưu chính Viễn thông
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Hệ thống Giám sát & Điều khiển IoT
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Giao thức MQTT • Bộ môn IoT và Ứng dụng
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-7 shadow-xl border border-slate-200">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Đăng nhập hệ thống
              </h2>
              <p className="text-xs text-slate-500">Xác thực tài khoản và quyền truy cập</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              MQTT Ready
            </div>
          </div>

          {activeError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 text-rose-500" />
              <span>{activeError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7a1f36]/20 focus:border-[#7a1f36] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7a1f36]/20 focus:border-[#7a1f36] transition-colors"
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-[#7a1f36] focus:ring-0"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <span className="text-[#7a1f36] hover:underline cursor-pointer">Quên mật khẩu?</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#7a1f36] hover:bg-[#8a191d] text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>{LOGIN_MESSAGES.AUTHENTICATING}</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>{LOGIN_MESSAGES.BUTTON_SUBMIT}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2 text-center">
              Tài khoản mẫu khảo sát
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => handleFillDemo(acc.username, acc.pass)}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors text-xs group"
                >
                  <div className="font-semibold text-slate-700 group-hover:text-[#7a1f36] flex items-center justify-between">
                    <span>{acc.title}</span>
                    <Key size={12} className="text-slate-400 group-hover:text-[#7a1f36]" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{acc.roleDescription}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Student Footer attribution */}
          <div className="mt-5 text-center text-xs text-slate-500">
            Sinh viên: <span className="text-slate-800 font-medium">Nguyễn Anh Tú</span> — MSV:{' '}
            <span className="text-[#7a1f36] font-mono font-semibold">B23DCCN872</span> (Nhóm 11)
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
