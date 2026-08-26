import React, { useState } from 'react';
import { TalentMapReport, SeniorityLevel } from '../types';
import { CompensationAnalyzer } from './CompensationAnalyzer';
import {
  DollarSign,
  TrendingUp,
  Activity,
  Users,
  Briefcase,
  MapPin,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Scale,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface MarketInsightsViewProps {
  report: TalentMapReport;
}

export const MarketInsightsView: React.FC<MarketInsightsViewProps> = ({ report }) => {
  const [activeInsightTab, setActiveInsightTab] = useState<'analyzer' | 'all' | 'curves' | 'geo' | 'trends'>('analyzer');
  const [compViewMode, setCompViewMode] = useState<'total' | 'base' | 'equity'>('total');
  const [selectedIndustrySector, setSelectedIndustrySector] = useState<string>('ALL');
  const [selectedMetroFilter, setSelectedMetroFilter] = useState<string>(report.input.geography.location);

  const roleTitle = report.input.role.value;
  const currentSeniority = report.input.seniority.value;
  const p25 = report.compensationIntelligence?.percentiles?.p25 || report.compensationIntelligence?.baseSalary?.p25 || 165000;
  const p50 = report.compensationIntelligence?.percentiles?.p50 || report.compensationIntelligence?.baseSalary?.p50 || 195000;
  const p75 = report.compensationIntelligence?.percentiles?.p75 || report.compensationIntelligence?.baseSalary?.p75 || 235000;
  const p90 = report.compensationIntelligence?.percentiles?.p90 || report.compensationIntelligence?.baseSalary?.p90 || 280000;
  const p10 = Math.round(p25 * 0.85);
  const p99 = Math.round(p90 * 1.25);

  const budgetedMin = report.input.compensationTarget?.min || p25;
  const budgetedMax = report.input.compensationTarget?.max || p75;

  // 1. Seniority Ladder Compensation Range Data
  const seniorityLadderData = [
    {
      level: 'Mid-Level',
      p25: Math.round(p25 * 0.72),
      median: Math.round(p50 * 0.72),
      p75: Math.round(p75 * 0.72),
      p90: Math.round(p90 * 0.72),
      equity: Math.round(p50 * 0.15),
      bonus: Math.round(p50 * 0.08),
    },
    {
      level: 'Senior (Current)',
      p25: p25,
      median: p50,
      p75: p75,
      p90: p90,
      equity: Math.round(p50 * 0.28),
      bonus: Math.round(p50 * 0.12),
    },
    {
      level: 'Staff Engineer',
      p25: Math.round(p25 * 1.35),
      median: Math.round(p50 * 1.35),
      p75: Math.round(p75 * 1.35),
      p90: Math.round(p90 * 1.35),
      equity: Math.round(p50 * 0.45),
      bonus: Math.round(p50 * 0.15),
    },
    {
      level: 'Principal / Lead',
      p25: Math.round(p25 * 1.78),
      median: Math.round(p50 * 1.78),
      p75: Math.round(p75 * 1.78),
      p90: Math.round(p90 * 1.78),
      equity: Math.round(p50 * 0.7),
      bonus: Math.round(p50 * 0.2),
    },
    {
      level: 'Distinguished / Fellow',
      p25: Math.round(p25 * 2.3),
      median: Math.round(p50 * 2.3),
      p75: Math.round(p75 * 2.3),
      p90: Math.round(p90 * 2.3),
      equity: Math.round(p50 * 1.1),
      bonus: Math.round(p50 * 0.25),
    },
  ];

  // 2. Sector-by-Sector Compensation Intelligence
  const sectorBenchmarkData = [
    {
      sector: 'AI Research & Frontier Labs',
      base: Math.round(p50 * 0.95),
      equity: Math.round(p50 * 0.65),
      bonus: Math.round(p50 * 0.2),
      total: Math.round(p50 * 1.8),
      premium: '+45%',
      receptivity: 'High Comp Friction',
    },
    {
      sector: 'Tier-1 Big Tech / Hyperscalers',
      base: Math.round(p50 * 0.9),
      equity: Math.round(p50 * 0.5),
      bonus: Math.round(p50 * 0.18),
      total: Math.round(p50 * 1.58),
      premium: '+28%',
      receptivity: 'Vesting Cliff Vulnerable',
    },
    {
      sector: 'Hypergrowth Unicorns (Series B-D)',
      base: Math.round(p50 * 0.88),
      equity: Math.round(p50 * 0.45),
      bonus: Math.round(p50 * 0.1),
      total: Math.round(p50 * 1.43),
      premium: '+15%',
      receptivity: 'High Poachability',
    },
    {
      sector: 'FinTech & Quantitative Tech',
      base: Math.round(p50 * 0.92),
      equity: Math.round(p50 * 0.35),
      bonus: Math.round(p50 * 0.35),
      total: Math.round(p50 * 1.62),
      premium: '+32%',
      receptivity: 'Cash-Heavy Target',
    },
    {
      sector: 'Enterprise B2B SaaS',
      base: Math.round(p50 * 0.8),
      equity: Math.round(p50 * 0.25),
      bonus: Math.round(p50 * 0.1),
      total: Math.round(p50 * 1.15),
      premium: 'Baseline',
      receptivity: 'High Mobility',
    },
  ];

  // 3. Geographic Arbitrage & Cost Differential
  const geographicDifferentialData = [
    {
      metro: 'San Francisco Bay Area',
      index: 100,
      medianComp: Math.round(p50 * 1.12),
      purchasingPower: 76,
      taxBurden: 'High (13.3%)',
    },
    {
      metro: 'New York City',
      index: 98,
      medianComp: Math.round(p50 * 1.08),
      purchasingPower: 74,
      taxBurden: 'High (10.9%)',
    },
    {
      metro: 'Seattle Metro',
      index: 94,
      medianComp: Math.round(p50 * 1.04),
      purchasingPower: 88,
      taxBurden: 'Zero State Tax',
    },
    {
      metro: 'Austin / Texas Hub',
      index: 85,
      medianComp: Math.round(p50 * 0.92),
      purchasingPower: 94,
      taxBurden: 'Zero State Tax',
    },
    {
      metro: 'Remote (US Nationwide)',
      index: 88,
      medianComp: p50,
      purchasingPower: 92,
      taxBurden: 'Varies by State',
    },
    {
      metro: 'London / Western Europe',
      index: 68,
      medianComp: Math.round(p50 * 0.72),
      purchasingPower: 81,
      taxBurden: 'High (45%)',
    },
    {
      metro: 'Bengaluru / India Hub',
      index: 38,
      medianComp: Math.round(p50 * 0.42),
      purchasingPower: 115,
      taxBurden: 'Moderate (30%)',
    },
  ];

  // 4. Candidate Availability & Seasonality Trends (6 Quarters Historical + 2 Forecast)
  const availabilityTrendsData = [
    {
      quarter: 'Q1 2025',
      activeSeekers: 1420,
      passivePool: 8900,
      interviewVelocityDays: 44,
      offerAcceptanceRate: 64,
    },
    {
      quarter: 'Q2 2025',
      activeSeekers: 1780,
      passivePool: 9300,
      interviewVelocityDays: 38,
      offerAcceptanceRate: 69,
    },
    {
      quarter: 'Q3 2025',
      activeSeekers: 1540,
      passivePool: 9100,
      interviewVelocityDays: 42,
      offerAcceptanceRate: 66,
    },
    {
      quarter: 'Q4 2025 (Eoy Lull)',
      activeSeekers: 1120,
      passivePool: 8400,
      interviewVelocityDays: 52,
      offerAcceptanceRate: 58,
    },
    {
      quarter: 'Q1 2026 (Bonus Season)',
      activeSeekers: 2150,
      passivePool: 10400,
      interviewVelocityDays: 32,
      offerAcceptanceRate: 78,
    },
    {
      quarter: 'Q2 2026 (Current)',
      activeSeekers: 1940,
      passivePool: 9950,
      interviewVelocityDays: 35,
      offerAcceptanceRate: 74,
    },
    {
      quarter: 'Q3 2026 (Projected)',
      activeSeekers: 1680,
      passivePool: 9600,
      interviewVelocityDays: 39,
      offerAcceptanceRate: 71,
    },
    {
      quarter: 'Q4 2026 (Projected)',
      activeSeekers: 1290,
      passivePool: 8800,
      interviewVelocityDays: 48,
      offerAcceptanceRate: 62,
    },
  ];

  // 5. Time-to-Fill Probability Curve vs Salary Offer
  const timeToFillCompCurve = [
    {
      percentile: 'P10 ($' + (p10 / 1000).toFixed(0) + 'k)',
      daysToFill: 76,
      acceptanceRate: 35,
      riskLevel: 'Extreme Ghosting Risk',
    },
    {
      percentile: 'P25 ($' + (p25 / 1000).toFixed(0) + 'k)',
      daysToFill: 58,
      acceptanceRate: 52,
      riskLevel: 'Elevated Friction',
    },
    {
      percentile: 'P50 ($' + (p50 / 1000).toFixed(0) + 'k)',
      daysToFill: 41,
      acceptanceRate: 72,
      riskLevel: 'Healthy Market Standard',
    },
    {
      percentile: 'P75 ($' + (p75 / 1000).toFixed(0) + 'k)',
      daysToFill: 28,
      acceptanceRate: 86,
      riskLevel: 'Strong Closing Velocity',
    },
    {
      percentile: 'P90 ($' + (p90 / 1000).toFixed(0) + 'k)',
      daysToFill: 19,
      acceptanceRate: 94,
      riskLevel: 'Elite Rapid Conversion',
    },
  ];

  // 6. Skill Scarcity vs Comp Premium Matrix
  const primarySkills = report.input.skills.required.value.slice(0, 5);
  const skillMarketMatrix = [
    {
      skill: primarySkills[0] || 'Core Architecture',
      scarcity: 88,
      demand: 92,
      salaryPremium: 28,
    },
    {
      skill: primarySkills[1] || 'Distributed Systems',
      scarcity: 84,
      demand: 90,
      salaryPremium: 24,
    },
    {
      skill: primarySkills[2] || 'High Throughput',
      scarcity: 78,
      demand: 82,
      salaryPremium: 18,
    },
    {
      skill: primarySkills[3] || 'Cloud & Kubernetes',
      scarcity: 62,
      demand: 85,
      salaryPremium: 14,
    },
    {
      skill: primarySkills[4] || 'Low Latency P99',
      scarcity: 92,
      demand: 88,
      salaryPremium: 32,
    },
  ];

  const formatCurrency = (val: number) => `$${(val / 1000).toFixed(0)}k`;

  return (
    <div id="market-insights-view-root" className="space-y-8 max-w-6xl mx-auto animate-fadeIn">
      {/* Top Hero Banner */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden border border-cyan-500/20 shadow-2xl">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 glow-dot-cyan animate-pulse"></span>
            <span>Real-Time Labor Market Intelligence · Macro Insights</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Industry Salary Ranges & Candidate Availability Trends
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Synthesized empirical compensation curves, candidate salary analyzer, sector talent liquidity indexes, and predictive time-to-fill models for{' '}
            <strong className="text-cyan-300 font-bold">{roleTitle}</strong> in{' '}
            <strong className="text-indigo-300 font-bold">{report.input.geography.location}</strong>.
          </p>
        </div>

        {/* Quick Calibration Widget */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl shrink-0 space-y-2 min-w-[240px]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Target Budget</span>
            <span className="text-cyan-300 font-bold">
              ${(budgetedMin / 1000).toFixed(0)}k - ${(budgetedMax / 1000).toFixed(0)}k
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Market Median</span>
            <span className="text-emerald-400 font-bold">${(p50 / 1000).toFixed(0)}k</span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Budget Status:</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {budgetedMax >= p75 ? 'Top Quartile (High Comp Power)' : 'Competitive Market Standard'}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800 text-xs font-mono">
        <button
          id="tab-insights-analyzer"
          onClick={() => setActiveInsightTab('analyzer')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeInsightTab === 'analyzer'
              ? 'accent-gradient text-white glow'
              : 'glass-card text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Compensation Analyzer</span>
          <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-400/20 text-cyan-300 font-normal">
            Interactive
          </span>
        </button>

        <button
          id="tab-insights-curves"
          onClick={() => setActiveInsightTab('curves')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeInsightTab === 'curves'
              ? 'accent-gradient text-white glow'
              : 'glass-card text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Compensation Curves & Bands</span>
        </button>

        <button
          id="tab-insights-geo"
          onClick={() => setActiveInsightTab('geo')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeInsightTab === 'geo'
              ? 'accent-gradient text-white glow'
              : 'glass-card text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Sectors & Geo Differentials</span>
        </button>

        <button
          id="tab-insights-trends"
          onClick={() => setActiveInsightTab('trends')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeInsightTab === 'trends'
              ? 'accent-gradient text-white glow'
              : 'glass-card text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Availability & Seasonality</span>
        </button>

        <button
          id="tab-insights-all"
          onClick={() => setActiveInsightTab('all')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeInsightTab === 'all'
              ? 'accent-gradient text-white glow'
              : 'glass-card text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Full Market View (All)</span>
        </button>
      </div>

      {/* RENDER 1: Compensation Analyzer */}
      {(activeInsightTab === 'analyzer' || activeInsightTab === 'all') && (
        <CompensationAnalyzer report={report} />
      )}

      {/* RENDER 2: Dynamic Compensation Benchmarking & Percentile Distribution */}
      {(activeInsightTab === 'curves' || activeInsightTab === 'all') && (
        <div className="glass-card rounded-2xl p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Industry Compensation Curve & Percentiles
                </h2>
                <p className="text-xs text-slate-400">
                  P10 through P90 distributions broken down by seniority career ladder and base vs equity split.
                </p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono">
              <button
                onClick={() => setCompViewMode('total')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  compViewMode === 'total'
                    ? 'accent-gradient text-white glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Total Comp (TTC)
              </button>
              <button
                onClick={() => setCompViewMode('base')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  compViewMode === 'base'
                    ? 'accent-gradient text-white glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Base Salary
              </button>
              <button
                onClick={() => setCompViewMode('equity')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  compViewMode === 'equity'
                    ? 'accent-gradient text-white glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Equity / LTI
              </button>
            </div>
          </div>

          {/* 4 Summary Percentile Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs font-mono">
            <div className="p-4 bg-slate-950/80 border border-slate-800/90 rounded-xl space-y-1">
              <span className="text-slate-400 uppercase text-[10px] block">25th Percentile (P25)</span>
              <span className="text-xl font-black text-cyan-300 font-sans block">${p25.toLocaleString()}</span>
              <span className="text-[11px] text-slate-500 block">Baseline entry threshold</span>
            </div>
            <div className="p-4 bg-slate-950/80 border border-cyan-500/40 rounded-xl space-y-1 glow-subtle">
              <span className="text-cyan-400 uppercase text-[10px] block font-bold">50th Percentile (Median)</span>
              <span className="text-xl font-black text-emerald-400 font-sans block">${p50.toLocaleString()}</span>
              <span className="text-[11px] text-slate-400 block">National calibrated median</span>
            </div>
            <div className="p-4 bg-slate-950/80 border border-slate-800/90 rounded-xl space-y-1">
              <span className="text-slate-400 uppercase text-[10px] block">75th Percentile (P75)</span>
              <span className="text-xl font-black text-indigo-300 font-sans block">${p75.toLocaleString()}</span>
              <span className="text-[11px] text-slate-500 block">High competition closing band</span>
            </div>
            <div className="p-4 bg-slate-950/80 border border-slate-800/90 rounded-xl space-y-1">
              <span className="text-slate-400 uppercase text-[10px] block">90th Percentile (P90)</span>
              <span className="text-xl font-black text-amber-300 font-sans block">${p90.toLocaleString()}</span>
              <span className="text-[11px] text-slate-500 block">Tier-1 Hyperscaler scale</span>
            </div>
          </div>

          {/* Interactive Seniority Ladder Chart */}
          <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Career Seniority Ladder Compensation Banding (P25 to P90)</span>
              </span>
              <span className="text-slate-500 text-[11px]">Values calibrated in USD</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seniorityLadderData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="level" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tickFormatter={formatCurrency} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                  <Bar dataKey="p25" name="25th Percentile" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="median" name="50th Median" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="p75" name="75th Percentile" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="p90" name="90th Percentile" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* RENDER 3: Industry Sector Comparison & Geographic Differentials */}
      {(activeInsightTab === 'geo' || activeInsightTab === 'all') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sector Compensation Stack */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold">Compensation Benchmarks by Industry Sector</h3>
            </div>
            <p className="text-xs text-slate-400">
              Total Target Compensation comparison across high-comp peer industry verticals.
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectorBenchmarkData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" tickFormatter={formatCurrency} tick={{ fontSize: 11 }} />
                  <YAxis dataKey="sector" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={140} />
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
                  <Bar dataKey="total" name="Total Comp (TTC)" fill="#06b6d4" radius={[0, 6, 6, 0]}>
                    {sectorBenchmarkData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? '#38bdf8' : index === 1 ? '#818cf8' : '#34d399'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-2">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-cyan-300 font-bold block">AI / Frontier Lab Premium</span>
                <span className="text-slate-400 text-[11px]">Commanding +45% premium driven by 4-year unvested equity pools.</span>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-emerald-300 font-bold block">Series B-D Unicorn Target</span>
                <span className="text-slate-400 text-[11px]">Higher poachability due to delayed IPO horizons and underwater grants.</span>
              </div>
            </div>
          </div>

          {/* Geographic Arbitrage & Purchasing Power */}
          <div className="lg:col-span-5 glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold">Geographic Comp Differentials</h3>
            </div>
            <p className="text-xs text-slate-400">
              Relative compensation index and state tax impact versus SF Bay Area (100 Base).
            </p>

            <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1">
              {geographicDifferentialData.map((geo, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs transition-all hover:border-slate-700"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <span>{geo.metro}</span>
                      {geo.metro === report.input.geography.location && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Median: <strong className="text-cyan-300">${geo.medianComp.toLocaleString()}</strong> • {geo.taxBurden}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-emerald-400">{geo.index}%</span>
                    <span className="text-[10px] text-slate-500 block">Index</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RENDER 4: Candidate Availability Trends & Predictive Velocity */}
      {(activeInsightTab === 'trends' || activeInsightTab === 'all') && (
        <>
          <div className="glass-card rounded-2xl p-6 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Candidate Availability & Seasonality Trends
                  </h2>
                  <p className="text-xs text-slate-400">
                    Quarterly active talent seeker fluctuations, offer acceptance velocities, and hiring cycle seasonality.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/30">
                <Calendar className="w-3.5 h-3.5" />
                <span>Bonus Season Liquidity: Q1 Spike Active</span>
              </div>
            </div>

            {/* Dual Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Availability Volume Trend */}
              <div className="lg:col-span-7 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">Active vs. Passive Seeker Availability Pool</span>
                  <span className="text-slate-500 text-[10px]">Profiles in Metro</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={availabilityTrendsData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="passiveGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="quarter" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#090d16',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontFamily: 'monospace',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Area
                        type="monotone"
                        dataKey="activeSeekers"
                        name="Active Job Seekers"
                        stroke="#06b6d4"
                        fillOpacity={1}
                        fill="url(#activeGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="passivePool"
                        name="Addressable Passive Pool"
                        stroke="#6366f1"
                        fillOpacity={1}
                        fill="url(#passiveGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Time-to-Fill vs Comp Curve */}
              <div className="lg:col-span-5 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">Time-to-Fill by Compensation Offer</span>
                  <span className="text-emerald-400 text-[10px]">Acceptance %</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeToFillCompCurve} margin={{ top: 10, right: 20, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="percentile" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} label={{ value: 'Days', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#090d16',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontFamily: 'monospace',
                        }}
                        formatter={(val: any, name: string) => [
                          name === 'daysToFill' ? `${val} Days` : `${val}%`,
                          name === 'daysToFill' ? 'Time to Fill' : 'Acceptance Rate',
                        ]}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Line
                        type="monotone"
                        dataKey="daysToFill"
                        name="Days to Close"
                        stroke="#f43f5e"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#f43f5e' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="acceptanceRate"
                        name="Acceptance Rate %"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#10b981' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Skill Scarcity & Demand Radar */}
          <div className="glass-card rounded-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Skill Scarcity vs. Salary Premium Index</h3>
                <p className="text-xs text-slate-400">
                  Evaluates how niche requirements impact compensation premiums and candidate scarcity.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs font-mono">
              {skillMarketMatrix.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 truncate">{item.skill}</span>
                    <span className="text-amber-400 font-bold">+{item.salaryPremium}%</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Scarcity Index</span>
                      <span className="text-cyan-300 font-bold">{item.scarcity}/100</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${item.scarcity}%` }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Market Demand</span>
                      <span className="text-indigo-300 font-bold">{item.demand}/100</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${item.demand}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
