import React from 'react';

export interface SensorCardProps {
  label: string;
  value: string | number;
  unit: string;
  color: string;
  Icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  trend: number[];
  subtext?: string;
  thresholdWarning?: boolean;
  className?: string;
}
