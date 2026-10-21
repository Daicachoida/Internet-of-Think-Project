import type { ActionRecord, ActionQueryParams, PagedResponse } from '../types';
import { DeviceActionEnum, DeviceStatusEnum } from '../constants/enums';
import { apiClient } from './client';

export interface ActionHistoryDto {
  id: number;
  deviceId: number;
  deviceCode: string;
  deviceName: string;
  userId: number | null;
  username: string | null;
  action: string;
  status: string;
  createdAt: string;
  respondedAt: string | null;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export async function fetchActionHistoryApi(params: ActionQueryParams): Promise<PagedResponse<ActionRecord>> {
  const { page = 1, pageSize = 10, device = 'all', action = 'all', status = 'all' } = params;

  const queryParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize)
  });

  if (device !== 'all') {
    // If device contains 1, 2, 3
    if (device.includes('1') || device.toLowerCase().includes('nhiệt')) queryParams.set('deviceId', '1');
    else if (device.includes('2') || device.toLowerCase().includes('chiếu')) queryParams.set('deviceId', '2');
    else if (device.includes('3') || device.toLowerCase().includes('độ ẩm')) queryParams.set('deviceId', '3');
  }

  const res = await apiClient<PagedResult<ActionHistoryDto>>(`/api/v1/action-history?${queryParams.toString()}`);

  const items: ActionRecord[] = res.items.map((item) => {
    const isSuccess = item.status.toLowerCase() === 'success';
    const isPending = item.status.toLowerCase() === 'pending';
    const isActionOn = item.action.toUpperCase() === 'ON';

    let displayStatus: DeviceStatusEnum | string = DeviceStatusEnum.FAILED;
    if (isPending) displayStatus = DeviceStatusEnum.LOADING;
    else if (isSuccess) displayStatus = isActionOn ? DeviceStatusEnum.ON : DeviceStatusEnum.OFF;

    const d = new Date(item.createdAt);
    const timeFormatted = `${d.toLocaleTimeString('vi-VN')} ${d.toLocaleDateString('vi-VN')}`;

    return {
      id: `#H${String(item.id).padStart(4, '0')}`,
      time: timeFormatted,
      device: item.deviceName,
      deviceId: item.deviceId,
      action: isActionOn ? DeviceActionEnum.ON : DeviceActionEnum.OFF,
      status: displayStatus,
      operator: item.username || 'Admin',
      source: 'MQTT / Web'
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
