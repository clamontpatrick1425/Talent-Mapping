import React from 'react';
import { ConfidenceLevel } from '../types';
import { CheckCircle2, HelpCircle, AlertTriangle, Sparkles } from 'lucide-react';

interface ConfidenceBadgeProps {
  level?: ConfidenceLevel | string | undefined;
  source?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  level = 'inferred',
  source,
  size = 'sm',
  showLabel = true,
}) => {
  const safeLevel = (level as ConfidenceLevel) || 'inferred';
  const getBadgeConfig = () => {
    switch (safeLevel) {
      case 'verified':
        return {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
          icon: <CheckCircle2 className={size === 'sm' ? 'w-3 h-3 text-emerald-400' : 'w-3.5 h-3.5 text-emerald-400'} />,
          label: 'Verified',
          desc: 'Backed by direct JD statement or empirical data source',
        };
      case 'estimated':
        return {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
          icon: <AlertTriangle className={size === 'sm' ? 'w-3 h-3 text-amber-400' : 'w-3.5 h-3.5 text-amber-400'} />,
          label: 'Estimated',
          desc: 'Analytical estimate from market models & workforce benchmarks',
        };
      case 'inferred':
        return {
          bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
          icon: <Sparkles className={size === 'sm' ? 'w-3 h-3 text-cyan-400' : 'w-3.5 h-3.5 text-cyan-400'} />,
          label: 'Inferred',
          desc: 'Deduced logically from contextual industry and domain signals',
        };
      case 'unknown':
      default:
        return {
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/40 border-dashed',
          icon: <HelpCircle className={size === 'sm' ? 'w-3 h-3 text-rose-400' : 'w-3.5 h-3.5 text-rose-400'} />,
          label: 'Unknown',
          desc: 'Reliable empirical data was not provided in input',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      id={`confidence-badge-${safeLevel}-${Math.random().toString(36).substr(2, 4)}`}
      title={`${config.label}: ${config.desc}${source ? ` (Source: ${source})` : ''}`}
      className={`inline-flex items-center gap-1.5 font-mono font-medium border rounded-full transition-all duration-150 select-none ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${config.bg}`}
    >
      {config.icon}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};
