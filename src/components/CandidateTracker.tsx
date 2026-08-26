import React, { useState, useEffect } from 'react';
import { TalentMapReport, TrackedCandidate, CandidatePipelineStage } from '../types';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Tag,
  Trash2,
  Edit2,
  ExternalLink,
  Download,
  Copy,
  Check,
  Building2,
  MapPin,
  Sparkles,
  Send,
  Plus,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface CandidateTrackerProps {
  report: TalentMapReport;
  onNavigateToOutreach?: (candidateName: string, candidateCompany: string) => void;
}

const STAGES: { id: CandidatePipelineStage; label: string; color: string; badgeBg: string }[] = [
  { id: 'identified', label: 'Identified (Sourced)', color: 'text-cyan-400', badgeBg: 'bg-cyan-500/15 border-cyan-500/30' },
  { id: 'screening', label: 'Screening', color: 'text-indigo-400', badgeBg: 'bg-indigo-500/15 border-indigo-500/30' },
  { id: 'outreached', label: 'Outreach Sent', color: 'text-amber-400', badgeBg: 'bg-amber-500/15 border-amber-500/30' },
  { id: 'interviewing', label: 'Interviewing', color: 'text-blue-400', badgeBg: 'bg-blue-500/15 border-blue-500/30' },
  { id: 'offered', label: 'Offer Stage', color: 'text-emerald-400', badgeBg: 'bg-emerald-500/15 border-emerald-500/30' },
  { id: 'archived', label: 'Archived / Passed', color: 'text-slate-400', badgeBg: 'bg-slate-800 border-slate-700' },
];

