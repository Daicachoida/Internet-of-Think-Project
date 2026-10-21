import React, { useCallback } from 'react';
import type { ActionRecord } from '../../../lib/types';
import { DeviceActionEnum, DeviceStatusEnum } from '../../../lib/constants/enums';
import { MONO } from '../../../lib/theme/theme';
import { ACTION_TABLE_COLUMNS } from './const';

interface ActionDataTableProps {
  records: ActionRecord[];
}

export const ActionDataTable: React.FC<ActionDataTableProps> = ({ records }) => {
  // ─── Function (useCallback) ────────────────────────────────────────────────
  const getStatusBadge = useCallback((status: ActionRecord['status']) => {
    switch (status) {
      case DeviceStatusEnum.ON:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case DeviceStatusEnum.OFF:
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case DeviceStatusEnum.LOADING:
        return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
      case DeviceStatusEnum.FAILED:
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }, []);

  // ─── Render JSX ────────────────────────────────────────────────────────────
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {ACTION_TABLE_COLUMNS.map((h) => (
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
              <td colSpan={7} className="px-4 py-10 text-center text-slate-400 text-xs">
                Không tìm thấy lịch sử điều khiển nào phù hợp.
              </td>
            </tr>
          ) : (
            records.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3 text-xs font-semibold text-slate-600" style={MONO}>
                  {row.id}
                </td>
                <td className="px-4 py-3 text-xs text-slate-600" style={MONO}>
                  {row.time}
                </td>
                <td className="px-4 py-3 font-semibold text-slate-800 text-xs">
                  {row.device}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                      row.action === DeviceActionEnum.ON
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                    style={MONO}
                  >
                    {row.action}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getStatusBadge(
                      row.status
                    )}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        row.status === DeviceStatusEnum.ON
                          ? 'bg-emerald-500'
                          : row.status === DeviceStatusEnum.LOADING
                          ? 'bg-amber-500 animate-spin'
                          : row.status === DeviceStatusEnum.FAILED
                          ? 'bg-rose-500'
                          : 'bg-slate-400'
                      }`}
                    />
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-700 font-medium">{row.operator}</td>
                <td className="px-4 py-3 text-xs text-slate-500 font-mono">{row.source}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
