import React, { useState, useMemo } from 'react';
import { TalentMapReport } from '../types';
import {
  DollarSign,
  TrendingUp,
  Scale,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowRight,
  Building2,
  MapPin,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Award,
  ChevronDown,
  Layers,
  FileDown,
  Percent,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';

interface CompensationAnalyzerProps {
  report: TalentMapReport;
}

interface CandidateCompProfile {
  id: string;
  name: string;
  baseSalary: number;
  bonus: number;
  equityAnnual: number;
  signOnBonus: number;
  candidateSeniority: string;
  candidateLocation: string;
  candidateEmployerType: string;
}

export const CompensationAnalyzer: React.FC<CompensationAnalyzerProps> = ({ report }) => {
  const roleTitle = report.input.role.value;
  const p25 = report.compensationIntelligence?.percentiles?.p25 || report.compensationIntelligence?.baseSalary?.p25 || 165000;
  const p50 = report.compensationIntelligence?.percentiles?.p50 || report.compensationIntelligence?.baseSalary?.p50 || 195000;
  const p75 = report.compensationIntelligence?.percentiles?.p75 || report.compensationIntelligence?.baseSalary?.p75 || 235000;
  const p90 = report.compensationIntelligence?.percentiles?.p90 || report.compensationIntelligence?.baseSalary?.p90 || 280000;
  const p10 = Math.round(p25 * 0.85);

  const budgetedMin = report.input.compensationTarget?.min || p25;
  const budgetedMax = report.input.compensationTarget?.max || p75;

  // Active Candidate Input State
  const [candidateName, setCandidateName] = useState<string>('Candidate Profile #1');
  const [baseSalary, setBaseSalary] = useState<number>(Math.round(p50 * 0.95));
  const [bonus, setBonus] = useState<number>(Math.round(p50 * 0.12));
  const [equityAnnual, setEquityAnnual] = useState<number>(Math.round(p50 * 0.25));
  const [signOnBonus, setSignOnBonus] = useState<number>(20000);
  const [candidateSeniority, setCandidateSeniority] = useState<string>(report.input.seniority.value || 'SENIOR');
  const [candidateLocation, setCandidateLocation] = useState<string>(report.input.geography.location || 'San Francisco Bay Area');
  const [candidateEmployerType, setCandidateEmployerType] = useState<string>('Tier-1 Hyperscaler');
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  // Preset quick candidate scenarios
  const [savedCandidates, setSavedCandidates] = useState<CandidateCompProfile[]>([
    {
      id: 'c1',
      name: 'Tier-1 Senior Candidate (Hyperscaler)',
      baseSalary: Math.round(p50 * 0.92),
      bonus: Math.round(p50 * 0.15),
      equityAnnual: Math.round(p50 * 0.38),
      signOnBonus: 25000,
      candidateSeniority: 'SENIOR',
      candidateLocation: report.input.geography.location,
      candidateEmployerType: 'Tier-1 Hyperscaler',
    },
    {
      id: 'c2',
      name: 'Unicorn Tech Lead (Series C)',
      baseSalary: Math.round(p50 * 0.98),
      bonus: Math.round(p50 * 0.1),
      equityAnnual: Math.round(p50 * 0.22),
      signOnBonus: 15000,
      candidateSeniority: 'SENIOR',
      candidateLocation: report.input.geography.location,
      candidateEmployerType: 'High-Growth Unicorn',
    },
    {
      id: 'c3',
      name: 'Value Mover (Remote / Low COL)',
      baseSalary: Math.round(p25 * 0.95),
      bonus: Math.round(p25 * 0.08),
      equityAnnual: Math.round(p25 * 0.15),
      signOnBonus: 0,
      candidateSeniority: 'SENIOR',
      candidateLocation: 'Remote (US Nationwide)',
      candidateEmployerType: 'Mid-Market Enterprise',
    },
  ]);

  // Load a preset candidate
  const handleLoadCandidate = (cand: CandidateCompProfile) => {
    setCandidateName(cand.name);
    setBaseSalary(cand.baseSalary);
    setBonus(cand.bonus);
    setEquityAnnual(cand.equityAnnual);
    setSignOnBonus(cand.signOnBonus);
    setCandidateSeniority(cand.candidateSeniority);
    setCandidateLocation(cand.candidateLocation);
    setCandidateEmployerType(cand.candidateEmployerType);
  };

  // Geographic multipliers
  const geoMultipliers: Record<string, { multiplier: number; taxLabel: string }> = {
    'San Francisco Bay Area': { multiplier: 1.12, taxLabel: 'High CA Tax (13.3%)' },
    'New York City': { multiplier: 1.08, taxLabel: 'High NY Tax (10.9%)' },
    'Seattle Metro': { multiplier: 1.04, taxLabel: '0% State Income Tax' },
    'Austin / Texas Hub': { multiplier: 0.92, taxLabel: '0% State Income Tax' },
    'Remote (US Nationwide)': { multiplier: 1.0, taxLabel: 'Varies by Resident State' },
    'London / Western Europe': { multiplier: 0.72, taxLabel: 'High Tax (~45%)' },
    'Bengaluru / India Hub': { multiplier: 0.42, taxLabel: 'Moderate Tax (30%)' },
  };

  // Calculations
  const currentGeo = geoMultipliers[candidateLocation] || { multiplier: 1.0, taxLabel: 'Standard' };
  
  // Total Target Compensation (TTC) excluding one-time sign-on
  const totalAnnualTarget = baseSalary + bonus + equityAnnual;
  // First year total value including sign-on
  const firstYearTotal = totalAnnualTarget + signOnBonus;

  // Seniority multiplier adjustments for market percentiles
  const seniorityMultiplier = useMemo(() => {
    switch (candidateSeniority) {
      case 'MID':
        return 0.72;
      case 'STAFF':
        return 1.35;
      case 'PRINCIPAL':
        return 1.78;
      case 'DIRECTOR':
        return 2.1;
      case 'SENIOR':
      default:
        return 1.0;
    }
  }, [candidateSeniority]);

  const adjustedP25 = Math.round(p25 * seniorityMultiplier);
  const adjustedP50 = Math.round(p50 * seniorityMultiplier);
  const adjustedP75 = Math.round(p75 * seniorityMultiplier);
  const adjustedP90 = Math.round(p90 * seniorityMultiplier);

  // Exact Percentile Estimation on Market Curve
  const estimatedPercentile = useMemo(() => {
    if (totalAnnualTarget <= p10 * seniorityMultiplier) return 10;
    if (totalAnnualTarget >= adjustedP90 * 1.25) return 99;

    if (totalAnnualTarget < adjustedP25) {
      const ratio = (totalAnnualTarget - p10 * seniorityMultiplier) / (adjustedP25 - p10 * seniorityMultiplier);
      return Math.round(10 + Math.max(0, ratio) * 15);
    }
    if (totalAnnualTarget < adjustedP50) {
      const ratio = (totalAnnualTarget - adjustedP25) / (adjustedP50 - adjustedP25);
      return Math.round(25 + ratio * 25);
    }
    if (totalAnnualTarget < adjustedP75) {
      const ratio = (totalAnnualTarget - adjustedP50) / (adjustedP75 - adjustedP50);
      return Math.round(50 + ratio * 25);
    }
    if (totalAnnualTarget < adjustedP90) {
      const ratio = (totalAnnualTarget - adjustedP75) / (adjustedP90 - adjustedP75);
      return Math.round(75 + ratio * 15);
    }
    const ratio = (totalAnnualTarget - adjustedP90) / (adjustedP90 * 0.25);
    return Math.min(99, Math.round(90 + ratio * 9));
  }, [totalAnnualTarget, adjustedP25, adjustedP50, adjustedP75, adjustedP90, p10, seniorityMultiplier]);

  // Budget Variance
  const varianceVsBudgetMax = totalAnnualTarget - budgetedMax;
  const variancePercentMax = Math.round((varianceVsBudgetMax / budgetedMax) * 100);
  const isOverBudget = varianceVsBudgetMax > 0;

  // Competitiveness Index (0 to 100)
  const competitivenessScore = useMemo(() => {
    let score = 50;
    // Reward being competitive with P50-P75
    if (totalAnnualTarget >= adjustedP75) score += 35;
    else if (totalAnnualTarget >= adjustedP50) score += 20;
    else if (totalAnnualTarget >= adjustedP25) score += 5;
    else score -= 15;

    // Bonus / Signon sweeteners
    if (signOnBonus >= 20000) score += 10;
    if (equityAnnual >= totalAnnualTarget * 0.25) score += 5;

    return Math.min(98, Math.max(15, score));
  }, [totalAnnualTarget, adjustedP75, adjustedP50, adjustedP25, signOnBonus, equityAnnual]);

  // Counter-offer & Flight Risk assessment
  const counterOfferRisk = useMemo(() => {
    if (candidateEmployerType === 'Tier-1 Hyperscaler' || candidateEmployerType === 'AI Frontier Lab') {
      if (totalAnnualTarget < adjustedP75) {
        return {
          level: 'High Risk (78% Counter Probability)',
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          reason: 'Candidate likely holds lucrative unvested RSU stock grant refreshes from current employer.',
        };
      }
      return {
        level: 'Moderate Risk (45% Counter Probability)',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        reason: 'Comp meets top quartile standards, but retention lock-ins remain strong.',
      };
    }
    if (isOverBudget) {
      return {
        level: 'Friction on Budget (Low Counter, High Internal Approval Friction)',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        reason: 'Candidate expectation exceeds internal compensation bands by ' + Math.abs(variancePercentMax) + '%.',
      };
    }
    return {
      level: 'Low Risk (High Closing Probability)',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      reason: 'Offer package aligns tightly with market median and company budgeted parameters.',
    };
  }, [candidateEmployerType, totalAnnualTarget, adjustedP75, isOverBudget, variancePercentMax]);

  // Regional Benchmark Peer Comparison Chart Data
  const peerComparisonData = [
    {
      name: 'Candidate Expectation',
      total: totalAnnualTarget,
      base: baseSalary,
      type: 'candidate',
    },
    {
      name: 'Role Budget Max',
      total: budgetedMax,
      base: Math.round(budgetedMax * 0.75),
      type: 'budget',
    },
    {
      name: 'Local Market Median (P50)',
      total: adjustedP50,
      base: Math.round(adjustedP50 * 0.78),
      type: 'market',
    },
    {
      name: 'Tier-1 Hyperscaler Scale',
      total: Math.round(adjustedP50 * 1.58),
      base: Math.round(adjustedP50 * 0.9),
      type: 'industry',
    },
    {
      name: 'AI Frontier Lab Scale',
      total: Math.round(adjustedP50 * 1.8),
      base: Math.round(adjustedP50 * 0.95),
      type: 'industry',
    },
    {
      name: 'High-Growth Unicorn',
      total: Math.round(adjustedP50 * 1.43),
      base: Math.round(adjustedP50 * 0.88),
      type: 'industry',
    },
  ];

  // Recruiter Talking Points & Closing Scripts
  const recruiterNegotiationScript = `Candidate Comp Analysis: ${candidateName}
Role: ${roleTitle} (${candidateSeniority})
Candidate TTC Expectation: $${totalAnnualTarget.toLocaleString()} (Base: $${baseSalary.toLocaleString()} | Bonus: $${bonus.toLocaleString()} | Equity: $${equityAnnual.toLocaleString()} | Sign-On: $${signOnBonus.toLocaleString()})
Market Standing: ${estimatedPercentile}th Percentile in ${candidateLocation}
Role Budget Range: $${budgetedMin.toLocaleString()} - $${budgetedMax.toLocaleString()}
Budget Variance: ${isOverBudget ? `+$${varianceVsBudgetMax.toLocaleString()} (+${variancePercentMax}% over max)` : `-$${Math.abs(varianceVsBudgetMax).toLocaleString()} (Within budget)`}

Recruiter Anchoring Strategy:
1. Base Salary Anchor: "Our base salary band for this ${candidateSeniority} level is calibrated at $${Math.min(baseSalary, budgetedMax * 0.8).toLocaleString()} to preserve equity across engineering peers."
2. Equity & Total Upside: "To bridge the gap to your $${totalAnnualTarget.toLocaleString()} target, we are providing an expanded 4-year equity grant valued at $${(equityAnnual * 4).toLocaleString()} with a 1-year cliff."
3. Cash Sweetener: "To offset any near-term bonuses left on the table at ${candidateEmployerType}, we are including a first-year sign-on bridge of $${signOnBonus.toLocaleString()}."`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(recruiterNegotiationScript);
    setCopiedScript('copied');
    setTimeout(() => setCopiedScript(null), 2500);
  };

  return (
    <div id="compensation-analyzer-section" className="glass-card rounded-2xl p-6 sm:p-8 space-y-8 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>Interactive Candidate Compensation Analyzer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Candidate Salary Expectation & Market Peer Evaluation
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Input specific candidate salary expectations to immediately assess market percentile standing, budget compliance, counter-offer flight risks, and closing tactics.
          </p>
        </div>

        {/* Quick Candidate Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Sample Scenarios:</span>
          {savedCandidates.map((cand) => (
            <button
              key={cand.id}
              onClick={() => handleLoadCandidate(cand)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                candidateName === cand.name
                  ? 'accent-gradient text-white glow font-bold'
                  : 'bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
              }`}
            >
              {cand.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual Grid: Interactive Inputs vs Real-time Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Candidate Expectation Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5 p-5 bg-slate-950/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold uppercase text-cyan-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              <span>Candidate Comp Parameters</span>
            </span>
            <button
              onClick={() => {
                setBaseSalary(Math.round(p50 * 0.95));
                setBonus(Math.round(p50 * 0.12));
                setEquityAnnual(Math.round(p50 * 0.25));
                setSignOnBonus(20000);
              }}
              className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Candidate Name / Seniority / Geo Row */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Candidate Label / Name
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
                placeholder="e.g. Lead Candidate - John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Seniority Level
                </label>
                <select
                  value={candidateSeniority}
                  onChange={(e) => setCandidateSeniority(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono cursor-pointer"
                >
                  <option value="MID">Mid-Level (IC3)</option>
                  <option value="SENIOR">Senior (IC4/IC5)</option>
                  <option value="STAFF">Staff Engineer (IC6)</option>
                  <option value="PRINCIPAL">Principal / Lead (IC7)</option>
                  <option value="DIRECTOR">Director / Head</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Candidate Market / Metro
                </label>
                <select
                  value={candidateLocation}
                  onChange={(e) => setCandidateLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono cursor-pointer"
                >
                  <option value="San Francisco Bay Area">SF Bay Area (1.12x)</option>
                  <option value="New York City">New York City (1.08x)</option>
                  <option value="Seattle Metro">Seattle Metro (1.04x)</option>
                  <option value="Austin / Texas Hub">Austin Hub (0.92x)</option>
                  <option value="Remote (US Nationwide)">Remote US (1.0x)</option>
                  <option value="London / Western Europe">London (0.72x)</option>
                  <option value="Bengaluru / India Hub">Bengaluru (0.42x)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Candidate's Current Employer Type
              </label>
              <select
                value={candidateEmployerType}
                onChange={(e) => setCandidateEmployerType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none font-mono cursor-pointer"
              >
                <option value="Tier-1 Hyperscaler">Tier-1 Hyperscaler / FAANG (Heavy RSU refresh)</option>
                <option value="AI Frontier Lab">AI Frontier Lab (Anthropic, OpenAI, DeepMind)</option>
                <option value="High-Growth Unicorn">High-Growth Unicorn (Series B-D)</option>
                <option value="FinTech & Quant">FinTech / Quantitative Firm (High Cash Bonus)</option>
                <option value="Mid-Market Enterprise">Mid-Market Enterprise / Legacy Tech</option>
                <option value="Early-Stage Startup">Early-Stage Startup (High Equity, Low Cash)</option>
              </select>
            </div>
          </div>

          {/* Detailed Financial Inputs */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            {/* Base Salary */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Base Salary Expectation</span>
                </span>
                <span className="font-mono font-bold text-cyan-300 text-sm">
                  ${baseSalary.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={80000}
                max={450000}
                step={5000}
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex gap-1.5">
                {[140000, 180000, 220000, 260000, 320000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setBaseSalary(val)}
                    className="flex-1 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-white"
                  >
                    ${val / 1000}k
                  </button>
                ))}
              </div>
            </div>

            {/* Annual Equity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Annual Equity / LTI Value</span>
                </span>
                <span className="font-mono font-bold text-indigo-300 text-sm">
                  ${equityAnnual.toLocaleString()} / yr
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={300000}
                step={5000}
                value={equityAnnual}
                onChange={(e) => setEquityAnnual(Number(e.target.value))}
                className="w-full accent-indigo-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>4-Year Total: ${(equityAnnual * 4).toLocaleString()}</span>
                <span>{Math.round((equityAnnual / (totalAnnualTarget || 1)) * 100)}% of TTC</span>
              </div>
            </div>

            {/* Annual Bonus */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Target Annual Cash Bonus</span>
                </span>
                <span className="font-mono font-bold text-emerald-300 text-sm">
                  ${bonus.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={150000}
                step={2500}
                value={bonus}
                onChange={(e) => setBonus(Number(e.target.value))}
                className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sign-on Bonus */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>One-Time Sign-on Sweetener</span>
                </span>
                <span className="font-mono font-bold text-amber-300 text-sm">
                  ${signOnBonus.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100000}
                step={2500}
                value={signOnBonus}
                onChange={(e) => setSignOnBonus(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Market Analytics & Visuals (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Metric Cards Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Total Target Comp */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Annual (TTC)</span>
              <span className="text-2xl font-black text-cyan-300 font-sans block">
                ${totalAnnualTarget.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 font-mono block">
                Yr 1 Total: ${firstYearTotal.toLocaleString()}
              </span>
            </div>

            {/* Market Percentile Standing */}
            <div className="p-4 bg-slate-950/80 border border-cyan-500/40 rounded-xl space-y-1 glow-subtle">
              <span className="text-[10px] font-mono uppercase text-cyan-400 block font-bold">Market Standing</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400 font-sans">
                  {estimatedPercentile}th
                </span>
                <span className="text-xs text-slate-400 font-mono">Percentile</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono block">
                {estimatedPercentile >= 75
                  ? 'Top Quartile / Aggressive'
                  : estimatedPercentile >= 45
                  ? 'Market Median Standard'
                  : 'Below Median / Cost Advantage'}
              </span>
            </div>

            {/* Budget Variance */}
            <div
              className={`p-4 rounded-xl border space-y-1 ${
                isOverBudget
                  ? 'bg-rose-950/20 border-rose-500/40'
                  : 'bg-emerald-950/20 border-emerald-500/40'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Budget Variance</span>
              <span
                className={`text-2xl font-black font-sans block ${
                  isOverBudget ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {isOverBudget ? `+$${varianceVsBudgetMax.toLocaleString()}` : `-$${Math.abs(varianceVsBudgetMax).toLocaleString()}`}
              </span>
              <span className="text-[11px] font-mono block text-slate-300">
                {isOverBudget ? `${variancePercentMax}% over max budget` : 'Within approved budget'}
              </span>
            </div>
          </div>

          {/* Visual Percentile Gradient Bar */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold">Market Calibration Spectrum</span>
              <span className="text-cyan-300 font-bold">
                Candidate at {estimatedPercentile}% of market
              </span>
            </div>

            <div className="relative pt-6 pb-2">
              {/* Markers for P25, P50, P75, P90 */}
              <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-cyan-600 via-emerald-500 via-indigo-500 to-amber-500 overflow-visible">
                {/* Candidate Indicator Marker */}
                <div
                  className="absolute -top-6 transform -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                  style={{ left: `${Math.max(5, Math.min(95, estimatedPercentile))}%` }}
                >
                  <span className="px-2 py-0.5 rounded bg-cyan-400 text-slate-950 text-[10px] font-bold font-mono shadow-md whitespace-nowrap">
                    Candidate: ${(totalAnnualTarget / 1000).toFixed(0)}k
                  </span>
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-400" />
                </div>
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
                <span>P10 (${(p10 / 1000).toFixed(0)}k)</span>
                <span>P25 (${(adjustedP25 / 1000).toFixed(0)}k)</span>
                <span className="text-emerald-400 font-bold">P50 (${(adjustedP50 / 1000).toFixed(0)}k)</span>
                <span>P75 (${(adjustedP75 / 1000).toFixed(0)}k)</span>
                <span className="text-amber-400">P90 (${(adjustedP90 / 1000).toFixed(0)}k)</span>
              </div>
            </div>
          </div>

          {/* Regional Peer Comparison Bar Chart */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>Peer Industry Benchmark Comparison</span>
              </span>
              <span className="text-slate-400 text-[11px]">Total Target Comp (TTC)</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={peerComparisonData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#94a3b8"
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#94a3b8"
                    tick={{ fontSize: 10 }}
                    width={140}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Total Target Comp']}
                  />
                  <ReferenceLine
                    x={budgetedMax}
                    stroke="#f43f5e"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Budget Cap',
                      fill: '#f43f5e',
                      fontSize: 10,
                      position: 'top',
                    }}
                  />
                  <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                    {peerComparisonData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.type === 'candidate'
                            ? '#38bdf8'
                            : entry.type === 'budget'
                            ? '#f43f5e'
                            : entry.type === 'market'
                            ? '#10b981'
                            : '#818cf8'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Evaluation & Flight Risk Card */}
          <div className={`p-4 rounded-xl border ${counterOfferRisk.color} space-y-1.5`}>
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Counter-Offer & Flight Risk Assessment</span>
              </span>
              <span>{counterOfferRisk.level}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {counterOfferRisk.reason}
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Recruiter Closing Playbook & Copyable HM Dossier */}
      <div className="p-5 bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Executive Negotiation & Recruiter Closing Script
              </h4>
              <p className="text-xs text-slate-400">
                Ready-to-use positioning script and compensation evaluation memo for the hiring manager.
              </p>
            </div>
          </div>

          <button
            id="btn-copy-comp-script"
            onClick={handleCopyScript}
            className="px-4 py-2 rounded-xl accent-gradient text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-lg glow transition-all shrink-0"
          >
            {copiedScript === 'copied' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied Memo to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy HM Compensation Memo</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Closing Packages Advice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Strategy A */}
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5">
            <span className="font-bold text-cyan-300 block font-mono text-[11px] uppercase">
              Option A: Equity-Heavy Bridge
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Cap Base at <strong className="text-white">${Math.min(baseSalary, budgetedMax * 0.75).toLocaleString()}</strong> to preserve budget equity, and grant an extra <strong>${((totalAnnualTarget - budgetedMax > 0 ? totalAnnualTarget - budgetedMax : 25000) * 4).toLocaleString()}</strong> in 4-year unvested RSUs.
            </p>
          </div>

          {/* Strategy B */}
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5">
            <span className="font-bold text-amber-300 block font-mono text-[11px] uppercase">
              Option B: Sign-On Cash Neutralizer
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Use a one-time <strong className="text-white">${Math.max(signOnBonus, 25000).toLocaleString()}</strong> sign-on bonus to neutralize unvested bonuses at {candidateEmployerType} without inflating ongoing recurring OPEX.
            </p>
          </div>

          {/* Strategy C */}
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5">
            <span className="font-bold text-emerald-300 block font-mono text-[11px] uppercase">
              Option C: Accelerated 6-Mo Review
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Offer <strong className="text-white">${budgetedMax.toLocaleString()}</strong> with an explicit performance metric clause tied to an automatic base salary bump upon meeting 6-month deliverables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
