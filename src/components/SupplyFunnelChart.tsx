import React from 'react';
import { TalentSupplyFunnel } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { Users, Filter, Award, Activity, UserCheck, Sparkles } from 'lucide-react';

interface SupplyFunnelChartProps {
  supply: TalentSupplyFunnel;
}

export const SupplyFunnelChart: React.FC<SupplyFunnelChartProps> = ({ supply }) => {
  const steps = [
    {
      key: 'totalPotential',
      label: 'Total Potential Talent',
      count: supply.totalPotential.count,
      confidence: supply.totalPotential.confidence,
      condition: supply.totalPotential.condition,
      icon: <Users className="w-4 h-4 text-cyan-400" />,
      color: 'bg-gradient-to-r from-cyan-500 to-blue-500',
      lightBg: 'bg-cyan-500/10 border border-cyan-500/20',
      percentOfTotal: 100,
    },
    {
      key: 'addressable',
      label: 'Addressable Pool',
      count: supply.addressable.count,
      confidence: supply.addressable.confidence,
      condition: supply.addressable.condition,
      icon: <Filter className="w-4 h-4 text-indigo-400" />,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      lightBg: 'bg-indigo-500/10 border border-indigo-500/20',
      percentOfTotal: Math.round((supply.addressable.count / (supply.totalPotential.count || 1)) * 100),
    },
    {
      key: 'highlyQualified',
      label: 'Highly Qualified Specialists',
      count: supply.highlyQualified.count,
      confidence: supply.highlyQualified.confidence,
      condition: supply.highlyQualified.condition,
      icon: <Award className="w-4 h-4 text-emerald-400" />,
      color: 'bg-gradient-to-r from-indigo-500 to-emerald-500',
      lightBg: 'bg-emerald-500/10 border border-emerald-500/20',
      percentOfTotal: Math.round((supply.highlyQualified.count / (supply.totalPotential.count || 1)) * 100),
    },
  ];

  const subSegments = [
    {
      key: 'active',
      label: 'Active Market',
      count: supply.active.count,
      confidence: supply.active.confidence,
      condition: supply.active.condition,
      icon: <Activity className="w-3.5 h-3.5 text-emerald-400" />,
      shareOfQualified: Math.round((supply.active.count / (supply.highlyQualified.count || 1)) * 100),
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    },
    {
      key: 'passive',
      label: 'Passive Pipeline (Target Outbound)',
      count: supply.passive.count,
      confidence: supply.passive.confidence,
      condition: supply.passive.condition,
      icon: <UserCheck className="w-3.5 h-3.5 text-amber-400" />,
      shareOfQualified: Math.round((supply.passive.count / (supply.highlyQualified.count || 1)) * 100),
      badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    },
    {
      key: 'emerging',
      label: 'Emerging / Fast-Ramp',
      count: supply.emerging.count,
      confidence: supply.emerging.confidence,
      condition: supply.emerging.condition,
      icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />,
      shareOfQualified: Math.round((supply.emerging.count / (supply.highlyQualified.count || 1)) * 100),
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
    },
  ];

  return (
    <div id="talent-supply-funnel-container" className="space-y-6">
      {/* Funnel Steps */}
      <div className="space-y-3.5">
        {steps.map((step) => {
          const widthPercent = Math.max(18, Math.min(100, step.percentOfTotal));
          return (
            <div
              key={step.key}
              id={`funnel-step-${step.key}`}
              className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl transition-all hover:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${step.lightBg}`}>
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {step.label}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {step.condition}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-lg font-mono font-bold text-white">
                      {step.count.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono text-slate-400 ml-1.5">
                      ({step.percentOfTotal}% of total)
                    </span>
                  </div>
                  <ConfidenceBadge level={step.confidence} />
                </div>
              </div>

              {/* Progress visual bar */}
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full ${step.color} rounded-full transition-all duration-700 ease-out glow`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Breakdown Cards for Active vs Passive vs Emerging */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subSegments.map((sub) => (
          <div
            key={sub.key}
            id={`supply-subsegment-${sub.key}`}
            className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  {sub.icon}
                  <span>{sub.label}</span>
                </div>
                <ConfidenceBadge level={sub.confidence} size="sm" />
              </div>

              <div className="text-2xl font-mono font-bold text-white mb-1 tracking-tight">
                {sub.count.toLocaleString()}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {sub.condition}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Share of Qualified:</span>
              <span className="font-bold text-cyan-400">
                {sub.shareOfQualified}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
