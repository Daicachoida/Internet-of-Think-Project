import React, { useMemo } from 'react';
import { Thermometer, Sun, Droplets } from 'lucide-react';
import { useAppStore } from '../../../stores/useAppStore';
import { SensorCard } from '../../../components/SensorCard';
import { SensorChartCard } from './SensorChartCard';
import { DeviceControlCard } from './DeviceControlCard';

export const DashboardPage: React.FC = () => {
  // ─── Biến ──────────────────────────────────────────────────────────────────
  const { chartData } = useAppStore();

  const latestPoint = useMemo(
    () => chartData[chartData.length - 1] || { temp: 27.5, light: 420, humidity: 65 },
    [chartData]
  );
  const tempData = useMemo(() => chartData.map((d) => d.temp), [chartData]);
  const lightData = useMemo(() => chartData.map((d) => d.light), [chartData]);
  const humidData = useMemo(() => chartData.map((d) => d.humidity), [chartData]);

  // ─── Render JSX ────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col p-3.5 sm:p-4 gap-3 overflow-hidden max-w-7xl mx-auto">
      {/* Top Row: 3 Real-time Sensor Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0">
        <SensorCard
          label="Cảm biến Nhiệt độ"
          value={latestPoint.temp.toFixed(1)}
          unit="°C"
          color="#DC2626"
          Icon={Thermometer}
          trend={tempData}
          subtext="Chuẩn: 18 - 32 °C"
          thresholdWarning={latestPoint.temp > 30.5}
        />
        <SensorCard
          label="Cảm biến Ánh sáng"
          value={Math.round(latestPoint.light)}
          unit="Lux"
          color="#D97706"
          Icon={Sun}
          trend={lightData}
          subtext="Chuẩn: 200 - 900 Lux"
          thresholdWarning={latestPoint.light > 1000}
        />
        <SensorCard
          label="Cảm biến Độ ẩm"
          value={latestPoint.humidity.toFixed(1)}
          unit="%"
          color="#0284C7"
          Icon={Droplets}
          trend={humidData}
          subtext="Chuẩn: 40 - 80 %"
          thresholdWarning={latestPoint.humidity > 80}
        />
      </div>

      {/* Main Row: Graph (Left 65%) + Device Controls (Right 35%) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        <SensorChartCard chartData={chartData} />
        <DeviceControlCard />
      </div>
    </div>
  );
};

export default DashboardPage;
