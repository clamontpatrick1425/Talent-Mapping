import React, { useState } from 'react';
import { TalentMapReport } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Target,
  Compass,
  Printer,
  FileCheck,
  HelpCircle,
  Award,
  Layers,
  ChevronDown,
  Sparkles,
  Zap,
} from 'lucide-react';

interface ExecutiveBriefViewProps {
  report: TalentMapReport;
}

export const ExecutiveBriefView: React.FC<ExecutiveBriefViewProps> = ({ report }) => {
  const [showCalibrationMatrix, setShowCalibrationMatrix] = useState<boolean>(true);
  const [activeCalibrationTab, setActiveCalibrationTab] = useState<'rubric' | 'questions' | 'leveling'>('rubric');

  const handlePrint = () => {
    window.print();
  };

  const {
    input,
    executiveSummary,
    executiveRecruitingBrief,
    recruitingDifficultyScore,
    talentAvailabilityScore,
    talentSupply,
    compensationIntelligence,
    risksAndConstraints,
  } = report;

  const roleName = input.role.value;
  const primarySkills = input.skills.required.value.slice(0, 3).join(', ');

  // Calibration Competency Rubric
  const competencyRubric = [
    {
      domain: 'Core System Architecture & Code Craft',
      weight: '30%',
      targetLevel: 'Strong Hire (4/5)',
      description: `Evaluates clean abstractions, memory safety, concurrency models, and domain mastery in ${primarySkills}.`,
      greenFlags: [
        'Explains trade-offs between memory overhead vs. latency throughput clearly',
        'Designs clean fault-tolerant boundaries and modular micro-services/libraries',
        'Has direct experience with distributed consensus (Raft/Paxos) or event pipelines',
      ],
      redFlags: [
        'Relies solely on framework magic without understanding runtime concurrency mechanics',
        'Cannot articulate failure modes or network partition resilience',
      ],
    },
    {
      domain: 'Distributed Scale & Production Operations',
      weight: '25%',
      targetLevel: 'Strong Hire (4/5)',
      description: 'Evaluates resilience, observability (metrics/traces), capacity planning, and live production triage.',
      greenFlags: [
        'Shares concrete wartime post-mortem stories with actionable remediation actions',
        'Understands P99 latency tail behavior, backpressure, and graceful degradation',
        'Proactively builds metrics dashboards and distributed tracing',
      ],
      redFlags: [
        'Views operations and reliability as solely a "DevOps/SRE" responsibility',
        'Struggles to diagnose cascading database connection timeouts under load',
      ],
    },
    {
      domain: 'Technical Leadership & RFC Velocity',
      weight: '25%',
      targetLevel: 'Exceeds (4.5/5)',
      description: 'Evaluates ability to drive engineering alignment, write high-clarity RFCs, and mentor senior ICs.',
      greenFlags: [
        'Translates ambiguous product vision into crisp, sequenced technical roadmaps',
        'Elevates peer engineering quality through constructive and rigorous code reviews',
        'Known for unblocking cross-functional bottlenecks rapidly',
      ],
      redFlags: [
        'Prefers siloed individual heroics over institutional knowledge sharing',
        'Resistant to pragmatic compromises when business timelines demand it',
      ],
    },
    {
      domain: 'Autonomous Drive & Startup Velocity',
      weight: '20%',
      targetLevel: 'Strong Hire (4/5)',
      description: 'Evaluates comfort with ambiguity, high agency, zero bureaucracy, and bias for shipping.',
      greenFlags: [
        'Thrives with minimal oversight; sets own high standards for quality and speed',
        'Enjoys direct customer and business impact feedback loops',
        'High appetite for ownership and accountability',
      ],
      redFlags: [
        'Requires rigidly pre-defined Jira tickets and committee approvals before building',
        'Easily paralyzed when specifications are fluid or evolving',
      ],
    },
  ];

  // High-Signal Screen Questions
  const screenQuestions = [
    {
      id: 'q1',
      question: `Walk me through the most complex distributed system or platform service you designed using ${primarySkills}. What was the hardest architectural bottleneck?`,
      whatToListenFor: 'Deep intuition on serialization overhead, network I/O, database lock contention, and idempotency guarantees.',
      followUp: 'If traffic spiked 10x overnight, which subsystem fails first and how do you safeguard it?',
    },
    {
      id: 'q2',
      question: 'Describe a production outage or catastrophic degradation you directly debugged. What was the root cause and long-term fix?',
      whatToListenFor: 'Methodical root-cause analysis, cool-headed triage, post-mortem hygiene, and systemic regression testing.',
      followUp: 'How did you prevent similar failure modes from recurring across adjacent services?',
    },
    {
      id: 'q3',
      question: 'How do you structure an RFC / technical design document when 3 senior staff engineers vehemently disagree on the data layer?',
      whatToListenFor: 'Data-driven benchmarking, prototyping spikes, customer-centric priority sorting, and executive decision crispness.',
      followUp: 'When is it appropriate to disagree and commit versus escalating?',
    },
  ];

  return (
    <div id="executive-brief-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Action Bar (hidden during print) */}
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl shadow-xs print:hidden">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Executive Talent Intelligence Brief & Calibration Station</span>
          </h2>
          <p className="text-xs text-slate-400">
            One-page C-Suite summary and hiring team calibration guide for Engineering Leadership & TA Partners.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Talent Intelligence & Labor Market Assessment
              </span>
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
                {input.role.value}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <strong>{input.geography.location}</strong> ({input.workModel.value})
                </span>
                <span>•</span>
                <span>
                  Seniority: <strong>{input.seniority.value}</strong>
                </span>
                <span>•</span>
                <span>
                  Generated: <strong>{new Date(report.createdAt).toLocaleDateString()}</strong>
                </span>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col items-end gap-2">
              <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-right">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Recruiting Difficulty</div>
                <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  {recruitingDifficultyScore.score}/100 ({recruitingDifficultyScore.band})
                </div>
              </div>
              <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-right">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Talent Availability</div>
                <div className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {talentAvailabilityScore.score}/100 ({talentAvailabilityScore.band})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Executive Summary & Strategic Assessment
          </div>
          <p>{executiveSummary.executiveBriefNarrative}</p>
        </div>

        {/* 4 KPI Matrix Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">Addressable Pool</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {talentSupply.addressable.count.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">Total qualified in market</div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">Active Searchers</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {talentSupply.active.count.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">Immediately reachable</div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">Median Base Comp</div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              ${compensationIntelligence.baseSalary.p50.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">Target 50th percentile</div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="text-[11px] text-slate-500 uppercase font-semibold">Estimated Time to Hire</div>
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {recruitingDifficultyScore.expectedTimeToFillDays} Days
            </div>
            <div className="text-[10px] text-slate-400">Kickoff to offer sign</div>
          </div>
        </div>

        {/* Key Strategic Takeaways */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Critical Market Findings & Operating Recommendations
          </h3>
          <div className="space-y-2">
            {executiveRecruitingBrief.keyTakeaways.map((takeaway, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs text-slate-800 dark:text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{takeaway}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Grid: Competitors & Adjacent Pools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Primary Competitor Target Companies</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {executiveSummary.top10TargetCompanies.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Recommended Adjacent Talent Pools</span>
            </div>
            <div className="space-y-1.5 pt-1">
              {executiveSummary.best5AdjacentTalentPools.map((pool, i) => (
                <div key={i} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>{pool}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hiring Team Interview Calibration Matrix */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-4 print:bg-white print:border-slate-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Hiring Team Calibration Matrix & Technical Interview Guide
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Align hiring managers and interview panel on standard pass/fail evaluation criteria.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-200 dark:bg-slate-900 rounded-lg text-xs print:hidden">
              <button
                onClick={() => setActiveCalibrationTab('rubric')}
                className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                  activeCalibrationTab === 'rubric'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Core Rubric
              </button>
              <button
                onClick={() => setActiveCalibrationTab('questions')}
                className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                  activeCalibrationTab === 'questions'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Screen Questions
              </button>
              <button
                onClick={() => setActiveCalibrationTab('leveling')}
                className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                  activeCalibrationTab === 'leveling'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Leveling Nuances
              </button>
            </div>
          </div>

          {activeCalibrationTab === 'rubric' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              {competencyRubric.map((r, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {r.domain}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40">
                      Weight: {r.weight}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {r.description}
                  </p>

                  <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                      Strong Signals (Green Flags):
                    </div>
                    {r.greenFlags.map((g, gIdx) => (
                      <div key={gIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{g}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400">
                      Critical Red Flags:
                    </div>
                    {r.redFlags.map((rf, rfIdx) => (
                      <div key={rfIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{rf}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeCalibrationTab === 'questions' && (
            <div className="space-y-3 pt-1">
              {screenQuestions.map((q, i) => (
                <div
                  key={i}
                  className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Question {i + 1}</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    "{q.question}"
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-slate-700 dark:text-slate-300 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                      What to Listen For:
                    </div>
                    <p className="text-[11px] leading-relaxed">{q.whatToListenFor}</p>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-300 pt-1 font-medium">
                      <strong>Probe / Pressure Test:</strong> {q.followUp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeCalibrationTab === 'leveling' && (
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-3">
              <div className="font-bold text-slate-900 dark:text-slate-100">
                Leveling Nuances & Corporate Grade Equivalencies
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white text-xs">Senior IC (L5)</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Autonomously ships multi-quarter projects; high operational fluency; mentors juniors; executes within established architecture.
                  </p>
                </div>
                <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-lg space-y-1">
                  <div className="font-bold text-indigo-600 dark:text-indigo-300 text-xs">Staff IC (L6 - Target)</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Defines domain boundaries; sets architecture standards; eliminates organizational systemic risks; drives RFC alignment across 3+ teams.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white text-xs">Principal IC (L7)</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Company-wide technical strategy; influences multi-year roadmap and executive decisions; creates transformative business advantages.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Closing Strategy Callout */}
        <div className="p-4 bg-emerald-900 text-emerald-100 rounded-xl text-xs space-y-1">
          <div className="font-bold text-white uppercase tracking-wider text-[11px]">
            Candidate Closing Strategy & Value Proposition
          </div>
          <p className="leading-relaxed">{executiveRecruitingBrief.closingStrategy}</p>
        </div>

        {/* Footer with statutory assurance */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div>
            System: <strong>TalentIQ Enterprise Intelligence Platform v2.5</strong>
          </div>
          <div>
            Non-Fabrication Guarantee: Every metric is audited and tagged with verified data confidence.
          </div>
        </div>
      </div>
    </div>
  );
};
