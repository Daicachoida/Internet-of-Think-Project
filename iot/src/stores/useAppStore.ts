import { create } from 'zustand';
import type { SensorDataPoint, SensorRecord, ActionRecord, DeviceStateMap } from '../lib/types';
import { DeviceActionEnum, DeviceStatusEnum } from '../lib/constants/enums';
import { fetchDevicesApi, sendDeviceControlCommand } from '../lib/api/devices';
import { fetchLatestSensorsApi, fetchSensorHistoryApi } from '../lib/api/sensors';
import { fetchActionHistoryApi } from '../lib/api/history';

interface AppState {
  chartData: SensorDataPoint[];
  sensorRecords: SensorRecord[];
  historyRows: ActionRecord[];
  ledStates: DeviceStateMap;
  loadingLed: string | null;
  isLiveStreaming: boolean;
  currentPageSlug: string;

  // Actions
  setChartData: (data: SensorDataPoint[] | ((prev: SensorDataPoint[]) => SensorDataPoint[])) => void;
  addLiveSensorPoint: (point: SensorDataPoint) => void;
  setSensorRecords: (records: SensorRecord[] | ((prev: SensorRecord[]) => SensorRecord[])) => void;
  resetSensorRecords: () => void;
  setHistoryRows: (rows: ActionRecord[] | ((prev: ActionRecord[]) => ActionRecord[])) => void;
  toggleLed: (ledKey: keyof DeviceStateMap, deviceId: number, deviceName: string) => Promise<void>;
  setIsLiveStreaming: (live: boolean | ((prev: boolean) => boolean)) => void;
  setCurrentPageSlug: (slug: string) => void;
  syncFromBackend: () => Promise<void>;
  refreshHistory: () => Promise<void>;
  refreshSensorData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  chartData: [],
  sensorRecords: [],
  historyRows: [],
  ledStates: { led1: false, led2: false, led3: false },
  loadingLed: null,
  isLiveStreaming: true,
  currentPageSlug: 'home',

  setChartData: (data) =>
    set((state) => ({
      chartData: typeof data === 'function' ? data(state.chartData) : data
    })),

  addLiveSensorPoint: (point) =>
    set((state) => {
      const next = [...state.chartData, point];
      return {
        chartData: next.length > 20 ? next.slice(next.length - 20) : next
      };
    }),

  setSensorRecords: (records) =>
    set((state) => ({
      sensorRecords: typeof records === 'function' ? records(state.sensorRecords) : records
    })),

  resetSensorRecords: () => {
    get().refreshSensorData();
  },

  setHistoryRows: (rows) =>
    set((state) => ({
      historyRows: typeof rows === 'function' ? rows(state.historyRows) : rows
    })),

  toggleLed: async (ledKey, deviceId, deviceName) => {
    const state = get();
    if (state.loadingLed) return;

    const currentVal = state.ledStates[ledKey];
    const targetAction = currentVal ? DeviceActionEnum.OFF : DeviceActionEnum.ON;

    // 1. Lock switch while executing command
    set({ loadingLed: ledKey });

    try {
      // 2. Call real backend API
      const res = await sendDeviceControlCommand({
        deviceId,
        deviceKey: ledKey,
        deviceName,
        action: targetAction
      });

      if (res.success) {
        set((s) => ({
          ledStates: { ...s.ledStates, [ledKey]: !currentVal },
          loadingLed: null,
          historyRows: [res.actionLog, ...s.historyRows]
        }));
      } else {
        set({ loadingLed: null });
      }
    } catch (err: any) {
      console.error('Failed to control device:', err);
      set({ loadingLed: null });
      alert(`Điều khiển thất bại: ${err.message || 'Lỗi kết nối'}`);
    }
  },

  setIsLiveStreaming: (live) =>
    set((state) => ({
      isLiveStreaming: typeof live === 'function' ? live(state.isLiveStreaming) : live
    })),

  setCurrentPageSlug: (slug) => set({ currentPageSlug: slug }),

  // Đồng bộ trạng thái thiết bị và dữ liệu cảm biến mới nhất từ server
  syncFromBackend: async () => {
    try {
      const [devices, sensors] = await Promise.allSettled([
        fetchDevicesApi(),
        fetchLatestSensorsApi()
      ]);

      if (devices.status === 'fulfilled') {
        const dList = devices.value;
        const d1 = dList.find((d) => d.id === 1);
        const d2 = dList.find((d) => d.id === 2);
        const d3 = dList.find((d) => d.id === 3);

        set({
          ledStates: {
            led1: d1 ? d1.isOn : false,
            led2: d2 ? d2.isOn : false,
            led3: d3 ? d3.isOn : false
          }
        });
      }

      if (sensors.status === 'fulfilled') {
        const sList = sensors.value;
        const temp = sList.find((s) => s.code === 'temp')?.value ?? 28;
        const humidity = sList.find((s) => s.code === 'humidity')?.value ?? 70;
        const light = sList.find((s) => s.code === 'light')?.value ?? 50;

        const timeStr = new Date().toTimeString().substring(0, 8);
        get().addLiveSensorPoint({
          time: timeStr,
          temp,
          light,
          humidity
        });
      }
    } catch (err) {
      console.error('Sync failed:', err);
    }
  },

  refreshHistory: async () => {
    try {
      const res = await fetchActionHistoryApi({ page: 1, pageSize: 50 });
      set({ historyRows: res.items });
    } catch (err) {
      console.error('Refresh history failed:', err);
    }
  },

  refreshSensorData: async () => {
    try {
      const res = await fetchSensorHistoryApi({ page: 1, pageSize: 50 });
      set({ sensorRecords: res.items });
    } catch (err) {
      console.error('Refresh sensor data failed:', err);
    }
  }
}));
