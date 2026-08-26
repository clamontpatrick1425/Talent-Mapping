import React, { useState } from 'react';
import { EmployerLandscapeItem, TargetCompanyEntry, TalentMapReport } from '../types';
import {
  X,
  Building2,
  Flame,
  Search,
  Copy,
  Check,
  ExternalLink,
  Target,
  Users,
  ShieldAlert,
  Zap,
  MapPin,
  Briefcase,
  Layers,
} from 'lucide-react';

interface CompanyDossierModalProps {
  company: EmployerLandscapeItem | TargetCompanyEntry | null;
  report: TalentMapReport;
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyDossierModal: React.FC<CompanyDossierModalProps> = ({
  company,
  report,
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen || !company) return null;

  const isLandscape = 'poachingAngle' in company;
  const companyName = company.name || (company as any).company || 'Target Company';
  const roleName = report.input.role.value;
  const primarySkills = report.input.skills.required.value.slice(0, 4);

  // Generate customized LinkedIn and Google X-ray queries for this company
  const linkedinQuery = `("${companyName}") AND ("${roleName}" OR "Senior Engineer" OR "Staff Engineer") AND (${primarySkills.map(s => `"${s}"`).join(' OR ')})`;
  const googleXray = `site:linkedin.com/in/ ("${companyName}" OR "ex-${companyName}") AND ("${roleName}" OR "Software Engineer") AND ("${report.input.geography.location}")`;
  const githubQuery = `location:"${report.input.geography.location}" "${companyName}" ${primarySkills[0] || 'Go'}`;

  // Custom poaching pitch hook tailored to this company
  const poachingPitch = isLandscape
    ? (company as EmployerLandscapeItem).poachingAngle
    : `Leverage organizational friction and growth plateaus at ${companyName}. Position our role with higher architectural autonomy, direct executive visibility, and aggressive equity refreshers.`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const openSearch = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="company-dossier-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="company-dossier-modal-content"
        className="glass-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Target Company Intelligence Dossier
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {(company as any).tier || (company as any).priority || 'Priority Target'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-0.5">{companyName}</h2>
            </div>
          </div>

          <button
            id="btn-close-company-dossier"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Key Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase">Talent Relevance</span>
            <span className="text-cyan-300 font-bold text-sm mt-0.5 block">
              {(company as any).tierLabel || (company as any).talentRelevance || 'Direct Competitor'}
            </span>
          </div>
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase">Hiring / Poachability</span>
            <span className="text-emerald-300 font-bold text-sm mt-0.5 block">
              {(company as any).hiringActivity || 'High Receptivity'}
            </span>
          </div>
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase">Footprint</span>
            <span className="text-white font-bold text-sm mt-0.5 block truncate">
              {(company as any).geographicPresence || (company as any).primaryLocations || report.input.geography.location}
            </span>
          </div>
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase">Difficulty Index</span>
            <span className="text-amber-300 font-bold text-sm mt-0.5 block">
              {(company as any).recruitingDifficulty || 'Moderate Friction'}
            </span>
          </div>
        </div>

        {/* Poaching Vulnerability & Value Prop */}
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold text-xs">
            <Flame className="w-4 h-4 text-cyan-400" />
            <span>Target Vulnerability & Poaching Angle:</span>
          </div>
          <p className="text-xs text-cyan-100 leading-relaxed">
            {poachingPitch}
          </p>
        </div>

        {/* Target Teams & Disciplines */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target Teams & Internal Disciplines at {companyName}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
              <span className="text-indigo-300 font-bold font-mono text-[11px] block">High Priority Groups</span>
              <p className="text-slate-300 text-xs">
                Core Systems, Infrastructure & Distributed Data, Cloud Platforms, ML Infrastructure.
              </p>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
              <span className="text-cyan-300 font-bold font-mono text-[11px] block">Target Job Titles</span>
              <p className="text-slate-300 text-xs">
                {isLandscape && (company as EmployerLandscapeItem).relevantTitles?.length
                  ? (company as EmployerLandscapeItem).relevantTitles.join(', ')
                  : `${roleName}, Staff Software Engineer, Senior Systems Architect`}
              </p>
            </div>
          </div>
        </div>

        {/* Company-Specific Sourcing Boolean Generator */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>One-Click Boolean Sourcing Queries for {companyName}</span>
          </h4>

          {/* LinkedIn Query */}
          <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-cyan-300 font-bold">
                LinkedIn Recruiter Query ({companyName})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(linkedinQuery, 'li')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono font-bold transition-all cursor-pointer"
                >
                  {copiedKey === 'li' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'li' ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => openSearch(`https://www.google.com/search?q=${encodeURIComponent(googleXray)}`)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-mono font-bold transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Search X-Ray</span>
                </button>
              </div>
            </div>
            <pre className="text-xs font-mono text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 whitespace-pre-wrap break-all">
              {linkedinQuery}
            </pre>
          </div>

          {/* Google X-Ray Query */}
          <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-indigo-300 font-bold">
                Google X-Ray Query (Profiles at {companyName})
              </span>
              <button
                onClick={() => copyToClipboard(googleXray, 'xray')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono font-bold transition-all cursor-pointer"
              >
                {copiedKey === 'xray' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'xray' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 whitespace-pre-wrap break-all">
              {googleXray}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
