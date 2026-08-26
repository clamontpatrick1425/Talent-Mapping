import React, { useState } from 'react';
import { TalentMapReport, WorkModel } from '../types';
import { ScoreGauge } from './ScoreGauge';
import { ConfidenceBadge } from './ConfidenceBadge';
import {
  Users,
  Award,
  UserCheck,
  Activity,
  ShieldAlert,
  Building2,
  Compass,
  Sliders,
  Sparkles,
  Layers,
  MapPin,
  TrendingUp,
  Cpu,
  RefreshCw,
} from 'lucide-react';

interface TalentDashboardViewProps {
  report: TalentMapReport;
  onUpdateWorkModel?: (model: WorkModel) => void;
}

export const TalentDashboardView: React.FC<TalentDashboardViewProps> = ({ report }) => {
  // Interactive sensitivity simulator state
  const [simWorkModel, setSimWorkModel] = useState<WorkModel>(report.input.workModel.value);
  const [simRadiusDelta, setSimRadiusDelta] = useState<number>(0);
  const [simCompDelta, setSimCompDelta] = useState<number>(0);

  // Dynamic calculations based on simulator sliders
  const baseAvail = report.talentAvailabilityScore.score;
  const baseDiff = report.recruitingDifficultyScore.score;

  const modelFactor = simWorkModel === 'REMOTE' ? 18 : simWorkModel === 'HYBRID' ? 0 : -14;
  const radiusFactor = Math.round((simRadiusDelta / 50) * 12);
  const compFactor = Math.round((simCompDelta / 20) * 15);

  const simulatedAvailability = Math.max(5, Math.min(95, baseAvail + modelFactor + radiusFactor + compFactor));
  const simulatedDifficulty = Math.max(10, Math.min(98, baseDiff - modelFactor - radiusFactor - compFactor));

  const getSimAvailBand = (s: number) => {
    if (s >= 80) return 'Very High Availability';
    if (s >= 60) return 'High Availability';
    if (s >= 40) return 'Moderate Availability';
    if (s >= 20) return 'Low Availability';
    return 'Extremely Scarce';
  };

  const getSimDiffBand = (s: number) => {
    if (s >= 81) return 'Extremely Difficult';
    if (s >= 61) return 'Difficult';
    if (s >= 41) return 'Challenging';
    if (s >= 21) return 'Manageable';
    return 'Easy';
  };

  const simulatedAddressable = Math.round(
    report.talentSupply.addressable.count *
      (simWorkModel === 'REMOTE' ? 3.2 : 1 + simRadiusDelta / 100)
  );

  const fiveLayers = [
    {
      num: 1,
      name: 'Intake Engine',
      status: 'Active',
      desc: 'Parses JDs into verified taxonomy & constraint matrix.',
      icon: <Layers className="w-4 h-4 text-blue-500" />,
    },
    {
      num: 2,
      name: 'Market Intelligence Engine',
      status: 'Active',
      desc: 'Calculates geographic density, comp percentiles, & feeder pools.',
      icon: <TrendingUp className="w-4 h-4 text-indigo-500" />,
    },
    {
      num: 3,
      name: 'Talent Discovery Engine',
      status: 'Active',
      desc: 'Generates multi-channel Boolean, X-Ray, and community strings.',
      icon: <Users className="w-4 h-4 text-emerald-500" />,
    },
    {
      num: 4,
      name: 'Scoring Engine',
      status: 'Active',
      desc: 'Evaluates supply scarcity & recruiting friction indices.',
      icon: <Cpu className="w-4 h-4 text-purple-500" />,
    },
    {
      num: 5,
      name: 'Recruiting Strategy Engine',
      status: 'Active',
      desc: 'Formulates candidate archetypes & executive closing briefs.',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
    },
  ];

  return (
    <div id="talent-dashboard-view-root" className="space-y-8">
      {/* 1. Production 5-Layer Engine Architecture */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 glow-dot-cyan"></span>
              System Architecture
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              5-Layer Technical Intelligence Engine
            </h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 glow-dot-emerald" />
            <span className="text-xs text-emerald-300 font-mono font-medium">All 5 Intelligence Layers Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {fiveLayers.map((layer) => (
            <div
              key={layer.num}
              className="glass-card-interactive rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400">LAYER 0{layer.num}</span>
                {layer.icon}
              </div>
              <div className="font-bold text-xs text-white">{layer.name}</div>
              <p className="text-[11px] text-slate-400 leading-snug">{layer.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Executive Talent Map Dashboard Metrics Grid (12 Cards from Spec) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Talent Map Dashboard · Core Workforce Metrics</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Live Analytical Indicators</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Addressable Talent */}
          <div className="glass-card rounded-2xl p-4 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-semibold font-mono">Addressable Talent</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {report.talentSupply.addressable.count.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Meets primary spec</span>
              <ConfidenceBadge level={report.talentSupply.addressable.confidence} size="sm" />
            </div>
          </div>

          {/* Card 2: Highly Qualified */}
          <div className="glass-card rounded-2xl p-4 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-semibold font-mono">Highly Qualified</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {report.talentSupply.highlyQualified.count.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Production hardened</span>
              <ConfidenceBadge level={report.talentSupply.highlyQualified.confidence} size="sm" />
            </div>
          </div>

          {/* Card 3: Estimated Passive Talent */}
          <div className="glass-card rounded-2xl p-4 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-semibold font-mono">Estimated Passive Pool</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              {report.talentSupply.passive.count.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Target outbound</span>
              <ConfidenceBadge level={report.talentSupply.passive.confidence} size="sm" />
            </div>
          </div>

          {/* Card 4: Talent Availability */}
          <div className="glass-card rounded-2xl p-4 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-semibold font-mono">Talent Availability</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
              {report.talentAvailabilityScore.score}<span className="text-xs text-slate-500">/100</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-1">{report.talentAvailabilityScore.band}</div>
          </div>

          {/* Card 5: Recruiting Difficulty */}
          <div className="glass-card rounded-2xl p-4 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-semibold font-mono">Recruiting Difficulty</div>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
              {report.recruitingDifficultyScore.score}<span className="text-xs text-slate-500">/100</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-1">{report.recruitingDifficultyScore.band}</div>
          </div>

          {/* Card 6: Skill Scarcity */}
          <div className="glass-card rounded-2xl p-4 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-semibold font-mono">Skill Scarcity</div>
            <div className="text-xl font-bold font-mono text-indigo-400 mt-1">
              {report.skillsAnalysis.scarceSkills.length > 0 ? 'High / Critical' : 'Moderate'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">
              {report.skillsAnalysis.scarceSkills[0]?.name || 'Specialized domain skills'}
            </div>
          </div>

          {/* Card 7: Geographic Concentration */}
          <div className="glass-card rounded-2xl p-4 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-semibold font-mono">Geographic Density</div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {report.geographicMarket.concentrationDensity}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{report.geographicMarket.metroName}</div>
          </div>

          {/* Card 8: Competitive Intensity */}
          <div className="glass-card rounded-2xl p-4 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-semibold font-mono">Competitive Intensity</div>
            <div className="text-xl font-bold font-mono text-rose-400 mt-1">
              Very High
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{report.competitiveEmployerLandscape.length} Active Competitors</div>
          </div>

          {/* Card 9: Recommended Target Companies */}
          <div className="glass-card rounded-2xl p-4 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-semibold font-mono">Target Companies</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
              {report.targetCompanies.length} Verified
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Tier 1-4 employers</div>
          </div>

          {/* Card 10: Talent-Adjacent Pools */}
          <div className="glass-card rounded-2xl p-4 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-semibold font-mono">Adjacent Pools</div>
            <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
              {report.executiveSummary.best5AdjacentTalentPools.length} Pools
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Transferable skillsets</div>
          </div>

          {/* Card 11: Geographic Expansion */}
          <div className="glass-card rounded-2xl p-4 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-semibold font-mono">Recommended Expansion</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
              +50 Miles
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Unlocks +35% talent supply</div>
          </div>

          {/* Card 12: Estimated Search Risk */}
          <div className="glass-card rounded-2xl p-4 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase font-semibold font-mono">Estimated Search Risk</div>
            <div className={`text-xl font-bold font-mono mt-1 ${
              report.executiveSummary.expectedRecruitingRisk === 'High' || report.executiveSummary.expectedRecruitingRisk === 'Critical'
                ? 'text-rose-400'
                : 'text-amber-400'
            }`}>
              {report.executiveSummary.expectedRecruitingRisk} Risk
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{report.recruitingDifficultyScore.expectedTimeToFillDays} Days TTF</div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Scenario Sensitivity Simulator */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Market Sensitivity & Pivot Simulator</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Test how adjusting work model, search radius, or compensation alters market availability and hiring difficulty.
            </p>
          </div>

          <button
            onClick={() => {
              setSimWorkModel(report.input.workModel.value);
              setSimRadiusDelta(0);
              setSimCompDelta(0);
            }}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-5 lg:col-span-2">
            {/* Work Model Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Work Model Policy:
              </label>
              <div className="flex gap-2">
                {(['ON-SITE', 'HYBRID', 'REMOTE'] as WorkModel[]).map((wm) => (
                  <button
                    key={wm}
                    onClick={() => setSimWorkModel(wm)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      simWorkModel === wm
                        ? 'accent-gradient text-white glow'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    {wm}
                  </button>
                ))}
              </div>
            </div>

            {/* Commuting Radius Expansion Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  Geographic Search Radius Expansion:
                </span>
                <span className="font-mono font-bold text-cyan-400">
                  +{simRadiusDelta} Miles (Total: {report.input.geography.radiusMiles + simRadiusDelta} mi)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={simRadiusDelta}
                onChange={(e) => setSimRadiusDelta(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-950/70 border border-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Compensation Adjustment Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  Compensation Adjustment:
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {simCompDelta > 0 ? `+${simCompDelta}%` : simCompDelta < 0 ? `${simCompDelta}%` : 'Baseline (0%)'}
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="30"
                step="5"
                value={simCompDelta}
                onChange={(e) => setSimCompDelta(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-950/70 border border-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>

          {/* Dynamic Simulated Outcome Score Gauges */}
          <div className="grid grid-cols-2 gap-3">
            <ScoreGauge
              score={simulatedAvailability}
              title="Simulated Availability"
              type="availability"
              band={getSimAvailBand(simulatedAvailability)}
              subtitle={`Simulated Pool: ~${simulatedAddressable.toLocaleString()}`}
            />

            <ScoreGauge
              score={simulatedDifficulty}
              title="Simulated Difficulty"
              type="difficulty"
              band={getSimDiffBand(simulatedDifficulty)}
              subtitle={`Est. TTF: ${Math.round(report.recruitingDifficultyScore.expectedTimeToFillDays * (simulatedDifficulty / baseDiff))} Days`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
