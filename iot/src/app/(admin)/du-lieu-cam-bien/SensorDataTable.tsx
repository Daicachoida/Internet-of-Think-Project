import React, { useCallback } from 'react';
import { Thermometer, Sun, Droplets, Database } from 'lucide-react';
import type { SensorRecord } from '../../../lib/types';
import { SensorTypeEnum, SensorStatusEnum } from '../../../lib/constants/enums';
import { MONO } from '../../../lib/theme/theme';
import { SENSOR_TABLE_COLUMNS } from './const';
import type { SensorBadgeConfig } from './type';

interface SensorDataTableProps {
  records: SensorRecord[];
}

export const SensorDataTable: React.FC<SensorDataTableProps> = ({ records }) => {
  // ─── Function (useCallback) ────────────────────────────────────────────────
  const getSensorBadge = useCallback((type: string): SensorBadgeConfig => {
    switch (type) {
      case SensorTypeEnum.TEMPERATURE:
        return {
          icon: <Thermometer size={14} className="text-[#dc2626]" />,
          cls: 'bg-red-50 text-red-700 border-red-200',
          valCls: 'text-[#dc2626]',
        };
      case SensorTypeEnum.LIGHT:
        return {
          icon: <Sun size={14} className="text-[#d97706]" />,
          cls: 'bg-amber-50 text-amber-700 border-amber-200',
          valCls: 'text-[#d97706]',
        };
      case SensorTypeEnum.HUMIDITY:
        return {
          icon: <Droplets size={14} className="text-[#0284c7]" />,
          cls: 'bg-sky-50 text-sky-700 border-sky-200',
          valCls: 'text-[#0284c7]',
        };
      default:
        return {
          icon: <Database size={14} className="text-slate-500" />,
          cls: 'bg-slate-50 text-slate-700 border-slate-200',
          valCls: 'text-slate-700',
        };
    }
  }, []);

  // ─── Render JSX ────────────────────────────────────────────────────────────
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {SENSOR_TABLE_COLUMNS.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-xs">
                Không tìm thấy bản ghi dữ liệu cảm biến nào phù hợp với điều kiện lọc.
              </td>
            </tr>
          ) : (
            records.map((row) => {
              const badge = getSensorBadge(row.sensorType);
              const isWarning = row.status === SensorStatusEnum.WARNING;

              return (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 text-xs font-semibold text-slate-600" style={MONO}>
                    {row.id}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600" style={MONO}>
                    {row.time}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.cls}`}
                    >
                      {badge.icon}
                      <span>{row.sensorType}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold ${badge.valCls}`} style={MONO}>
                      {row.value} {row.unit}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                        isWarning
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isWarning ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                      />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">{row.deviceId}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
