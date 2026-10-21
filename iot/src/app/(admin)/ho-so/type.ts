import React from 'react';

export interface ProfileResourceItem {
  title: string;
  desc: string;
  url: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}
