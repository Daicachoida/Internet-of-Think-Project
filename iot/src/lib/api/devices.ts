import type { DeviceControlPayload, ActionRecord } from '../types';
import { DeviceActionEnum, DeviceStatusEnum } from '../constants/enums';
import { apiClient } from './client';

export interface DeviceDto {
  id: number;
  code: string;
  name: string;
  isOn: boolean;
}

export interface ControlDeviceResponse {
  deviceId: number;
  action: string;
  status: string;
  state: string;
}

export async function fetchDevicesApi(): Promise<DeviceDto[]> {
  return await apiClient<DeviceDto[]>('/api/v1/devices');
}

export async function sendDeviceControlCommand(
  payload: DeviceControlPayload
): Promise<{ success: boolean; actionLog: ActionRecord }> {
  const { deviceId, deviceName, action } = payload;

  const res = await apiClient<ControlDeviceResponse>('/api/v1/devices/control', {
    method: 'POST',
    body: JSON.stringify({
      deviceId,
      action: action.toUpperCase()
    })
  });

  const isSuccess = res.status.toLowerCase() === 'success';

  const actionLog: ActionRecord = {
    id: `#H${Date.now().toString().slice(-4)}`,
    time: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN'),
    device: deviceName,
    deviceId,
    action,
    status: isSuccess
      ? (res.state.toUpperCase() === 'ON' ? DeviceStatusEnum.ON : DeviceStatusEnum.OFF)
      : DeviceStatusEnum.FAILED,
    operator: 'Nguyễn Anh Tú',
    source: 'MQTT / Web'
  };

  return {
    success: isSuccess,
    actionLog
  };
}
