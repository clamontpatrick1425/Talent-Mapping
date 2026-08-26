import React, { useState, useMemo } from 'react';
import { CandidateSearchStrategyData } from '../types';
import {
  Search,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Globe,
  Github,
  Users,
  Sparkles,
  Sliders,
  Terminal,
  ShieldBan,
  Building2,
  FileCode,
  Layers,
  Zap,
} from 'lucide-react';

interface SourcingSearchStationProps {
  data?: CandidateSearchStrategyData;
}

export const SourcingSearchStation: React.FC<SourcingSearchStationProps> = ({ data }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const linkedinBoolean = data?.linkedinBoolean || (data as any)?.sourcingStrings?.linkedinBoolean || [
    {
      name: 'Target Role & Key Tech Stack',
      query: '("Staff Software Engineer" OR "Staff Systems Engineer") AND ("Distributed Systems" OR "Low Latency" OR "C++" OR "Go" OR "Rust")',
      purpose: 'Core direct keyword matching across profile headlines and experience.'
    },
    {
      name: 'Adjacent Domain (FinTech & Autonomous Systems)',
      query: '("Quantitative Developer" OR "Trading Systems Engineer" OR "Robotics Systems Engineer") AND ("C++" OR "CUDA" OR "Kernel")',
      purpose: 'Uncovering high-performing adjacent candidates in non-AI sectors.'
    }
  ];

  const googleXray = data?.googleXray || (data as any)?.sourcingStrings?.googleXray || [
    {
      name: 'LinkedIn Public Profiles (Austin / SF / Remote)',
      query: 'site:linkedin.com/in/ ("Staff Software Engineer" OR "Staff Systems") ("Distributed Systems" OR "Low Latency") ("Austin" OR "San Francisco" OR "Remote")',
      platform: 'LinkedIn Public'
    },
    {
      name: 'GitHub / GitLab Public Developer Profiles',
      query: 'site:github.com ("Staff Engineer" OR "Infrastructure Architect") ("Distributed Systems" OR "CUDA")',
      platform: 'GitHub'
    }
  ];

  const githubSearch = data?.githubSearch || (data as any)?.sourcingStrings?.githubSearch || [
    {
      name: 'Core Contributors & Systems Authors',
      query: 'location:"San Francisco" distributed systems language:rust stars:>10',
      purpose: 'Open-source contributors with proven systems repository commits.'
    },
    {
      name: 'Low-Latency C++ / CUDA Kernel Authors',
      query: 'cuda kernel latency optimization language:cpp followers:>5',
      purpose: 'Specialists authoring high-performance GPU and HPC code.'
    }
  ];

  const professionalCommunities = data?.professionalCommunities || (data as any)?.sourcingStrings?.professionalCommunities || [
    {
      name: 'USENIX ATC / OSDI / SOSP Community',
      category: 'Conference',
      relevance: 'Premier academic and industrial systems engineering symposium.'
    },
    {
      name: 'Linux Foundation / CNCF Working Groups',
      category: 'Community',
      relevance: 'Working group leads for Kubernetes, Envoy, and high-throughput networking.'
    }
  ];

  // Live Boolean Workbench State
  const [workbenchPlatform, setWorkbenchPlatform] = useState<
    'linkedin' | 'xray_linkedin' | 'github' | 'stackoverflow' | 'patents' | 'resume_pdf'
  >('linkedin');
  const [roleTitleQuery, setRoleTitleQuery] = useState<string>('Distributed Systems OR Infrastructure OR Cloud Platform');
  const [seniorityLevel, setSeniorityLevel] = useState<string>('Senior OR Staff OR Principal OR Lead');
  const [mustHaveSkills, setMustHaveSkills] = useState<string>('Go OR Rust OR C++ OR Distributed Systems');
  const [secondarySkills, setSecondarySkills] = useState<string>('Kubernetes OR Kafka OR gRPC OR Raft');
  const [targetLocation, setTargetLocation] = useState<string>('San Francisco OR New York OR Austin OR Seattle OR Remote');
  const [excludeContractors, setExcludeContractors] = useState<boolean>(true);
  const [excludeRecruiters, setExcludeRecruiters] = useState<boolean>(true);
  const [targetCompaniesFilter, setTargetCompaniesFilter] = useState<string>('Stripe OR Datadog OR Uber OR Snowflake OR Airbnb');
  const [enableCompanyFilter, setEnableCompanyFilter] = useState<boolean>(false);

  // Compute live synthesized Boolean string based on controls
  const generatedBoolean = useMemo(() => {
    const parts: string[] = [];

    // Title & Seniority clause
    if (roleTitleQuery.trim()) {
      if (seniorityLevel.trim()) {
        parts.push(`("${seniorityLevel.trim().split(' OR ').join('" OR "')}") AND ("${roleTitleQuery.trim().split(' OR ').join('" OR "')}")`);
      } else {
        parts.push(`("${roleTitleQuery.trim().split(' OR ').join('" OR "')}")`);
      }
    }

    // Required Skills
    if (mustHaveSkills.trim()) {
      parts.push(`(${mustHaveSkills.trim().split(' OR ').map((s) => `"${s.trim()}"`).join(' OR ')})`);
    }

    // Secondary Skills
    if (secondarySkills.trim()) {
      parts.push(`(${secondarySkills.trim().split(' OR ').map((s) => `"${s.trim()}"`).join(' OR ')})`);
    }

    // Target Companies
    if (enableCompanyFilter && targetCompaniesFilter.trim()) {
      parts.push(`(${targetCompaniesFilter.trim().split(' OR ').map((c) => `"${c.trim()}"`).join(' OR ')})`);
    }

    // Location (for platforms where location is in text search)
    if (workbenchPlatform !== 'github' && targetLocation.trim()) {
      parts.push(`(${targetLocation.trim().split(' OR ').map((l) => `"${l.trim()}"`).join(' OR ')})`);
    }

    // Negative exclusions
    const exclusions: string[] = [];
    if (excludeContractors) {
      exclusions.push('"contractor"', '"consultant"', '"freelance"', '"staffing"', '"temp"');
    }
    if (excludeRecruiters) {
      exclusions.push('"recruiter"', '"talent acquisition"', '"headhunter"', '"intern"');
    }
    if (exclusions.length > 0) {
      parts.push(`NOT (${exclusions.join(' OR ')})`);
    }

    const baseQuery = parts.join(' AND ');

    switch (workbenchPlatform) {
      case 'xray_linkedin':
        return `site:linkedin.com/in/ ${baseQuery}`;
      case 'github':
        return `location:"${targetLocation.split(' OR ')[0] || 'San Francisco'}" ${mustHaveSkills.split(' OR ')[0] || 'Go'} ${roleTitleQuery.split(' OR ')[0] || 'engineer'}`;
      case 'stackoverflow':
        return `site:stackoverflow.com/users (${mustHaveSkills.split(' OR ').join(' OR ')}) ("${targetLocation.split(' OR ')[0] || 'United States'}")`;
      case 'patents':
        return `site:patents.google.com ("inventor") AND (${mustHaveSkills.split(' OR ').join(' OR ')}) AND ("${roleTitleQuery.split(' OR ')[0] || 'distributed systems'}")`;
      case 'resume_pdf':
        return `(filetype:pdf OR filetype:docx) "resume" OR "curriculum vitae" ${baseQuery}`;
      case 'linkedin':
      default:
        return baseQuery;
    }
  }, [
    workbenchPlatform,
    roleTitleQuery,
    seniorityLevel,
    mustHaveSkills,
    secondarySkills,
    targetLocation,
    excludeContractors,
    excludeRecruiters,
    targetCompaniesFilter,
    enableCompanyFilter,
  ]);

  const liveSearchUrl = useMemo(() => {
    if (workbenchPlatform === 'github') {
      return `https://github.com/search?q=${encodeURIComponent(generatedBoolean)}&type=users`;
    }
    return `https://www.google.com/search?q=${encodeURIComponent(generatedBoolean)}`;
  }, [workbenchPlatform, generatedBoolean]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div id="sourcing-search-station-root" className="space-y-6">
      {/* 1. Interactive Boolean & X-Ray Sourcing Workbench */}
      <div className="glass-card rounded-2xl p-6 space-y-5 border border-cyan-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Interactive Sourcing Station
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Live Generator
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Boolean Query & Cross-Platform Sourcing Workbench
              </h3>
            </div>
          </div>

          {/* Platform Selector */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setWorkbenchPlatform('linkedin')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                workbenchPlatform === 'linkedin'
                  ? 'accent-gradient text-white glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              LinkedIn ATS
            </button>
            <button
              onClick={() => setWorkbenchPlatform('xray_linkedin')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                workbenchPlatform === 'xray_linkedin'
                  ? 'accent-gradient text-white glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Google X-Ray
            </button>
            <button
              onClick={() => setWorkbenchPlatform('github')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                workbenchPlatform === 'github'
                  ? 'accent-gradient text-white glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              GitHub Code
            </button>
            <button
              onClick={() => setWorkbenchPlatform('resume_pdf')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                workbenchPlatform === 'resume_pdf'
                  ? 'accent-gradient text-white glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PDF Resume
            </button>
          </div>
        </div>

        {/* Workbench Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold font-mono text-[11px] uppercase flex items-center justify-between">
              <span>Target Role Titles</span>
              <span className="text-slate-500 font-normal">OR separated</span>
            </label>
            <input
              type="text"
              value={roleTitleQuery}
              onChange={(e) => setRoleTitleQuery(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs focus:border-cyan-500 focus:outline-none"
              placeholder="e.g. Distributed Systems OR Infrastructure"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold font-mono text-[11px] uppercase flex items-center justify-between">
              <span>Seniority Modifiers</span>
              <span className="text-slate-500 font-normal">Level tags</span>
            </label>
            <input
              type="text"
              value={seniorityLevel}
              onChange={(e) => setSeniorityLevel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs focus:border-cyan-500 focus:outline-none"
              placeholder="e.g. Senior OR Staff OR Principal"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold font-mono text-[11px] uppercase flex items-center justify-between">
              <span>Must-Have Skills</span>
              <span className="text-cyan-400 font-normal">Required</span>
            </label>
            <input
              type="text"
              value={mustHaveSkills}
              onChange={(e) => setMustHaveSkills(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs focus:border-cyan-500 focus:outline-none"
              placeholder="e.g. Go OR Rust OR Distributed Systems"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold font-mono text-[11px] uppercase flex items-center justify-between">
              <span>Secondary / Ecosystem Skills</span>
              <span className="text-slate-500 font-normal">Preferred</span>
            </label>
            <input
              type="text"
              value={secondarySkills}
              onChange={(e) => setSecondarySkills(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs focus:border-cyan-500 focus:outline-none"
              placeholder="e.g. Kubernetes OR Kafka OR gRPC"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold font-mono text-[11px] uppercase flex items-center justify-between">
              <span>Target Locations / Metros</span>
              <span className="text-slate-500 font-normal">Geo pool</span>
            </label>
            <input
              type="text"
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs focus:border-cyan-500 focus:outline-none"
              placeholder="e.g. San Francisco OR Austin OR Remote"
            />
          </div>

          <div className="space-y-2 flex flex-col justify-end">
            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={excludeContractors}
                  onChange={(e) => setExcludeContractors(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Exclude Contractors</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={excludeRecruiters}
                  onChange={(e) => setExcludeRecruiters(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Exclude Recruiters</span>
              </label>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
              <input
                type="checkbox"
                checked={enableCompanyFilter}
                onChange={(e) => setEnableCompanyFilter(e.target.checked)}
                className="rounded border-slate-700 text-indigo-500 focus:ring-0"
              />
              <span className="text-indigo-300">Filter by Target Poaching Companies</span>
            </label>
          </div>
        </div>

        {/* Live Generated Output Box */}
        <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 glow-dot-cyan"></span>
              <span className="text-xs font-mono font-bold text-slate-300">
                Generated Boolean Syntax ({generatedBoolean.length} characters)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={liveSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold transition-all border border-slate-700/80 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Launch Live Search</span>
              </a>

              <button
                id="btn-copy-workbench-boolean"
                onClick={() => handleCopy('workbench', generatedBoolean)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 rounded-lg text-xs font-semibold transition-all cursor-pointer glow-subtle"
              >
                {copiedKey === 'workbench' ? (
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
          </div>

          <div className="p-3 bg-slate-900/90 text-cyan-200 border border-slate-800/80 font-mono text-xs rounded-lg overflow-x-auto select-all leading-relaxed max-h-32">
            {generatedBoolean}
          </div>
        </div>
      </div>

      {/* 2. Pre-Engineered LinkedIn Recruiter Boolean Strings */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>Pre-Engineered LinkedIn Recruiter & ATS Search Strings</span>
        </div>

        <div className="space-y-3">
          {linkedinBoolean.map((b, i) => {
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

      {/* 3. Google X-Ray Search Queries */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>Google X-Ray Sourcing Queries (Bypass Recruiter Paywalls)</span>
        </div>

        <div className="space-y-3">
          {googleXray.map((x, i) => {
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

      {/* 4. GitHub Advanced Code & Contributor Search */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Github className="w-4 h-4 text-indigo-400" />
          <span>GitHub Code & Contributor Sourcing</span>
        </div>

        <div className="space-y-3">
          {githubSearch.map((g, i) => {
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

      {/* 5. Professional Communities, Conferences, Associations */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Professional Communities, Conferences & Talent Ecosystems</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {professionalCommunities.map((c, i) => (
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
