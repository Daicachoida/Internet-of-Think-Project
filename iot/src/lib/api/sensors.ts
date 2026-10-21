import type { SensorDataPoint, SensorRecord, SensorQueryParams, PagedResponse } from '../types';
import { SensorTypeEnum, SensorStatusEnum } from '../constants/enums';
import { apiClient } from './client';

export interface SensorLatestDto {
  sensorId: number;
  code: string;
  name: string;
  unit: string;
  value: number | null;
  createdAt: string | null;
}

export interface SensorDataDto {
  id: number;
  sensorId: number;
  sensorCode: string;
  sensorName: string;
  unit: string;
  value: number;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export async function fetchLatestSensorsApi(): Promise<SensorLatestDto[]> {
  return await apiClient<SensorLatestDto[]>('/api/v1/sensors/latest');
}

export async function fetchChartDataApi(): Promise<SensorDataPoint[]> {
  try {
    // Lấy dữ liệu gần nhất từ database
    const latest = await fetchLatestSensorsApi();
    const temp = latest.find((s) => s.code === 'temp')?.value ?? 28;
    const humidity = latest.find((s) => s.code === 'humidity')?.value ?? 70;
    const light = latest.find((s) => s.code === 'light')?.value ?? 50;

    const timeStr = new Date().toTimeString().substring(0, 8);
    return [
      {
        time: timeStr,
        temp,
        light,
        humidity
      }
    ];
  } catch {
    return [];
  }
}

export async function fetchSensorHistoryApi(params: SensorQueryParams): Promise<PagedResponse<SensorRecord>> {
  const { page = 1, pageSize = 10, sensorType = 'all', sortOrder = 'desc' } = params;

  // Map sensorType to sensorId
  let sensorId: number | undefined;
  if (sensorType === SensorTypeEnum.TEMPERATURE || sensorType === 'temp') sensorId = 1;
  else if (sensorType === SensorTypeEnum.HUMIDITY || sensorType === 'humidity') sensorId = 2;
  else if (sensorType === SensorTypeEnum.LIGHT || sensorType === 'light') sensorId = 3;

  const queryParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sortDesc: String(sortOrder === 'desc')
  });

  if (sensorId !== undefined) {
    queryParams.set('sensorId', String(sensorId));
  }

  const res = await apiClient<PagedResult<SensorDataDto>>(`/api/v1/sensors/history?${queryParams.toString()}`);

  const items: SensorRecord[] = res.items.map((item) => {
    let typeEnum: SensorTypeEnum = SensorTypeEnum.TEMPERATURE;
    let isWarning = false;

    if (item.sensorCode === 'temp' || item.sensorId === 1) {
      typeEnum = SensorTypeEnum.TEMPERATURE;
      isWarning = item.value > 32;
    } else if (item.sensorCode === 'humidity' || item.sensorId === 2) {
      typeEnum = SensorTypeEnum.HUMIDITY;
      isWarning = item.value > 85;
    } else if (item.sensorCode === 'light' || item.sensorId === 3) {
      typeEnum = SensorTypeEnum.LIGHT;
      isWarning = item.value > 80;
    }

    const d = new Date(item.createdAt);
    const timeFormatted = `${d.toLocaleTimeString('vi-VN')} ${d.toLocaleDateString('vi-VN')}`;

    return {
      id: `#S${String(item.id).padStart(4, '0')}`,
      time: timeFormatted,
      sensorType: typeEnum,
      value: item.value,
      unit: item.unit,
      status: isWarning ? SensorStatusEnum.WARNING : SensorStatusEnum.NORMAL,
      deviceId: 'ESP8266_01'
    };
  });

  return {
    items,
    total: res.total,
    page: res.page,
    pageSize: res.pageSize,
    totalPages: res.totalPages
  };
}

export function generateNewSensorTriad(): SensorRecord[] {
  return [];
}
