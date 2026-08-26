import React, { useState } from 'react';
import { CandidateSearchStrategyData } from '../types';
import { Search, Copy, Check, ExternalLink, Code2, Globe, Github, Users, Sparkles } from 'lucide-react';

interface SourcingSearchStationProps {
  data: CandidateSearchStrategyData;
}

export const SourcingSearchStation: React.FC<SourcingSearchStationProps> = ({ data }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div id="sourcing-search-station-root" className="space-y-6">
      {/* 1. LinkedIn Recruiter Boolean Strings */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>LinkedIn Recruiter & ATS Boolean Search Strings</span>
        </div>

        <div className="space-y-3">
          {data.linkedinBoolean.map((b, i) => {
            const key = `li-${i}`;
            return (
              <div key={i} className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-white">
                      {b.name}
                    </h5>
                    <p className="text-[11px] text-slate-400">{b.purpose}</p>
                  </div>

                  <button
                    id={`btn-copy-${key}`}
                    onClick={() => handleCopy(key, b.query)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    {copiedKey === key ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-mono">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy String</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 bg-slate-900/90 text-cyan-200 border border-slate-800/80 font-mono text-xs rounded-xl overflow-x-auto select-all leading-relaxed shadow-inner">
                  {b.query}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Google X-Ray Search Queries */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>Google X-Ray Sourcing Queries (Bypass Paywalls)</span>
        </div>

        <div className="space-y-3">
          {data.googleXray.map((x, i) => {
            const key = `xray-${i}`;
            const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(x.query)}`;

            return (
              <div key={i} className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-white">
                      {x.name}
                    </h5>
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      Target: {x.platform}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={googleSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold transition-all border border-slate-700"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Search on Google</span>
                    </a>

                    <button
                      id={`btn-copy-${key}`}
                      onClick={() => handleCopy(key, x.query)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      {copiedKey === key ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-mono">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/90 text-emerald-200 border border-slate-800/80 font-mono text-xs rounded-xl overflow-x-auto select-all leading-relaxed shadow-inner">
                  {x.query}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. GitHub Advanced Search */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Github className="w-4 h-4 text-indigo-400" />
          <span>GitHub Code & Contributor Sourcing</span>
        </div>

        <div className="space-y-3">
          {data.githubSearch.map((g, i) => {
            const key = `gh-${i}`;
            const githubUrl = `https://github.com/search?q=${encodeURIComponent(g.query)}&type=users`;

            return (
              <div key={i} className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-white">
                      {g.name}
                    </h5>
                    <p className="text-[11px] text-slate-400">{g.purpose}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs font-semibold transition-all border border-slate-700"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Search GitHub</span>
                    </a>

                    <button
                      id={`btn-copy-${key}`}
                      onClick={() => handleCopy(key, g.query)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      {copiedKey === key ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-mono">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/90 text-indigo-200 border border-slate-800/80 font-mono text-xs rounded-xl overflow-x-auto select-all leading-relaxed shadow-inner">
                  {g.query}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Professional Communities, Conferences, Associations */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Professional Communities, Conferences & Talent Ecosystems</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {data.professionalCommunities.map((c, i) => (
            <div key={i} className="glass-card-interactive rounded-xl p-4 text-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white">
                    {c.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {c.category}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {c.relevance}
                </p>
              </div>

              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Visit community</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
