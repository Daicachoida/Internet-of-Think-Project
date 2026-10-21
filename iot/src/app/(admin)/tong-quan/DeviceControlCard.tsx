import React from 'react';
import { Zap } from 'lucide-react';
import { useAppStore } from '../../../stores/useAppStore';
import { Toggle } from '../../../components/Toggle';
import { DEVICE_CONTROLS } from './const';

export const DeviceControlCard: React.FC = () => {
  // ─── Biến ──────────────────────────────────────────────────────────────────
  const { ledStates, loadingLed, toggleLed } = useAppStore();

  // ─── Render JSX ────────────────────────────────────────────────────────────
  return (
    <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col gap-3 overflow-hidden min-h-0">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Điều khiển ngoại vi
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Lệnh thời gian thực qua MQTT</p>
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          3 Online
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {DEVICE_CONTROLS.map(({ key, id, name, label }) => {
          const active = ledStates[key];
          const isLoading = loadingLed === key;

          return (
            <div
              key={key}
              className={`rounded-lg border px-3.5 py-2.5 flex items-center justify-between transition-colors ${
                active
                  ? 'bg-amber-50/40 border-amber-200 shadow-2xs'
                  : 'bg-slate-50/70 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                    active
                      ? 'bg-amber-100 border-amber-300 text-amber-700'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  <Zap size={16} className={active ? 'fill-amber-500/40' : ''} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{label}</p>
                  <p className="text-[11px] text-slate-500 truncate">{name}</p>
                </div>
              </div>

              <div className="flex items-center shrink-0">
                <Toggle
                  on={active}
                  disabled={isLoading}
                  onChange={() => toggleLed(key, id, name)}
                  color="#10B981"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
