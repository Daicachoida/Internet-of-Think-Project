import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { DEVICE_FILTER_OPTIONS, ACTION_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from './const';

interface ActionFilterBarProps {
  search: string;
  deviceFilter: string;
  actionFilter: string;
  statusFilter: string;
  onSearchChange: (val: string) => void;
  onDeviceChange: (val: string) => void;
  onActionChange: (val: string) => void;
  onStatusChange: (val: string) => void;
}

export const ActionFilterBar: React.FC<ActionFilterBarProps> = ({
  search,
  deviceFilter,
  actionFilter,
  statusFilter,
  onSearchChange,
  onDeviceChange,
  onActionChange,
  onStatusChange
}) => {
  // ─── Render JSX ────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
      {/* Top Search */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Tìm kiếm lịch sử thao tác
        </label>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo ngày (22/09), giờ (20h), thiết bị, lệnh gửi, trạng thái..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7a1f36]/20 focus:border-[#7a1f36] transition-colors"
          />
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Bottom Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {/* Device Dropdown */}
        <div className="relative flex-1 min-w-[160px]">
          <select
            value={deviceFilter}
            onChange={(e) => onDeviceChange(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7a1f36]/20 transition-colors cursor-pointer"
          >
            {DEVICE_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>

        {/* Action Dropdown */}
        <div className="relative flex-1 min-w-[140px]">
          <select
            value={actionFilter}
            onChange={(e) => onActionChange(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7a1f36]/20 transition-colors cursor-pointer"
          >
            {ACTION_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative flex-1 min-w-[140px]">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7a1f36]/20 transition-colors cursor-pointer"
          >
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};
