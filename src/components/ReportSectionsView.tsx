import React, { useState } from 'react';
import { TalentMapReport } from '../types';
import { ScoreGauge } from './ScoreGauge';
import { SupplyFunnelChart } from './SupplyFunnelChart';
import { SkillAdjacencyGraph } from './SkillAdjacencyGraph';
import { TalentMovementFlow } from './TalentMovementFlow';
import { CompanyTable } from './CompanyTable';
import { CandidateArchetypeCard } from './CandidateArchetypeCard';
import { SourcingSearchStation } from './SourcingSearchStation';
import { CompensationChart } from './CompensationChart';
import { RecommendationsChecklist } from './RecommendationsChecklist';
import { ConfidenceBadge } from './ConfidenceBadge';
import {
  Layers,
  MapPin,
  Users,
  Compass,
  Building2,
  Shuffle,
  ShieldBan,
  UserCheck,
  Search,
  HeartHandshake,
  DollarSign,
  AlertOctagon,
  CheckCircle2,
  Flame,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Cpu,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface ReportSectionsViewProps {
  report: TalentMapReport;
}

export const ReportSectionsView: React.FC<ReportSectionsViewProps> = ({ report }) => {
  // Navigation categories grouping the 23 parts cleanly
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openSectionId, setOpenSectionId] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All 23 Sections' },
    { id: 'role', label: '1-4: Role & Geo' },
    { id: 'supply', label: '5-8: Supply & Skills' },
    { id: 'market', label: '9-12: Employers & Flow' },
    { id: 'sourcing', label: '13-15: Archetypes & Search' },
    { id: 'comp', label: '16-18: Comp & Risk' },
    { id: 'exec', label: '19-23: Strategy & Brief' },
  ];

  const toggleSection = (id: number) => {
    setOpenSectionId((prev) => (prev === id ? null : id));
  };

  return (
    <div id="report-sections-view-root" className="space-y-6">
      {/* Quick Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest shrink-0 mr-1 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`filter-cat-${cat.id}`}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'accent-gradient text-white glow'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 23 SECTION MODULES */}
      <div className="space-y-6">
        {/* ========================================================
            PART 1: Role Decomposition & Architecture
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'role') && (
          <section id="section-01-role-decomposition" className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                  SECTION 01
                </span>
                <h3 className="text-base font-bold text-white">
                  Role Decomposition & Requirement Taxonomy
                </h3>
              </div>
              <ConfidenceBadge level={report.roleDecomposition.roleTitle.confidence} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[11px] text-slate-400 font-mono font-semibold uppercase">Standardized Title</span>
                <div className="text-sm font-bold text-white">
                  {report.roleDecomposition.roleTitle.standardizedTitle}
                </div>
                <div className="text-xs text-slate-400">
                  Track: {report.roleDecomposition.roleTitle.jobFamily} ({report.roleDecomposition.roleTitle.managementTrack})
                </div>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[11px] text-slate-400 font-mono font-semibold uppercase">Seniority & Level</span>
                <div className="text-sm font-bold text-white">
                  {report.roleDecomposition.seniorityLevel.level} (Equiv: {report.roleDecomposition.seniorityLevel.equivalentCorporateLevel})
                </div>
                <div className="text-xs text-slate-400">
                  Range: {report.roleDecomposition.seniorityLevel.yearsExperienceMin} - {report.roleDecomposition.seniorityLevel.yearsExperienceMax} YOE
                </div>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[11px] text-slate-400 font-mono font-semibold uppercase">Work Arrangement</span>
                <div className="text-sm font-bold text-white">
                  {report.roleDecomposition.workModel.model} ({report.roleDecomposition.workModel.daysOnSitePerWeek} days/wk)
                </div>
                <div className="text-xs text-slate-400">
                  Market Resistance: {report.roleDecomposition.workModel.marketAcceptanceScore}% Acceptance
                </div>
              </div>
            </div>

            {/* Equivalent Industry Titles */}
            <div>
              <span className="text-xs font-mono font-semibold text-slate-400">Equivalent Market Titles: </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {report.roleDecomposition.roleTitle.equivalentTitles.map((title, i) => (
                  <span key={i} className="px-3 py-1 text-xs rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200">
                    {title}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            PART 2: Core Competencies & Skills Architecture
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'role') && (
          <section id="section-02-core-competencies" className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                  SECTION 02
                </span>
                <h3 className="text-base font-bold text-white">
                  Core Competencies & Skills Architecture
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Scarcity & Weight Matrix</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Technical Skills Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Technical Competencies & Scarcity Ratings
                </h4>
                <div className="space-y-2">
                  {report.skillsAnalysis.technicalSkills.map((sk, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{sk.name}</span>
                        <div className="text-[11px] text-slate-400">
                          {sk.importance} • Weight: {sk.weight}
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                        sk.scarcityRating === 'Critical Scarcity' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                        sk.scarcityRating === 'High Scarcity' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                        'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {sk.scarcityRating}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scarce Skills Analysis */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Critical Scarce Skills & Premium Impact
                </h4>
                <div className="space-y-2">
                  {report.skillsAnalysis.scarceSkills.map((sc, idx) => (
                    <div key={idx} className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-rose-200">{sc.name}</span>
                        <span className="text-[11px] font-mono font-bold text-rose-400">
                          +{sc.marketPremiumPercentage}% Salary Premium
                        </span>
                      </div>
                      <p className="text-xs text-rose-200/80 leading-snug">
                        {sc.bottleneckReason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            PART 3 & 4: Geographic Density & Relocation Feasibility
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'role') && (
          <section id="section-03-geographic-market" className="glass-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                  SECTION 03 & 04
                </span>
                <h3 className="text-base font-bold text-white">
                  Geographic Talent Density & Relocation Feasibility
                </h3>
              </div>
              <ConfidenceBadge level={report.geographicMarket.confidence} source={report.geographicMarket.dataSource} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 font-mono uppercase">Target Metro</div>
                <div className="text-lg font-bold text-white mt-1">
                  {report.geographicMarket.metroName}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Radius: {report.geographicMarket.radiusMiles} Miles • Density: {report.geographicMarket.concentrationDensity}
                </p>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 font-mono uppercase">Cost-of-Labor Differential</div>
                <div className="text-lg font-bold text-cyan-400 mt-1">
                  {report.geographicMarket.costOfLaborIndex > 100 ? `+${report.geographicMarket.costOfLaborIndex - 100}%` : `${report.geographicMarket.costOfLaborIndex - 100}%`} vs National
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  National Median Baseline = 100.0 Index
                </p>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 font-mono uppercase">Relocation Attractiveness</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">
                  {report.relocationFeasibility.attractivenessScore}/100 Score
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Package: ${report.relocationFeasibility.typicalReloPackageUSD.toLocaleString()} average
                </p>
              </div>
            </div>

            {/* Commute Feasibility Summary */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-white">
                Commute Feasibility & Expansion Recommendations:
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {report.relocationFeasibility.commuteCorridorAnalysis}
              </p>
              <div className="text-xs font-semibold text-cyan-400">
                Strategic Recommendation: {report.relocationFeasibility.relocationRecommendation}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            PART 5 & 6: Talent Supply Analysis & Availability Score
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'supply') && (
          <section id="section-05-06-talent-supply" className="glass-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                  SECTION 05 & 06
                </span>
                <h3 className="text-base font-bold text-white">
                  Talent Supply Funnel & Availability Scoring
                </h3>
              </div>
              <ConfidenceBadge level={report.talentAvailabilityScore.confidence} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SupplyFunnelChart supply={report.talentSupply} />
              </div>
              <div>
                <ScoreGauge
                  score={report.talentAvailabilityScore.score}
                  title="Talent Availability Score"
                  type="availability"
                  band={report.talentAvailabilityScore.band}
                  subtitle={report.talentAvailabilityScore.summary}
                />
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            PART 7: Sourcing Channel Effectiveness
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'supply') && (
          <section id="section-07-sourcing-channels" className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                  SECTION 07
                </span>
                <h3 className="text-base font-bold text-white">
                  Sourcing Channel Effectiveness & ROI
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Ranked by Yield</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {report.sourcingChannels.map((chan, idx) => (
                <div key={idx} className="glass-card-interactive rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-white">{chan.channel}</h5>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {chan.expectedYield} Yield
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Response Rate: <strong className="text-cyan-300 font-mono">{chan.responseRate}%</strong></span>
                    <span>Cost / Effort: <strong className="text-slate-200">{chan.costEffort}</strong></span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">
                    {chan.recommendedApproach}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            PART 8: Skill Adjacency Map
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'supply') && (
          <section id="section-08-skill-adjacency" className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                  SECTION 08
                </span>
                <h3 className="text-base font-bold text-white">
                  Skill Adjacency & Profile Transferability Map
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">3-Tier Hierarchy</span>
            </div>

            <SkillAdjacencyGraph data={report.skillAdjacencyMap} />
          </section>
        )}

        {/* ========================================================
            PART 9 & 11: Competitive Employer Landscape & Target Companies
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'market') && (
          <section id="section-09-11-company-landscape" className="glass-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                  SECTION 09 & 11
                </span>
                <h3 className="text-base font-bold text-white">
                  Competitive Employer Landscape & Target Company Matrix
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Tiers 1-4 Analysis</span>
            </div>

            <CompanyTable
              landscape={report.competitiveEmployerLandscape}
              targetList={report.targetCompanies}
              report={report}
            />
          </section>
        )}

        {/* ========================================================
            PART 10: Talent Movement Analysis
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'market') && (
          <section id="section-10-talent-movement" className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                  SECTION 10
                </span>
                <h3 className="text-base font-bold text-white">
                  Talent Movement & Cross-Company Migration Flows
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Exporters vs Importers</span>
            </div>

            <TalentMovementFlow data={report.talentMovement} />
          </section>
        )}

        {/* ========================================================
            PART 12: Off-Limits & Excluded Organizations
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'market') && (
          <section id="section-12-off-limits" className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold text-xs">
                  SECTION 12
                </span>
                <h3 className="text-base font-bold text-white">
                  Off-Limits & Excluded Organizations Policy
                </h3>
              </div>
              <ShieldBan className="w-4 h-4 text-rose-400" />
            </div>

            <div className="space-y-2.5">
              {report.offLimitsOrganizations.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-rose-200">{item.company}</span>
                    <div className="text-[11px] text-rose-300 mt-0.5">
                      Reason: {item.reason} • Category: {item.category}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold text-[10px]">
                    STRICT NO-CONTACT
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            PART 13: Candidate Archetype Map
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'sourcing') && (
          <section id="section-13-candidate-archetypes" className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                  SECTION 13
                </span>
                <h3 className="text-base font-bold text-white">
                  Candidate Archetypes & High-Conversion Outreach Snippets
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">4 Core Profiles</span>
            </div>

            <CandidateArchetypeCard archetypes={report.candidateArchetypes} />
          </section>
        )}

        {/* ========================================================
            PART 14: Candidate Search Strategy (Boolean / X-Ray / GitHub)
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'sourcing') && (
          <section id="section-14-search-strategy" className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                  SECTION 14
                </span>
                <h3 className="text-base font-bold text-white">
                  Candidate Sourcing War Room (Boolean, X-Ray, GitHub, Communities)
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">1-Click Copy Strings</span>
            </div>

            <SourcingSearchStation data={report.candidateSearchStrategy} />
          </section>
        )}

        {/* ========================================================
            PART 15: DEI Talent Intelligence & Representation
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'sourcing') && (
          <section id="section-15-dei-intelligence" className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                  SECTION 15
                </span>
                <h3 className="text-base font-bold text-white">
                  Diversity, Equity & Inclusion (DEI) Sourcing Channels
                </h3>
              </div>
              <ConfidenceBadge level={report.deiIntelligence.confidence} />
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
              <div className="text-xs text-slate-300 leading-relaxed">
                {report.deiIntelligence.representationOverview}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {report.deiIntelligence.diverseTalentPools.map((pool, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                    <div className="font-bold text-white mb-1">{pool.community}</div>
                    <div className="text-cyan-400 font-medium mb-1">Channel: {pool.channel}</div>
                    <p className="text-slate-400 leading-snug">{pool.sourcingApproach}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            PART 16: Compensation Intelligence
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'comp') && (
          <section id="section-16-compensation" className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                  SECTION 16
                </span>
                <h3 className="text-base font-bold text-white">
                  Compensation Intelligence & Market Percentiles
                </h3>
              </div>
              <ConfidenceBadge level={report.compensationIntelligence.confidence} />
            </div>

            <CompensationChart data={report.compensationIntelligence} />
          </section>
        )}

        {/* ========================================================
            PART 17: Recruiting Difficulty Score & Time to Fill
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'comp') && (
          <section id="section-17-recruiting-difficulty" className="glass-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                  SECTION 17
                </span>
                <h3 className="text-base font-bold text-white">
                  Recruiting Difficulty Score & Pipeline Velocity
                </h3>
              </div>
              <ConfidenceBadge level={report.recruitingDifficultyScore.confidence} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <ScoreGauge
                  score={report.recruitingDifficultyScore.score}
                  title="Recruiting Difficulty Score"
                  type="difficulty"
                  band={report.recruitingDifficultyScore.band}
                  subtitle={`Expected Time-to-Fill: ${report.recruitingDifficultyScore.expectedTimeToFillDays} Days`}
                />
              </div>

              <div className="lg:col-span-2 space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Primary Difficulty Multipliers & Bottlenecks
                </h4>
                <div className="space-y-2">
                  {report.recruitingDifficultyScore.primaryDifficultyDrivers.map((driver, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{driver.driver}</span>
                      <span className="text-rose-400 font-mono font-bold">
                        +{driver.weightContribution} pts impact
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            PART 18: Recruiting Risks & Market Constraints
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'comp') && (
          <section id="section-18-risks" className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold text-xs">
                  SECTION 18
                </span>
                <h3 className="text-base font-bold text-white">
                  Recruiting Risks & Market Constraints Audit
                </h3>
              </div>
              <AlertOctagon className="w-4 h-4 text-rose-400" />
            </div>

            <div className="space-y-3">
              {report.risksAndConstraints.map((risk, idx) => (
                <div key={idx} className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold border ${
                      risk.severity === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                      risk.severity === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                      'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    }`}>
                      {risk.severity} Severity Risk
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Category: {risk.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{risk.risk}</h4>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-200">
                    <strong className="text-emerald-300">Mitigation Plan: </strong> {risk.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            PART 19: Recruiting Recommendations
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'exec') && (
          <section id="section-19-recommendations" className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                  SECTION 19
                </span>
                <h3 className="text-base font-bold text-white">
                  Strategic Recruiting Recommendations & Action Checklist
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Target Stakeholder Ownership</span>
            </div>

            <RecommendationsChecklist recommendations={report.recruitingRecommendations} />
          </section>
        )}

        {/* ========================================================
            PART 20: Executive Talent Market Summary
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'exec') && (
          <section id="section-20-executive-summary" className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                  SECTION 20
                </span>
                <h3 className="text-base font-bold text-white">
                  Executive Talent Market Summary
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Strategic Synthesis</span>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed space-y-2">
              <p>{report.executiveSummary.executiveBriefNarrative}</p>
            </div>
          </section>
        )}

        {/* ========================================================
            PART 21: Talent Heat Map Matrix
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'exec') && (
          <section id="section-21-talent-heatmap" className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                  SECTION 21
                </span>
                <h3 className="text-base font-bold text-white">
                  Talent Heat Map Matrix (Skill x Geography Scarcity)
                </h3>
              </div>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="p-3">Skill / Specialization</th>
                    <th className="p-3">Target Metro ({report.geographicMarket.metroName})</th>
                    <th className="p-3">San Francisco Bay Area</th>
                    <th className="p-3">Seattle, WA</th>
                    <th className="p-3">New York, NY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {report.skillsAnalysis.technicalSkills.slice(0, 5).map((sk, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white">{sk.name}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {sk.scarcityRating === 'Critical Scarcity' ? 'High Friction' : 'Moderate'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">High Density (High Comp)</td>
                      <td className="p-3 text-slate-400">Moderate Density</td>
                      <td className="p-3 text-slate-400">Emerging Pool</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========================================================
            PART 22: Executive Recruiting Brief
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'exec') && (
          <section id="section-22-executive-brief" className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs">
                  SECTION 22
                </span>
                <h3 className="text-base font-bold text-white">
                  Executive Recruiting Brief (C-Suite / HM Takeaway)
                </h3>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-3">
              <div className="text-xs text-emerald-100 font-medium leading-relaxed">
                {report.executiveRecruitingBrief.closingStrategy}
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-200/90 list-disc list-inside">
                {report.executiveRecruitingBrief.keyTakeaways.map((takeaway, i) => (
                  <li key={i}>{takeaway}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ========================================================
            PART 23: Data Confidence & Statutory Disclosure
        ======================================================== */}
        {(activeCategory === 'all' || activeCategory === 'exec') && (
          <section id="section-23-data-confidence" className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono font-bold text-xs">
                  SECTION 23
                </span>
                <h3 className="text-base font-bold text-white">
                  Data Confidence Scoring & Non-Fabrication Disclosure
                </h3>
              </div>
              <ConfidenceBadge level={report.dataConfidenceSummary.overallQualityGrade === 'A (High Confidence)' ? 'verified' : 'inferred'} />
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>Overall Quality Grade:</span>
                <strong className="text-white font-mono">{report.dataConfidenceSummary.overallQualityGrade}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Verified Field Ratio:</span>
                <strong className="text-emerald-400 font-mono">{report.dataConfidenceSummary.verifiedFieldsCount} Verified / {report.dataConfidenceSummary.unknownFieldsCount} Gaps</strong>
              </div>
              <p className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                {report.dataConfidenceSummary.statutoryAssurance}
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
