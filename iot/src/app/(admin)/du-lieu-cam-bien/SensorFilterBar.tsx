import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, ChevronDown, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { SENSOR_TYPE_OPTIONS } from './const';

interface SensorFilterBarProps {
  appliedSearch: string;
  appliedSensorType: string;
  sortOrder: 'asc' | 'desc';
  isResetting: boolean;
  onSearch: (params: { keyword: string; sensorType: string }) => void;
  onToggleSortOrder: () => void;
  onReset: () => void;
}

export const SensorFilterBar: React.FC<SensorFilterBarProps> = ({
  appliedSearch,
  appliedSensorType,
  sortOrder,
  isResetting,
  onSearch,
  onToggleSortOrder,
  onReset
}) => {
  // ─── Biến ──────────────────────────────────────────────────────────────────
  const [keyword, setKeyword] = useState(appliedSearch);
  const [sensorType, setSensorType] = useState(appliedSensorType);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ─── Function (useCallback) ────────────────────────────────────────────────
  const handleKeywordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const handleSensorTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSensorType(val);
    if (val === 'time') {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, []);

  const handleSearchSubmit = useCallback(() => {
    onSearch({ keyword: keyword.trim(), sensorType });
  }, [keyword, sensorType, onSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit]
  );

  const handleResetClick = useCallback(() => {
    setKeyword('');
    setSensorType('all');
    onReset();
  }, [onReset]);

  // ─── useEffect ─────────────────────────────────────────────────────────────
  useEffect(() => {
    setKeyword(appliedSearch);
  }, [appliedSearch]);

  useEffect(() => {
    setSensorType(appliedSensorType);
  }, [appliedSensorType]);

  // ─── Render JSX ────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex flex-wrap items-end gap-3">
        {/* Search Keyword */}
        <div className="flex-1 min-w-[220px]">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {sensorType === 'time' ? 'Nhập thời gian tìm kiếm' : 'Từ khóa tìm kiếm'}
          </label>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={keyword}
              onChange={handleKeywordChange}
              onKeyDown={handleKeyDown}
              placeholder={
                sensorType === 'time'
                  ? 'Nhập ngày tháng (VD: 21/10/2026, 21/10), giờ (18h, 18:15)...'
                  : 'Nhập ID, ngày (21/10), giờ (18h), giá trị...'
              }
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7a1f36]/20 focus:border-[#7a1f36] transition-colors"
            />
          </div>
        </div>

        {/* Sensor Type */}
        <div className="w-56">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Loại cảm biến
          </label>
          <div className="relative">
            <select
              value={sensorType}
              onChange={handleSensorTypeChange}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7a1f36]/20 focus:border-[#7a1f36] transition-colors cursor-pointer"
            >
              {SENSOR_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Submit Search Button */}
        <button
          type="button"
          onClick={handleSearchSubmit}
          className="px-4 py-2 rounded-lg bg-[#7a1f36] hover:bg-[#8a191d] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer h-[36px] shadow-xs"
        >
          <Search size={14} />
          <span>Tìm kiếm</span>
        </button>

        {/* Sort Button */}
        <button
          type="button"
          onClick={onToggleSortOrder}
          className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer h-[36px]"
        >
          <SlidersHorizontal
            size={14}
            className={sortOrder === 'asc' ? 'rotate-180 transition-transform' : 'transition-transform'}
          />
          <span>Sắp xếp ({sortOrder.toUpperCase()})</span>
        </button>

        {/* Reset / Refresh Button */}
        <button
          type="button"
          onClick={handleResetClick}
          disabled={isResetting}
          title="Làm mới bộ lọc và nạp dữ liệu tức thời"
          className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer h-[36px] disabled:opacity-60"
        >
          <RefreshCw size={14} className={isResetting ? 'animate-spin' : ''} />
          <span>Làm mới</span>
        </button>
      </div>
    </div>
  );
};

export default SensorFilterBar;
