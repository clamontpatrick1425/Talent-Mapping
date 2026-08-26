import React, { useState } from 'react';
import { EmployerLandscapeItem, TargetCompanyEntry, TalentMapReport } from '../types';
import { CompanyDossierModal } from './CompanyDossierModal';
import { Building2, Search, Filter, AlertCircle, CheckCircle, ExternalLink, Flame, Eye, Sparkles } from 'lucide-react';

interface CompanyTableProps {
  landscape: EmployerLandscapeItem[];
  targetList: TargetCompanyEntry[];
  report?: TalentMapReport;
}

export const CompanyTable: React.FC<CompanyTableProps> = ({ landscape, targetList, report }) => {
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<EmployerLandscapeItem | TargetCompanyEntry | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);

  const handleOpenDossier = (comp: EmployerLandscapeItem | TargetCompanyEntry) => {
    setSelectedCompany(comp);
    setIsDossierOpen(true);
  };

  const filteredLandscape = (landscape || []).filter(item => {
    const matchesTier = selectedTier === 'ALL' || item.tier === selectedTier;
    const matchesQuery = !searchQuery ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.relevantSkills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.relevantTitles?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTier && matchesQuery;
  });

  const getHiringBadge = (act: string) => {
    switch (act) {
      case 'High':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Moderate':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Low':
      case 'Cooling':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'Layoff Signals':
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Tier 1':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Tier 2':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'Tier 3':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Tier 4':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div id="company-table-root" className="space-y-5">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, skill, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-hidden focus:border-cyan-500 text-white placeholder-slate-500 font-medium"
          />
        </div>

        {/* Tier Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl text-xs self-stretch sm:self-auto">
          {['ALL', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedTier === tier
                  ? 'accent-gradient text-white glow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tier === 'ALL' ? 'All Tiers' : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Landscape Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLandscape.map((comp) => (
          <div
            key={comp.id}
            id={`employer-card-${comp.id}`}
            className="glass-card-interactive rounded-2xl p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getTierColor(comp.tier)}`}>
                      {comp.tier}: {comp.tierLabel}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getHiringBadge(comp.hiringActivity)}`}>
                      {comp.hiringActivity} Activity
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {comp.name}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3.5">
                {comp.rationale}
              </p>

              {/* Poaching Angle Callout */}
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl mb-3.5">
                <div className="text-[11px] font-mono font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Poaching Angle & Vulnerability:</span>
                </div>
                <div className="text-xs text-cyan-100 leading-relaxed">
                  {comp.poachingAngle}
                </div>
              </div>

              {/* Titles & Skills Tags */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-mono">Target Titles: </span>
                  <span className="text-slate-200">
                    {comp.relevantTitles.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono">Key Skills: </span>
                  <span className="text-slate-200">
                    {comp.relevantSkills.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Location: {comp.geographicPresence}</span>
              <button
                onClick={() => handleOpenDossier(comp)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-bold transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Dossier & Queries</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Target Company Matrix Summary (Section 11) */}
      {targetList?.length > 0 && (
        <div className="mt-6 p-5 bg-slate-950/70 border border-slate-800 rounded-2xl">
          <h4 className="text-sm font-bold text-white mb-3.5 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Section 11: Target Company Priority Matrix</span>
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-900 border-b border-slate-800">
                <tr>
                  <th className="px-3 py-2.5 rounded-l-lg">Priority</th>
                  <th className="px-3 py-2.5">Company</th>
                  <th className="px-3 py-2.5">Talent Relevance</th>
                  <th className="px-3 py-2.5">Estimated Pool</th>
                  <th className="px-3 py-2.5">Footprint</th>
                  <th className="px-3 py-2.5">Why Target</th>
                  <th className="px-3 py-2.5 rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {targetList.map((target, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 cursor-pointer" onClick={() => handleOpenDossier(target)}>
                    <td className="px-3 py-2.5 font-bold">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] border ${getTierColor(target.priority)}`}>
                        {target.priority}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-bold text-white">
                      {target.company}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-semibold text-cyan-300">
                        {target.talentRelevance}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-300 font-mono">
                      {target.estimatedTargetTalentPool}
                    </td>
                    <td className="px-3 py-2.5 text-slate-400">
                      {target.primaryLocations}
                    </td>
                    <td className="px-3 py-2.5 text-slate-300">
                      {target.whyTarget}
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDossier(target);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs transition-all"
                        title="Open Poaching Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Dossier Modal */}
      {report && (
        <CompanyDossierModal
          company={selectedCompany}
          report={report}
          isOpen={isDossierOpen}
          onClose={() => {
            setIsDossierOpen(false);
            setSelectedCompany(null);
          }}
        />
      )}
    </div>
  );
};
