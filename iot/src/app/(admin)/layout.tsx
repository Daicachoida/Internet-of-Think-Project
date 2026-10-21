import React, { useCallback } from 'react';
import { Cpu, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useAppStore } from '../../stores/useAppStore';
import { LiveClock } from '../../components/LiveClock';
import { ADMIN_NAV_ITEMS, PAGE_TITLES } from './const';
import type { AdminLayoutProps } from './type';

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // ─── Biến ──────────────────────────────────────────────────────────────────
  const { authUser, logout } = useAuthStore();
  const { currentPageSlug, setCurrentPageSlug } = useAppStore();

  // ─── Function (useCallback) ────────────────────────────────────────────────
  const handleNavClick = useCallback(
    (slug: string) => {
      setCurrentPageSlug(slug);
    },
    [setCurrentPageSlug]
  );

  const handleLogoutClick = useCallback(() => {
    logout();
  }, [logout]);

  const activeTitle = PAGE_TITLES[currentPageSlug] || 'IoT Monitoring & Control Hub';

  // ─── Render JSX ────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-800">
      {/* ─── SIDEBAR ────────────────────────────────────────────────────────── */}
      <aside className="w-64 shrink-0 flex flex-col justify-between overflow-hidden bg-[#4a0004] text-white border-r border-[#5e0208] select-none shadow-md z-20">
        <div>
          {/* Brand Header */}
          <div className="px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-white border border-white/20">
                <Cpu size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white tracking-tight leading-tight">
                  IoT Hub PTIT
                </p>
                <p className="text-[11px] text-amber-300/90 font-medium mt-0.5">
                  Nhóm 11 • ESP8266 MQTT
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold px-3 py-2">
              Danh mục chức năng
            </p>
            {ADMIN_NAV_ITEMS.map(({ id, label, Icon }) => {
              const active = currentPageSlug === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavClick(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-white/15 text-white shadow-xs font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={16} className={active ? 'text-amber-300' : 'text-white/70'} />
                  <span className="flex-1 text-left truncate">{label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Hardware Status & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {/* MQTT Live Connection Pill */}
          <div className="p-2.5 rounded-lg bg-black/20 border border-white/10 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">
                MQTT Broker
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">ONLINE</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/80 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>broker.emqx.io:1883</span>
            </div>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogoutClick}
            className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-rose-950/60 border border-white/10 text-white/80 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar (70px) */}
        <header className="h-[70px] shrink-0 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              {activeTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <LiveClock />

            <div className="h-7 w-px bg-slate-200" />

            {/* User Profile Capsule */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {authUser?.fullName || 'Nguyễn Anh Tú'}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {authUser?.studentId || 'B23DCCN872'} • Quản trị viên
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#7a1f36] text-white font-semibold text-xs flex items-center justify-center shadow-xs select-none">
                AT
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Router Content */}
        <main
          className={`flex-1 bg-[#f8fafc] ${
            currentPageSlug === 'home' ? 'overflow-hidden' : 'overflow-y-auto'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
