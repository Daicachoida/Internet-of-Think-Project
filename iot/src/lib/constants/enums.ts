export enum SensorTypeEnum {
  TEMPERATURE = 'Nhiệt độ',
  LIGHT = 'Ánh sáng',
  HUMIDITY = 'Độ ẩm'
}

export enum SensorStatusEnum {
  NORMAL = 'Bình thường',
  WARNING = 'Cảnh báo'
}

export enum DeviceActionEnum {
  ON = 'ON',
  OFF = 'OFF'
}

export enum DeviceStatusEnum {
  ON = 'ON',
  OFF = 'OFF',
  LOADING = 'Loading',
  FAILED = 'Failed'
}

export enum AuthRoleEnum {
  ADMIN = 'ROLE_ADMIN',
  STUDENT = 'ROLE_STUDENT',
  GUEST = 'ROLE_GUEST'
}

export enum PageSlugEnum {
  HOME = 'home',
  DATA = 'data',
  HISTORY = 'history',
  PROFILE = 'profile'
}
