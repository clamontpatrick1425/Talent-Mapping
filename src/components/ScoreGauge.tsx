import React from 'react';
import { AvailabilityBand, DifficultyBand } from '../types';

interface ScoreGaugeProps {
  score: number; // 0-100
  title: string;
  type: 'availability' | 'difficulty';
  band: AvailabilityBand | DifficultyBand;
  subtitle?: string;
  id?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  title,
  type,
  band,
  subtitle,
  id = 'score-gauge'
}) => {
  // Clamp score between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score));

  // Determine color scheme based on score and type
  const getColor = () => {
    if (type === 'availability') {
      if (normalizedScore >= 80) return { stroke: '#10b981', glow: 'rgba(16,185,129,0.4)', text: 'text-emerald-300', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      if (normalizedScore >= 60) return { stroke: '#06b6d4', glow: 'rgba(6,182,212,0.4)', text: 'text-cyan-300', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' };
      if (normalizedScore >= 40) return { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.4)', text: 'text-amber-300', bg: 'bg-amber-500/15', border: 'border-amber-500/30' };
      if (normalizedScore >= 20) return { stroke: '#f97316', glow: 'rgba(249,115,22,0.4)', text: 'text-orange-300', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      return { stroke: '#ef4444', glow: 'rgba(239,68,68,0.4)', text: 'text-rose-300', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
    } else {
      // Difficulty
      if (normalizedScore <= 20) return { stroke: '#10b981', glow: 'rgba(16,185,129,0.4)', text: 'text-emerald-300', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' };
      if (normalizedScore <= 40) return { stroke: '#06b6d4', glow: 'rgba(6,182,212,0.4)', text: 'text-cyan-300', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' };
      if (normalizedScore <= 60) return { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.4)', text: 'text-amber-300', bg: 'bg-amber-500/15', border: 'border-amber-500/30' };
      if (normalizedScore <= 80) return { stroke: '#f97316', glow: 'rgba(249,115,22,0.4)', text: 'text-orange-300', bg: 'bg-orange-500/15', border: 'border-orange-500/30' };
      return { stroke: '#ef4444', glow: 'rgba(239,68,68,0.4)', text: 'text-rose-300', bg: 'bg-rose-500/15', border: 'border-rose-500/30' };
    }
  };

  const colors = getColor();

  // Semi-circle SVG math
  const radius = 64;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div id={id} className="flex flex-col items-center justify-center p-5 glass-card rounded-2xl relative overflow-hidden">
      <div className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-400 mb-1">
        {title}
      </div>

      <div className="relative flex flex-col items-center justify-center my-2">
        <svg className="w-44 h-24 overflow-visible" viewBox="0 0 160 90">
          <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={colors.stroke} floodOpacity="0.6" />
          </filter>
          {/* Background Arc */}
          <path
            d="M 16 80 A 64 64 0 0 1 144 80"
            fill="none"
            stroke="#1e293b"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Active Value Arc */}
          <path
            d="M 16 80 A 64 64 0 0 1 144 80"
            fill="none"
            stroke={colors.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            filter={`url(#glow-${id})`}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Score Value Display */}
        <div className="absolute top-10 flex flex-col items-center">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold font-mono tracking-tight text-white">
              {normalizedScore}
            </span>
            <span className="text-xs font-mono font-medium text-slate-500 ml-1">/100</span>
          </div>
        </div>
      </div>

      {/* Band Badge */}
      <div className={`mt-1 px-3 py-1 text-xs font-semibold rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
        {band}
      </div>

      {subtitle && (
        <p className="mt-2 text-[11px] text-slate-400 text-center max-w-[200px] leading-snug">
          {subtitle}
        </p>
      )}
    </div>
  );
};
