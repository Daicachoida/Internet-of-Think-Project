import React from 'react';
import { Sparkline } from '../Sparkline';
import { MONO } from '../../lib/theme/theme';
import type { SensorCardProps } from './type';

export const SensorCard: React.FC<SensorCardProps> = ({
  label,
  value,
  unit,
  color,
  Icon,
  trend,
  subtext,
  thresholdWarning = false,
  className = ''
}) => {
  // ─── Render JSX ────────────────────────────────────────────────────────────
  return (
    <div
      className={`bg-white rounded-xl border ${
        thresholdWarning ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
      } shadow-xs p-4 flex flex-col justify-between overflow-hidden hover:border-slate-300 transition-all duration-200 relative ${className}`}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </span>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color}12` }}
          >
            <Icon size={16} color={color} />
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-2 gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-slate-900" style={MONO}>
              {value}
            </span>
            <span className="text-xs font-medium text-slate-500">{unit}</span>
          </div>
          <div className="w-24 h-7 shrink-0">
            <Sparkline data={trend} color={color} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-medium text-slate-500 text-[11px]">Trực tiếp</span>
        </div>
        {subtext && (
          <span className="text-[11px] text-slate-400 font-medium">{subtext}</span>
        )}
      </div>
    </div>
  );
};

export default SensorCard;
