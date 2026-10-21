import React, { useMemo } from 'react';
import type { SparklineProps } from './type';

export const Sparkline: React.FC<SparklineProps> = ({ data, color, className = '' }) => {
  // ─── Biến & useMemo ────────────────────────────────────────────────────────
  const { d, fill, gradId, W, H } = useMemo(() => {
    if (!data || data.length < 2) return { d: '', fill: '', gradId: '', W: 200, H: 40 };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const isFlat = max === min;
    const range = isFlat ? 1 : max - min;
    const width = 200;
    const height = 40;

    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = isFlat ? height / 2 : height - ((v - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    });

    return {
      d: `M ${pts.join(' L ')}`,
      fill: isFlat
        ? `M 0,${height} L 0,${height / 2} L ${width},${height / 2} L ${width},${height} Z`
        : `M 0,${height} L ${pts.join(' L ')} L ${width},${height} Z`,
      gradId: `sg-${color.replace('#', '')}`,
      W: width,
      H: height
    };
  }, [data, color]);

  // ─── Early return ──────────────────────────────────────────────────────────
  if (!data || data.length < 2) return null;

  // ─── Render JSX ────────────────────────────────────────────────────────────
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={`w-full h-10 ${className}`}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${gradId})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

export default Sparkline;
