import React from 'react';
import { RecruitingRecommendationItem } from '../types';
import { CheckCircle2, AlertOctagon, AlertTriangle, Info, ArrowUpRight, User, ShieldCheck } from 'lucide-react';

interface RecommendationsChecklistProps {
  recommendations: RecruitingRecommendationItem[];
}

export const RecommendationsChecklist: React.FC<RecommendationsChecklistProps> = ({ recommendations }) => {
  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'Critical':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
        };
      case 'High':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        };
      case 'Medium':
        return {
          bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: <Info className="w-3.5 h-3.5 text-cyan-400" />
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
        };
    }
  };

  return (
    <div id="recruiting-recommendations-root" className="space-y-4">
      {recommendations.map((rec) => {
        const badge = getPriorityBadge(rec.priority);
        return (
          <div
            key={rec.id}
            id={`rec-item-${rec.id}`}
            className="glass-card-interactive rounded-2xl p-5 space-y-3.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${badge.bg}`}>
                  {badge.icon}
                  <span>{rec.priority} Priority</span>
                </span>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  {rec.category}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Owner: <strong className="text-white font-bold">{rec.targetStakeholder}</strong></span>
              </div>
            </div>

            <h4 className="text-sm font-bold text-white">
              {rec.recommendation}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              {rec.rationale}
            </p>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-mono font-bold flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                Expected Business Impact:
              </span>
              <span className="text-emerald-200 font-medium">
                {rec.expectedImpact}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
