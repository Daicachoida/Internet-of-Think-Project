import React from 'react';
import { User, ExternalLink, GraduationCap, BookOpen, Layers } from 'lucide-react';
import { useAuthStore } from '../../../stores/useAuthStore';
import { MONO } from '../../../lib/theme/theme';
import { PROFILE_RESOURCES } from './const';

export const ProfilePage: React.FC = () => {
  // ─── Biến ──────────────────────────────────────────────────────────────────
  const { authUser } = useAuthStore();

  const fullName = authUser?.fullName || 'Nguyễn Anh Tú';
  const studentId = authUser?.studentId || 'B23DCCN872';
  const classGroup = authUser?.classGroup || 'Nhóm 11';
  const institution =
    authUser?.institution || 'Học viện Công nghệ Bưu chính Viễn thông (PTIT)';

  // ─── Render JSX ────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      {/* 1. Header Card: Thông tin sinh viên & Đề tài */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#7a1f36] text-white font-bold text-base flex items-center justify-center shadow-xs shrink-0">
              AT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{fullName}</h2>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 font-mono" style={MONO}>
                  {studentId}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{institution}</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            {classGroup}
          </span>
        </div>

        {/* Thông tin học thuật */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-xs">
          <div className="flex items-start gap-2 text-slate-600">
            <GraduationCap size={16} className="text-[#7a1f36] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700">Giảng viên hướng dẫn:</span>
              <p className="text-slate-900 font-medium">TS. Nguyễn Quốc Uy</p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-slate-600">
            <BookOpen size={16} className="text-[#7a1f36] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700">Môn học:</span>
              <p className="text-slate-900 font-medium">IoT và Ứng dụng</p>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-start gap-2 text-slate-600 pt-1">
            <Layers size={16} className="text-[#7a1f36] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700">Đề tài đồ án:</span>
              <p className="text-slate-900 font-medium">
                Hệ thống giám sát và điều khiển thiết bị IoT qua giao thức MQTT
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Card: Danh sách liên kết tài nguyên đồ án */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Tài nguyên & Liên kết đồ án
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PROFILE_RESOURCES.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 group-hover:text-[#7a1f36] transition-colors">
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{item.desc}</p>
                  </div>
                </div>

                <ExternalLink size={14} className="text-slate-400 group-hover:text-[#7a1f36] shrink-0 ml-2" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
