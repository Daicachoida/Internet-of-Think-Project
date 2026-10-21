import React from 'react';

export const MONO: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
};

export const SANS: React.CSSProperties = {
  fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, Arial, sans-serif"
};

export const THEME_COLORS = {
  primary: '#7a1f36',        // Đỏ mận đặc trưng của Style Guide Super App
  primaryHover: '#8a191d',
  primaryActive: '#5e1729',
  primaryBg: 'rgba(122, 31, 54, 0.08)',
  primaryLight: '#fbf3f5',
  sidebarBg: '#4a0004',      // Sidebar đỏ mận đậm
  sidebarActive: '#5e0208',
  sidebarBorder: 'rgba(255, 255, 255, 0.08)',
  gold: '#d97706',
  goldLight: '#fef3c7',
  temp: '#dc2626',
  light: '#d97706',
  humidity: '#0284c7',
  bgMain: '#f8fafc',
  border: '#e2e8f0',
  textMain: '#0f172a',
  textMuted: '#64748b'
} as const;
