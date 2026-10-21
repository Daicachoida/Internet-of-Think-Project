import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { SensorDataPoint } from '../../../lib/types';
import { MONO } from '../../../lib/theme/theme';
import { CHART_TABS } from './const';
import type { ActiveChartParam } from './type';

interface SensorChartCardProps {
  chartData: SensorDataPoint[];
}

export const SensorChartCard: React.FC<SensorChartCardProps> = ({ chartData }) => {
  // ─── Biến ──────────────────────────────────────────────────────────────────
  const [activeParam, setActiveParam] = useState<ActiveChartParam>('all');

  // ─── Render JSX ────────────────────────────────────────────────────────────
  return (
    <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between overflow-hidden min-h-0">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800">
              Biểu đồ biến thiên dữ liệu cảm biến
            </h3>
            <span
              className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
              style={MONO}
            >
              20 điểm gần nhất
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Nhiệt độ (°C) • Ánh sáng (Lux) • Độ ẩm (%)</p>
        </div>

        {/* Parameter selection tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0 text-xs">
          {CHART_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveParam(tab.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeParam === tab.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Display Area */}
      <div className="flex-1 w-full min-h-0 pt-3">
        <ResponsiveContainer width="100%" height="100%">
          {activeParam === 'all' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b', ...MONO }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748b', ...MONO }} axisLine={false} tickLine={false} domain={['auto', 'auto']} width={35} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#d97706', ...MONO }} axisLine={false} tickLine={false} domain={['auto', 'auto']} width={35} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: 6,
                  color: '#f8fafc',
                  fontSize: 12,
                  ...MONO
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
              <Line yAxisId="left" type="monotone" dataKey="temp" name="Nhiệt độ (°C)" stroke="#dc2626" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} isAnimationActive={false} />
              <Line yAxisId="right" type="monotone" dataKey="light" name="Ánh sáng (Lux)" stroke="#d97706" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} isAnimationActive={false} />
              <Line yAxisId="left" type="monotone" dataKey="humidity" name="Độ ẩm (%)" stroke="#0284c7" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} isAnimationActive={false} />
            </LineChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b', ...MONO }} axisLine={false} tickLine={false} />
              <YAxis
                domain={['dataMin - 1', 'dataMax + 1']}
                tick={{ fontSize: 10, fill: '#64748b', ...MONO }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: 6,
                  color: '#f8fafc',
                  fontSize: 12,
                  ...MONO
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
              {activeParam === 'temp' && (
                <Line type="monotone" dataKey="temp" name="Nhiệt độ (°C)" stroke="#dc2626" strokeWidth={2.5} dot={{ r: 2.5, fill: '#dc2626' }} activeDot={{ r: 4.5 }} isAnimationActive={false} />
              )}
              {activeParam === 'light' && (
                <Line type="monotone" dataKey="light" name="Ánh sáng (Lux)" stroke="#d97706" strokeWidth={2.5} dot={{ r: 2.5, fill: '#d97706' }} activeDot={{ r: 4.5 }} isAnimationActive={false} />
              )}
              {activeParam === 'humidity' && (
                <Line type="monotone" dataKey="humidity" name="Độ ẩm (%)" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 2.5, fill: '#0284c7' }} activeDot={{ r: 4.5 }} isAnimationActive={false} />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
