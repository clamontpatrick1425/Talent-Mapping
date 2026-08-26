import React from 'react';
import { TalentMovementData } from '../types';
import { ArrowRight, TrendingUp, Shuffle, LogOut, LogIn, Lightbulb } from 'lucide-react';

interface TalentMovementFlowProps {
  data: TalentMovementData;
}

export const TalentMovementFlow: React.FC<TalentMovementFlowProps> = ({ data }) => {
  return (
    <div id="talent-movement-flow-root" className="space-y-6">
      {/* Exporters vs Importers Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Talent Exporters */}
        <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
          <div className="flex items-center gap-2 mb-3 text-rose-300 font-mono font-bold text-xs uppercase tracking-wider">
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Net Talent Exporters (High Poachability)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.likelyExporters.map((comp, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-semibold bg-rose-500/20 text-rose-200 border border-rose-500/30 rounded-lg"
              >
                {comp}
              </span>
            ))}
          </div>
          <p className="text-xs text-rose-300/80 mt-3 leading-relaxed">
            Organizations undergoing restructuring, strict RTO mandates, or slow compensation growth.
          </p>
        </div>

        {/* Talent Importers */}
        <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <div className="flex items-center gap-2 mb-3 text-emerald-300 font-mono font-bold text-xs uppercase tracking-wider">
            <LogIn className="w-4 h-4 text-emerald-400" />
            <span>Net Talent Importers (Magnet Employers)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.likelyImporters.map((comp, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 rounded-lg"
              >
                {comp}
              </span>
            ))}
          </div>
          <p className="text-xs text-emerald-300/80 mt-3 leading-relaxed">
            Top destination employers offering market-leading compute, equity liquidity, or mission prestige.
          </p>
        </div>
      </div>

      {/* Feeders & Destinations Table Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Feeder Pools */}
        <div className="glass-card rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Feeder Channels & Source Companies</span>
          </h4>
          <div className="space-y-3">
            {data.feederCompanies.map((f, i) => (
              <div key={i} className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs">
                <div className="font-bold text-white mb-0.5">
                  {f.name}
                </div>
                <div className="text-cyan-400 font-mono font-semibold mb-1">
                  Flow: {f.talentFlow}
                </div>
                <div className="text-slate-400 leading-relaxed">
                  {f.rationale}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Destination Pull Factors */}
        <div className="glass-card rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-indigo-400" />
            <span>Destination Pull Drivers</span>
          </h4>
          <div className="space-y-3">
            {data.destinationCompanies.map((d, i) => (
              <div key={i} className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs">
                <div className="font-bold text-white mb-1">
                  {d.name}
                </div>
                <div className="text-slate-300 leading-relaxed">
                  {d.pullFactor}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Career Progression & Industry Migration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Typical Career Progression */}
        <div className="glass-card rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white mb-3">
            Standard Career Progression Path
          </h4>
          <div className="space-y-2">
            {data.careerProgressionSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs">
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <span className="text-slate-200 font-medium">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Migration Patterns */}
        <div className="glass-card rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white mb-3">
            Cross-Industry Migration Patterns
          </h4>
          <div className="space-y-2.5">
            {data.industryMigrationPatterns.map((p, idx) => (
              <div key={idx} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs">
                <div className="flex items-center gap-2 font-bold text-white mb-1">
                  <span>{p.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-cyan-300">{p.to}</span>
                </div>
                <div className="text-slate-400">
                  Driver: {p.driver}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Movement Insights */}
      {data.movementInsights?.length > 0 && (
        <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-300 mb-2.5">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Strategic Talent Migration Insights</span>
          </div>
          <ul className="space-y-1.5 text-xs text-amber-200/90 list-disc list-inside">
            {data.movementInsights.map((insight, idx) => (
              <li key={idx} className="leading-relaxed">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
