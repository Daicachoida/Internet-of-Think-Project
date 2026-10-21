import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { MONO } from '../../lib/theme/theme';
import type { LiveClockProps } from './type';

export const LiveClock: React.FC<LiveClockProps> = ({ className = '' }) => {
  // ─── Biến ──────────────────────────────────────────────────────────────────
  const [time, setTime] = useState<Date>(new Date());

  // ─── useEffect ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ─── Render JSX ────────────────────────────────────────────────────────────
  return (
    <div
      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700 select-none shadow-xs ${className}`}
    >
      <Clock size={16} className="text-[#7a1f36] shrink-0" />
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-600 font-medium" style={MONO}>
          {time.toLocaleDateString('vi-VN', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </span>
        <span className="text-xs text-slate-400">|</span>
        <span
          className="text-sm font-semibold tracking-wider text-slate-800 leading-none"
          style={MONO}
        >
          {time.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })}
        </span>
      </div>
    </div>
  );
};

export default LiveClock;
