import React, { useState } from 'react';
import { TalentMapReport, CandidateArchetype } from '../types';
import {
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  Send,
  User,
  Zap,
  Target,
  Mail,
  Linkedin,
  Terminal,
  ShieldCheck,
  Sliders,
  ChevronRight,
} from 'lucide-react';

interface CandidateOutreachStudioProps {
  report: TalentMapReport;
}

export const CandidateOutreachStudio: React.FC<CandidateOutreachStudioProps> = ({ report }) => {
  const archetypes = report.candidateArchetypes || [];
  const [selectedArchetypeIdx, setSelectedArchetypeIdx] = useState<number>(0);
  const [senderTone, setSenderTone] = useState<'tech_lead' | 'recruiter' | 'founder'>('tech_lead');
  const [pitchAngle, setPitchAngle] = useState<'architecture' | 'comp' | 'speed' | 'leadership'>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Dynamic variables
  const currentArchetype: CandidateArchetype = archetypes[selectedArchetypeIdx] || {
    id: 'arch-default',
    number: 1,
    name: 'Senior Distributed Systems Architect',
    archetypeType: 'Staff Infrastructure Lead',
    backgroundSummary: '7-10 years in scalable cloud systems',
    targetCompanies: ['Tier 1 Tech'],
    targetTitles: ['Staff Engineer', 'Lead Architect'],
    keySkills: ['High throughput Go/Rust', 'Kafka/Kubernetes', 'P99 latency tuning'],
    likelyMotivations: ['Direct architecture ownership', 'Modern greenfield stack'],
    recruitingChallenges: ['Wants zero bureaucratic committee review before shipping'],
    recommendedMessagingHook: 'Lead the next-generation event-driven platform with full architectural autonomy.',
    sampleOutreachSnippet: 'I came across your work on distributed systems...',
  };

  const roleTitle = report.input.role.value;
  const metro = report.input.geography.location;
  const workModel = report.input.workModel.value;
  const primarySkills = report.input.skills.required.value.slice(0, 3).join(', ');
  const targetCompany = report.competitiveEmployerLandscape?.[0]?.name || 'Tier-1 Engineering Organizations';

  // Subject line generation variations based on tone & angle
  const subjectLineOptions = [
    {
      id: 'sub-1',
      text: `${roleTitle} | Architecting next-gen core systems (no legacy baggage)`,
      predictedOpenRate: '68% (High)',
      tag: 'Best for Tech Lead',
    },
    {
      id: 'sub-2',
      text: `Quick note regarding ${primarySkills} architecture at [Company]`,
      predictedOpenRate: '62% (Peer-to-Peer)',
      tag: 'Personalized',
    },
    {
      id: 'sub-3',
      text: `Exclusive: ${roleTitle} opportunity in ${metro} (${workModel})`,
      predictedOpenRate: '57% (Direct)',
      tag: 'Standard',
    },
  ];

  const [selectedSubject, setSelectedSubject] = useState<string>(subjectLineOptions[0].text);

  // Generate customized message body
  const generateOutreachBody = () => {
    const diffSkill = currentArchetype.keySkills?.[0] ? ` (specifically around ${currentArchetype.keySkills[0]})` : '';
    const pitch = currentArchetype.recommendedMessagingHook || `We’re looking for a ${roleTitle} to spearhead this effort.`;

    if (senderTone === 'tech_lead') {
      if (pitchAngle === 'architecture') {
        return `Hi {Candidate Name},

I came across your work on distributed systems and high-throughput architectures${diffSkill}.

I’m the Engineering Lead for our core platform team. We are currently architecting our next-generation infrastructure from the ground up to support our next 10x scale in ${metro} (${workModel}).

Unlike larger legacy environments at places like ${targetCompany}, our team operates with zero architectural committee bureaucracy—engineers own the end-to-end RFC lifecycle, service boundaries, and production topology.

${pitch}

Are you open to a casual 15-minute engineering-to-engineering conversation this Thursday or Friday to benchmark technical challenges?

Best,
[Your Name]
Engineering Lead`;
      } else if (pitchAngle === 'comp') {
        return `Hi {Candidate Name},

I lead engineering here and wanted to reach out directly. We're actively scaling our core team for a ${roleTitle} role based in ${metro} (${workModel}).

Given your background with ${primarySkills}, we have budgeted compensation at the top 90th percentile (${report.input.compensationTarget?.currency || '$'}${report.input.compensationTarget?.min ? Math.round(report.input.compensationTarget.min * 1.1).toLocaleString() : '185,000'} - ${report.input.compensationTarget?.max ? Math.round(report.input.compensationTarget.max * 1.15).toLocaleString() : '240,000'}+) with aggressive liquid equity refreshers and zero clawback constraints.

If you're exploring the market or open to benchmarking what's out there, let's grab 15 minutes this week.

Best,
[Your Name]
Head of Engineering`;
      } else {
        return `Hi {Candidate Name},

Saw your recent work and engineering footprint in ${primarySkills}. We're moving fast on our next-generation ${roleTitle} roadmap in ${metro}.

We ship to production daily, maintain a lean 8-person core team, and are solving P99 latency challenges that match top-tier scale.

Would you be open to connecting for 10 minutes to trade notes on tech stack and roadmap?

Cheers,
[Your Name]
Tech Lead`;
      }
    } else if (senderTone === 'founder') {
      return `Hi {Candidate Name},

I’m reaching out directly because we are hiring a foundational ${roleTitle} in ${metro} (${workModel}) to report directly to leadership and define our core technical roadmap.

Your background at scale with ${primarySkills} stood out as an exact match for what we need to build over the next 18 months.

We offer executive-level equity packages, complete technical autonomy, and a fast 3-stage interview process that respects your time (no 8-hour leetcode loops).

Would you have 15 minutes for a brief introductory call with me this week?

Best regards,
[Founder / CTO Name]`;
    } else {
      // Recruiter Tone
      return `Hi {Candidate Name},

I hope your week is off to a great start!

I’m partnering directly with our VP of Engineering to hire a ${roleTitle} in ${metro} (${workModel}). We’re seeking an experienced engineer with deep expertise in ${primarySkills}.

Key highlights of the role:
• Total Compensation: Highly competitive market rates with equity upside.
• Technical Scope: ${pitch}
• Work Culture: High autonomy, collaborative peers, and fast decision-making.

Would you be open to a confidential 15-minute chat to learn more about the team and trajectory?

Best,
[Your Name]
Technical Talent Partner`;
    }
  };

  const currentMessage = generateOutreachBody();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div id="candidate-outreach-studio-root" className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Outreach Studio & Pitch Simulator · Sourcing War Room</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Candidate Outreach & Messaging Engine
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Synthesize high-conversion, peer-to-peer outreach tailored to specific candidate archetypes and poaching angles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(`${selectedSubject}\n\n${currentMessage}`, 'all')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl accent-gradient text-white text-xs font-bold transition-all cursor-pointer glow hover:scale-[1.02]"
          >
            {copiedKey === 'all' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey === 'all' ? 'Copied Full Campaign!' : 'Copy Full Message'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Archetype Selector */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Candidate Archetype</span>
            </label>
            <div className="space-y-2">
              {archetypes.map((arch, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedArchetypeIdx(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                    selectedArchetypeIdx === idx
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-white glow-subtle'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-200">
                      {arch.archetypeType || arch.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[240px]">
                      {arch.backgroundSummary}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${selectedArchetypeIdx === idx ? 'text-cyan-400' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Sender Persona & Tone */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sender Persona & Outreach Tone</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'tech_lead', label: 'Tech Lead', sub: 'Peer-to-Peer' },
                { id: 'founder', label: 'Founder / CTO', sub: 'High Prestige' },
                { id: 'recruiter', label: 'Talent Lead', sub: 'Structured' },
              ].map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSenderTone(tone.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    senderTone === tone.id
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-white glow-subtle'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-200">{tone.label}</div>
                  <div className="text-[10px] text-slate-400">{tone.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Value Proposition Focus Angle */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Primary Value Proposition Angle</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'architecture', label: 'Architecture Autonomy', desc: 'Zero red-tape' },
                { id: 'comp', label: 'Top-of-Market Comp', desc: 'Liquid equity & salary' },
                { id: 'speed', label: 'Engineering Velocity', desc: 'Ship to prod daily' },
                { id: 'leadership', label: 'Direct Impact', desc: 'Founding member' },
              ].map((angle) => (
                <button
                  key={angle.id}
                  onClick={() => setPitchAngle(angle.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    pitchAngle === angle.id
                      ? 'bg-amber-500/20 border-amber-500/50 text-white glow-subtle'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-200">{angle.label}</div>
                  <div className="text-[10px] text-slate-400">{angle.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Message Preview & Subject Variations */}
        <div className="lg:col-span-7 space-y-5">
          {/* Subject Line Variations */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Recommended Subject Lines (A/B Test Ready)</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Industry Tested</span>
            </label>

            <div className="space-y-2">
              {subjectLineOptions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub.text)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    selectedSubject === sub.text
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-medium block">{sub.text}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-cyan-300">{sub.predictedOpenRate}</span>
                      <span className="text-[10px] text-slate-500">•</span>
                      <span className="text-[10px] font-mono text-slate-400">{sub.tag}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(sub.text, sub.id);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-all"
                  >
                    {copiedKey === sub.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Message Body Workbench */}
          <div className="glass-card rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Generated Outreach Pitch (LinkedIn InMail / Email)</span>
              </label>

              <button
                onClick={() => handleCopy(currentMessage, 'body')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                {copiedKey === 'body' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'body' ? 'Copied Body' : 'Copy Body'}</span>
              </button>
            </div>

            <div className="relative">
              <textarea
                readOnly
                value={currentMessage}
                rows={14}
                className="w-full p-4 text-xs font-mono bg-slate-950/90 border border-slate-800 rounded-xl text-slate-200 leading-relaxed focus:outline-hidden resize-none select-all"
              />
            </div>

            {/* Variable Tokens Helper */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-400 pt-1">
              <span className="text-slate-500">Auto-filled Tokens:</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-cyan-300">
                {roleTitle}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-indigo-300">
                {metro}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-emerald-300">
                {workModel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
