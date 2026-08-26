import React from 'react';
import { CompensationIntelligenceData } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { DollarSign, TrendingUp, MapPin, Sparkles, AlertCircle } from 'lucide-react';

interface CompensationChartProps {
  data: CompensationIntelligenceData;
}

export const CompensationChart: React.FC<CompensationChartProps> = ({ data }) => {
  const currencySymbol = data.currency === 'USD' ? '$' : data.currency;

  const percentiles = [
    { label: '25th Percentile (Entry Band)', value: data.baseSalary.p25, desc: 'Below average / smaller firm range' },
    { label: '50th Percentile (Market Median)', value: data.baseSalary.p50, desc: 'Competitive market median' },
    { label: '75th Percentile (Upper Quartile)', value: data.baseSalary.p75, desc: 'Target for closing top-tier talent' },
    { label: '90th Percentile (Elite / Tier-1)', value: data.baseSalary.p90, desc: 'Big tech / premier hedge fund level' },
  ];

  return (
    <div id="compensation-intelligence-root" className="space-y-6">
      {/* Header Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Median Base Target */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Market Median Base</span>
            <ConfidenceBadge level={data.confidence} source={data.dataSource} />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">
            {currencySymbol}{data.baseSalary.p50.toLocaleString()}
          </div>
          <p className="text-xs font-mono text-cyan-400 mt-1.5">
            Range: {currencySymbol}{data.baseSalary.p25.toLocaleString()} - {currencySymbol}{data.baseSalary.p75.toLocaleString()}
          </p>
        </div>

        {/* Total Cash Target */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Target Total Cash</span>
            <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
              {data.marketPosition}
            </span>
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">
            {currencySymbol}{data.totalCashTarget.target.toLocaleString()}
          </div>
          <p className="text-xs font-mono text-emerald-400 mt-1.5">
            Max Potential: {currencySymbol}{data.totalCashTarget.max.toLocaleString()}
          </p>
        </div>

        {/* Equity & LTI */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Equity & Incentives</span>
          <p className="text-xs text-slate-300 leading-relaxed my-1.5">
            {data.equityNotes}
          </p>
          <span className="text-[10px] font-mono text-slate-500">RSU / Stock Option Equivalent</span>
        </div>
      </div>

      {/* Percentile Distribution Chart Bars */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Base Salary Distribution Percentiles</span>
        </h4>

        <div className="space-y-3.5">
          {percentiles.map((p, i) => {
            const widthPct = Math.round((p.value / (data.baseSalary.p90 * 1.05)) * 100);
            return (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{p.label}</span>
                  <span className="font-mono font-bold text-white">
                    {currencySymbol}{p.value.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-700 glow"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">{p.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Geographic Adjustments & Scarce Skill Premiums */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Geographic Metro Premiums */}
        <div className="glass-card rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white mb-3.5 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Geographic Market Cost Differentials</span>
          </h4>
          <div className="space-y-2.5">
            {data.geographicPremiums.map((geo, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs">
                <div>
                  <div className="font-bold text-white">{geo.metro}</div>
                  <div className="text-[11px] text-slate-400">{geo.notes}</div>
                </div>
                <span className={`font-mono font-bold px-2.5 py-1 rounded-lg text-xs ${
                  geo.adjustmentPct > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  geo.adjustmentPct < 0 ? 'bg-slate-800 text-slate-300 border border-slate-700' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {geo.adjustmentPct > 0 ? `+${geo.adjustmentPct}%` : `${geo.adjustmentPct}%`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scarce Skill Premiums */}
        <div className="glass-card rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white mb-3.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Scarce-Skill Premium Increments</span>
          </h4>
          <div className="space-y-2.5">
            {data.scarceSkillPremiums.map((prem, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs">
                <div>
                  <div className="font-bold text-white">{prem.skill}</div>
                  <div className="text-[11px] text-slate-400">{prem.description}</div>
                </div>
                <span className="font-mono font-bold px-2.5 py-1 rounded-lg text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  +{prem.premiumPercentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statutory Disclaimer & Source Note */}
      <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-start gap-2.5 text-xs text-slate-400">
        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-200">Source: </span>
          {data.dataSource}. {data.salaryDisclaimer}
        </div>
      </div>
    </div>
  );
};
