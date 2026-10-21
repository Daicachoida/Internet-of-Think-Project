import React from 'react';

export interface NavMenuItem {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface AdminLayoutProps {
  children: React.ReactNode;
}