export const CandidateTracker: React.FC<CandidateTrackerProps> = ({ report, onNavigateToOutreach }) => {
  const primaryRole = report.input.role.value;
  const metro = report.input.geography.location;
  const targetEmployers = report.competitiveEmployerLandscape;

  // Initialize with seed candidates tailored to the report
  const [candidates, setCandidates] = useState<TrackedCandidate[]>(() => {
    const saved = localStorage.getItem(`talentiq_candidates_${report.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }

    // Default pre-seeded high-caliber candidates matching target companies
    const compA = targetEmployers[0]?.name || 'Stripe';
    const compB = targetEmployers[1]?.name || 'Datadog';
    const compC = targetEmployers[2]?.name || 'Uber';
    const compD = targetEmployers[3]?.name || 'Snowflake';

    return [
      {
        id: 'cand-1',
        name: 'Elena Rostova',
        currentTitle: `Senior ${primaryRole}`,
        currentCompany: compA,
        location: metro,
        matchScore: 97,
        stage: 'identified',
        sourceType: 'LinkedIn Boolean',
        labels: ['High Priority', 'Ex-Tier 1', 'Active Mover'],
        skills: report.input.skills.required.value.slice(0, 3),
        notes: `Identified via Boolean query. Currently leading high-throughput cluster migrations at ${compA}. Strong match for our latency targets.`,
        linkedinUrl: 'https://linkedin.com/in/example-profile-1',
        githubUrl: 'https://github.com/example-eng-1',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'cand-2',
        name: 'Marcus Chen',
        currentTitle: `Staff ${primaryRole}`,
        currentCompany: compB,
        location: metro,
        matchScore: 94,
        stage: 'outreached',
        sourceType: 'Google X-Ray',
        labels: ['Staff Caliber', 'Comp Sensitive'],
        skills: report.input.skills.required.value.slice(1, 4),
        notes: `Reached out with Architecture Autonomy pitch. 4-year cliff at ${compB} approaching in Q3.`,
        linkedinUrl: 'https://linkedin.com/in/example-profile-2',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'cand-3',
        name: 'Sarah Jenkins',
        currentTitle: `Lead ${primaryRole}`,
        currentCompany: compC,
        location: 'Remote (US)',
        matchScore: 92,
        stage: 'interviewing',
        sourceType: 'GitHub Search',
        labels: ['Open Source Contributor', 'Fast Track'],
        skills: report.input.skills.required.value.slice(0, 4),
        notes: 'Passed Technical Deep Dive with VP Eng. Excited about our zero-legacy greenfield roadmap.',
        linkedinUrl: 'https://linkedin.com/in/example-profile-3',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'cand-4',
        name: 'Devon Vance',
        currentTitle: `${primaryRole}`,
        currentCompany: compD,
        location: metro,
        matchScore: 89,
        stage: 'screening',
        sourceType: 'Target Company List',
        labels: ['Immediate Availability'],
        skills: report.input.skills.required.value.slice(0, 2),
        notes: 'Recent team restructuring at employer. Highly motivated to transition within 30 days.',
        linkedinUrl: 'https://linkedin.com/in/example-profile-4',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        lastUpdated: new Date().toISOString(),
      },
    ];
  });

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem(`talentiq_candidates_${report.id}`, JSON.stringify(candidates));
  }, [candidates, report.id]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('ALL');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Candidate Form State
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    currentTitle: `Senior ${primaryRole}`,
    currentCompany: targetEmployers[0]?.name || '',
    location: metro,
    matchScore: 90,
    stage: 'identified' as CandidatePipelineStage,
    sourceType: 'LinkedIn Boolean' as const,
    labels: 'High Priority',
    notes: '',
    linkedinUrl: '',
    githubUrl: '',
  });

  // Move candidate across stages
  const handleMoveStage = (id: string, newStage: CandidatePipelineStage) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, stage: newStage, lastUpdated: new Date().toISOString() }
          : c
      )
    );
  };

  // Add Candidate
  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidate.name.trim()) return;

    const labelArr = newCandidate.labels
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean);

    const created: TrackedCandidate = {
      id: `cand-${Date.now()}`,
      name: newCandidate.name,
      currentTitle: newCandidate.currentTitle,
      currentCompany: newCandidate.currentCompany,
      location: newCandidate.location,
      matchScore: Number(newCandidate.matchScore) || 90,
      stage: newCandidate.stage,
      sourceType: newCandidate.sourceType,
      labels: labelArr.length > 0 ? labelArr : ['High Priority'],
      skills: report.input.skills.required.value.slice(0, 3),
      notes: newCandidate.notes,
      linkedinUrl: newCandidate.linkedinUrl || undefined,
      githubUrl: newCandidate.githubUrl || undefined,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    setCandidates((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewCandidate({
      name: '',
      currentTitle: `Senior ${primaryRole}`,
      currentCompany: targetEmployers[0]?.name || '',
      location: metro,
      matchScore: 90,
      stage: 'identified',
      sourceType: 'LinkedIn Boolean',
      labels: 'High Priority',
      notes: '',
      linkedinUrl: '',
      githubUrl: '',
    });
  };

  // Delete Candidate
  const handleDeleteCandidate = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  // Export pipeline to CSV
  const handleExportCSV = () => {
    const headers = ['Name', 'Stage', 'Match Score', 'Current Title', 'Company', 'Location', 'Source', 'Labels', 'Notes'];
    const rows = candidates.map((c) => [
      `"${c.name}"`,
      `"${c.stage}"`,
      `"${c.matchScore}%"`,
      `"${c.currentTitle}"`,
      `"${c.currentCompany}"`,
      `"${c.location}"`,
      `"${c.sourceType}"`,
      `"${c.labels.join(', ')}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidate_tracker_${primaryRole.toLowerCase().replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.currentCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.currentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.labels.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = selectedStageFilter === 'ALL' || c.stage === selectedStageFilter;
    const matchesTag = selectedTagFilter === 'ALL' || c.labels.includes(selectedTagFilter);

    return matchesSearch && matchesStage && matchesTag;
  });

  // Extract all unique labels
  const allLabels = Array.from(new Set(candidates.flatMap((c) => c.labels)));

  return (
    <div id="candidate-tracker-root" className="space-y-6 animate-fadeIn">
      {/* Top Controls & Metrics Bar */}
      <div className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
              Active Sourcing Pipeline
            </div>
            <h2 className="text-xl font-bold text-white">
              Candidate Pipeline Tracker ({candidates.length} Profiles)
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-add-candidate"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 accent-gradient text-white rounded-xl text-xs font-bold transition-all shadow-lg glow cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Sourced Profile</span>
          </button>

          <button
            id="btn-export-candidates-csv"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-slate-950/80 border border-slate-800/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search candidates, companies, titles, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono">
          <select
            value={selectedStageFilter}
            onChange={(e) => setSelectedStageFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Stages</option>
            {STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            value={selectedTagFilter}
            onChange={(e) => setSelectedTagFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Tags</option>
            {allLabels.map((lbl) => (
              <option key={lbl} value={lbl}>
                {lbl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board / Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {STAGES.map((stage) => {
          const stageCandidates = filteredCandidates.filter((c) => c.stage === stage.id);

          return (
            <div
              key={stage.id}
              className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-3.5 space-y-3 flex flex-col min-h-[480px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-bold font-mono ${stage.color}`}>
                    {stage.label}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-slate-400">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Candidate Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
                {stageCandidates.length === 0 ? (
                  <div className="py-12 text-center text-[11px] text-slate-600 font-mono">
                    No candidates in this stage
                  </div>
                ) : (
                  stageCandidates.map((cand) => (
                    <div
                      key={cand.id}
                      className="p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 rounded-xl space-y-2.5 transition-all shadow-sm group"
                    >
                      {/* Name & Match Score */}
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                            {cand.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                            {cand.currentTitle}
                          </p>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                          {cand.matchScore}%
                        </span>
                      </div>

                      {/* Company & Location */}
                      <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                        <div className="flex items-center gap-1 text-slate-300 font-medium">
                          <Building2 className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="truncate">{cand.currentCompany}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                          <MapPin className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{cand.location}</span>
                        </div>
                      </div>

                      {/* Labels */}
                      <div className="flex flex-wrap gap-1">
                        {cand.labels.map((lbl, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-950 border border-slate-800 text-cyan-300/90"
                          >
                            {lbl}
                          </span>
                        ))}
                      </div>

                      {/* Notes snippet */}
                      {cand.notes && (
                        <p className="text-[10px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 leading-relaxed italic line-clamp-2">
                          "{cand.notes}"
                        </p>
                      )}

                      {/* Stage Move Controls & Action Buttons */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                        {/* Move stage selector */}
                        <select
                          value={cand.stage}
                          onChange={(e) => handleMoveStage(cand.id, e.target.value as CandidatePipelineStage)}
                          className="px-1.5 py-1 bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 rounded-lg focus:outline-none focus:border-cyan-500"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label.split(' ')[0]}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-1">
                          {onNavigateToOutreach && (
                            <button
                              onClick={() => onNavigateToOutreach(cand.name, cand.currentCompany)}
                              title="Draft Outreach Pitch"
                              className="p-1 rounded bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 transition-all"
                            >
                              <Send className="w-3 h-3" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteCandidate(cand.id)}
                            title="Remove candidate"
                            className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Sourced Candidate Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className="glass-card rounded-2xl max-w-lg w-full border border-cyan-500/40 p-6 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Add Sourced Candidate Profile</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCandidate} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="text-slate-300 block mb-1">Candidate Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Current Title</label>
                  <input
                    type="text"
                    value={newCandidate.currentTitle}
                    onChange={(e) => setNewCandidate({ ...newCandidate, currentTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Current Employer</label>
                  <input
                    type="text"
                    value={newCandidate.currentCompany}
                    onChange={(e) => setNewCandidate({ ...newCandidate, currentCompany: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Location / Metro</label>
                  <input
                    type="text"
                    value={newCandidate.location}
                    onChange={(e) => setNewCandidate({ ...newCandidate, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Match Score (0-100)</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={newCandidate.matchScore}
                    onChange={(e) => setNewCandidate({ ...newCandidate, matchScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Pipeline Stage</label>
                  <select
                    value={newCandidate.stage}
                    onChange={(e) => setNewCandidate({ ...newCandidate, stage: e.target.value as CandidatePipelineStage })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Source Type</label>
                  <select
                    value={newCandidate.sourceType}
                    onChange={(e) => setNewCandidate({ ...newCandidate, sourceType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="LinkedIn Boolean">LinkedIn Boolean</option>
                    <option value="Google X-Ray">Google X-Ray</option>
                    <option value="GitHub Search">GitHub Search</option>
                    <option value="Target Company List">Target Company List</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Tags / Labels (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. High Priority, Comp Sensitive, Staff Caliber"
                  value={newCandidate.labels}
                  onChange={(e) => setNewCandidate({ ...newCandidate, labels: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Recruiter Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes on candidate background, poachability, key hooks..."
                  value={newCandidate.notes}
                  onChange={(e) => setNewCandidate({ ...newCandidate, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 accent-gradient text-white rounded-xl text-xs font-bold shadow-md glow"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
