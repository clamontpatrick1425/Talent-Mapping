import React, { useState } from 'react';
import { CandidateArchetype } from '../types';
import { User, Target, Compass, MessageSquare, Copy, Check, ShieldAlert, Sparkles } from 'lucide-react';

interface CandidateArchetypeCardProps {
  archetypes: CandidateArchetype[];
}

export const CandidateArchetypeCard: React.FC<CandidateArchetypeCardProps> = ({ archetypes }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  return (
    <div id="candidate-archetypes-root" className="space-y-6">
      {/* Archetype Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-2 glass-card rounded-2xl">
        {archetypes.map((arch, idx) => (
          <button
            key={arch.id}
            id={`tab-archetype-${arch.id}`}
            onClick={() => setActiveTab(idx)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === idx
                ? 'accent-gradient text-white glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-black/30 font-mono text-[10px]">
              0{arch.number}
            </span>
            <span>{arch.name}</span>
          </button>
        ))}
      </div>

      {/* Active Archetype Deep Dive Card */}
      {archetypes[activeTab] && (
        <div className="glass-card rounded-2xl p-6 space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Archetype 0{archetypes[activeTab].number}
                </span>
                <span className="text-xs font-semibold text-cyan-400">
                  {archetypes[activeTab].archetypeType}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {archetypes[activeTab].name}
              </h3>
            </div>
          </div>

          {/* Background Summary */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Typical Professional Profile & Background
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {archetypes[activeTab].backgroundSummary}
            </p>
          </div>

          {/* 3 Column Grid: Target Companies/Titles, Motivations, Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Target Companies & Titles */}
            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <Target className="w-4 h-4" />
                <span>Target Companies & Titles</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-[11px] text-slate-400 font-mono">Target Employers:</div>
                  <div className="font-semibold text-slate-200 mt-0.5">
                    {archetypes[activeTab].targetCompanies.join(', ')}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-mono">Typical Titles:</div>
                  <div className="font-semibold text-slate-200 mt-0.5">
                    {archetypes[activeTab].targetTitles.join(', ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Likely Motivations */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>Likely Career Motivations</span>
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-200 list-disc list-inside">
                {archetypes[activeTab].likelyMotivations.map((m, i) => (
                  <li key={i} className="leading-snug">
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recruiting Challenges */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <ShieldAlert className="w-4 h-4" />
                <span>Recruiting Friction & Obstacles</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-200 list-disc list-inside">
                {archetypes[activeTab].recruitingChallenges.map((c, i) => (
                  <li key={i} className="leading-snug">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Skills Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-mono font-semibold text-slate-400 mr-1">Signature Skills:</span>
            {archetypes[activeTab].keySkills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-medium bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-lg"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Recommended Outreach Message Template */}
          <div className="p-5 bg-slate-950/80 border border-indigo-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Recommended Recruiter / Hiring Manager Outreach Template</span>
              </div>

              <button
                id={`copy-outreach-${archetypes[activeTab].id}`}
                onClick={() => handleCopy(archetypes[activeTab].id, archetypes[activeTab].sampleOutreachSnippet)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              >
                {copiedId === archetypes[activeTab].id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-mono">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Message</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
              {archetypes[activeTab].sampleOutreachSnippet}
            </div>

            <div className="text-[11px] text-slate-400">
              <span className="text-cyan-400 font-semibold font-mono">Recommended Hook: </span>
              {archetypes[activeTab].recommendedMessagingHook}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
