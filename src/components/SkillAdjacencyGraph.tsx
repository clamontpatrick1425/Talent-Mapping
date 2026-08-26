import React from 'react';
import { SkillAdjacencyMapData, FitRank } from '../types';
import { Network, ArrowDownRight, CheckCircle2, ChevronRight, Zap, Target } from 'lucide-react';

interface SkillAdjacencyGraphProps {
  data: SkillAdjacencyMapData;
}

export const SkillAdjacencyGraph: React.FC<SkillAdjacencyGraphProps> = ({ data }) => {
  const getFitBadge = (fit: FitRank) => {
    switch (fit) {
      case 'Excellent Fit':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Strong Fit':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Potential Fit':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Stretch Fit':
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
  };

  const getDifficultyBadge = (diff: 'Low' | 'Medium' | 'High') => {
    switch (diff) {
      case 'Low':
        return 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border border-amber-500/30';
      case 'High':
        return 'text-rose-400 bg-rose-500/10 border border-rose-500/30';
    }
  };

  return (
    <div id="skill-adjacency-graph-root" className="space-y-6">
      {/* Central Primary Skill Banner */}
      <div className="p-5 accent-gradient text-white rounded-2xl glow flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs border border-white/20">
            <Target className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest font-mono font-bold text-cyan-200">
              Primary Skill Anchor
            </div>
            <div className="text-xl font-bold text-white tracking-tight">
              {data.primarySkill}
            </div>
          </div>
        </div>
        <div className="text-xs font-mono text-cyan-200 bg-black/30 px-3.5 py-1.5 rounded-xl border border-white/10 text-center">
          Core Target Focus
        </div>
      </div>

      {/* 3 Hierarchical Tiers */}
      <div className="space-y-6">
        {/* Tier 1: Direct Adjacent */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span>Tier 1: Direct Adjacent Skills (Immediate Transferability)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {data.directAdjacent.map((node, i) => (
              <div
                key={i}
                id={`adj-direct-${i}`}
                className="glass-card-interactive rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h5 className="font-bold text-sm text-white">
                      {node.skill}
                    </h5>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getFitBadge(node.fit)}`}>
                      {node.fit}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {node.rationale}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    <span className="font-medium text-slate-300">Profiles: </span>
                    {node.exampleProfiles.join(', ')}
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg ${getDifficultyBadge(node.transitionDifficulty)}`}>
                    {node.transitionDifficulty} Ramp
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2: Operational Adjacent */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            <span>Tier 2: Operational Adjacent Skills (Platform & Infrastructure)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {data.operationalAdjacent.map((node, i) => (
              <div
                key={i}
                id={`adj-operational-${i}`}
                className="glass-card-interactive rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h5 className="font-bold text-sm text-white">
                      {node.skill}
                    </h5>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getFitBadge(node.fit)}`}>
                      {node.fit}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {node.rationale}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    <span className="font-medium text-slate-300">Profiles: </span>
                    {node.exampleProfiles.join(', ')}
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg ${getDifficultyBadge(node.transitionDifficulty)}`}>
                    {node.transitionDifficulty} Ramp
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 3: Broader Transferable */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
            <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
            <span>Tier 3: Broader Transferable Profiles (Neighboring Disciplines)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {data.broaderTransferable.map((node, i) => (
              <div
                key={i}
                id={`adj-transferable-${i}`}
                className="glass-card-interactive rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h5 className="font-bold text-sm text-white">
                      {node.skill}
                    </h5>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getFitBadge(node.fit)}`}>
                      {node.fit}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {node.rationale}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    <span className="font-medium text-slate-300">Profiles: </span>
                    {node.exampleProfiles.join(', ')}
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg ${getDifficultyBadge(node.transitionDifficulty)}`}>
                    {node.transitionDifficulty} Ramp
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
