import React, { useState } from 'react';
import { TalentMapReport } from '../types';
import {
  X,
  Download,
  FileText,
  FileSpreadsheet,
  FileCode,
  Printer,
  Copy,
  Check,
  Share2,
  Sparkles,
  ShieldCheck,
  Building2,
  DollarSign,
  TrendingUp,
  FileDown,
  CheckCircle2,
} from 'lucide-react';

interface ExportCenterModalProps {
  report: TalentMapReport;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportCenterModal: React.FC<ExportCenterModalProps> = ({
  report,
  isOpen,
  onClose,
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const roleTitle = report.input.role.value;
  const metro = report.input.geography.location;
  const workModel = report.input.workModel.value;

  // Generate clean Markdown briefing
  const generateMarkdownDossier = () => {
    return `# TALENT INTELLIGENCE & MARKET MAP REPORT
**Role:** ${roleTitle} (${report.input.seniority.value})
**Geography:** ${metro} (${workModel})
**Generated On:** ${new Date(report.createdAt).toLocaleDateString()}
**Recruiting Difficulty Index:** ${report.recruitingDifficultyScore.score}/100 (${report.recruitingDifficultyScore.band})
**Talent Availability Index:** ${report.talentAvailabilityScore.score}/100 (${report.talentAvailabilityScore.band})

---

## 1. EXECUTIVE SUMMARY & RECRUITING STRATEGY
${report.executiveSummary.executiveBriefNarrative}

### Key Market Observations:
${report.executiveSummary.keyFindings.map((f) => `- **${f.headline}**: ${f.detail}`).join('\n')}

---

## 2. TALENT SUPPLY FUNNEL
- **Total Addressable Pool:** ${report.talentSupply.addressable.count.toLocaleString()} profiles (${report.talentSupply.addressable.confidence} confidence)
- **Qualified Calibration:** ${report.talentSupply.highlyQualified.count.toLocaleString()} profiles (${report.talentSupply.highlyQualified.confidence} confidence)
- **Active Market Seekers:** ${report.talentSupply.active.count.toLocaleString()} profiles

---

## 3. COMPENSATION BENCHMARKING
- **25th Percentile:** $${(report.compensationIntelligence?.percentiles?.p25 ?? report.compensationIntelligence?.baseSalary?.p25 ?? 165000).toLocaleString()}
- **50th Percentile (Median):** $${(report.compensationIntelligence?.percentiles?.p50 ?? report.compensationIntelligence?.baseSalary?.p50 ?? 195000).toLocaleString()}
- **75th Percentile:** $${(report.compensationIntelligence?.percentiles?.p75 ?? report.compensationIntelligence?.baseSalary?.p75 ?? 235000).toLocaleString()}
- **90th Percentile (Top Tier):** $${(report.compensationIntelligence?.percentiles?.p90 ?? report.compensationIntelligence?.baseSalary?.p90 ?? 280000).toLocaleString()}
- **Target Budgeted Range:** $${report.input.compensationTarget?.min?.toLocaleString() || '180,000'} - $${report.input.compensationTarget?.max?.toLocaleString() || '240,000'}
- **Market Alignment:** ${report.compensationIntelligence?.budgetAlignment || report.compensationIntelligence?.marketPosition || 'At Market'}

---

## 4. TOP TARGET POACHING EMPLOYERS
${report.competitiveEmployerLandscape.slice(0, 8).map((c) => `### ${c.name} (${c.tier} - ${c.tierLabel})
- **Vulnerability / Poaching Angle:** ${c.poachingAngle}
- **Target Titles:** ${c.relevantTitles.join(', ')}
- **Key Skills:** ${c.relevantSkills.join(', ')}
- **Footprint:** ${c.geographicPresence}
`).join('\n')}

---

## 5. EXECUTIVE CLOSING STRATEGY
- **Closing Strategy:** ${report.executiveRecruitingBrief.closingStrategy}
- **Recommended Pitch Hooks:**
${report.candidateArchetypes.map((a) => `  - *${a.name} (${a.archetypeType})*: ${a.recommendedMessagingHook}`).join('\n')}

*Exported via TalentIQ Enterprise Intelligence Platform*
`;
  };

  // Generate CSV Data for Target Companies
  const generateCompanyCSV = () => {
    const headers = ['Tier', 'Tier Label', 'Company Name', 'Hiring Activity', 'Poaching Vulnerability', 'Target Titles', 'Footprint'];
    const rows = report.competitiveEmployerLandscape.map((c) => [
      `"${c.tier}"`,
      `"${c.tierLabel}"`,
      `"${c.name}"`,
      `"${c.hiringActivity}"`,
      `"${c.poachingAngle.replace(/"/g, '""')}"`,
      `"${c.relevantTitles.join('; ')}"`,
      `"${c.geographicPresence}"`,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  // Generate self-contained standalone HTML Brief for pristine PDF printing
  const generateExecutiveBriefHTML = () => {
    const p25 = (report.compensationIntelligence?.percentiles?.p25 ?? report.compensationIntelligence?.baseSalary?.p25 ?? 165000).toLocaleString();
    const p50 = (report.compensationIntelligence?.percentiles?.p50 ?? report.compensationIntelligence?.baseSalary?.p50 ?? 195000).toLocaleString();
    const p75 = (report.compensationIntelligence?.percentiles?.p75 ?? report.compensationIntelligence?.baseSalary?.p75 ?? 235000).toLocaleString();
    const p90 = (report.compensationIntelligence?.percentiles?.p90 ?? report.compensationIntelligence?.baseSalary?.p90 ?? 280000).toLocaleString();
    const budgetAlign = report.compensationIntelligence?.budgetAlignment || report.compensationIntelligence?.marketPosition || 'At Market';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Executive Recruiting Brief - ${roleTitle}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm 15mm 15mm 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      line-height: 1.45;
      font-size: 13px;
    }
    .header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 14px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: #e0f2fe;
      color: #0369a1;
      margin-bottom: 4px;
    }
    h1 {
      margin: 2px 0 6px 0;
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
    }
    .meta {
      font-size: 11px;
      color: #64748b;
    }
    .scores {
      display: flex;
      gap: 10px;
    }
    .score-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 12px;
      text-align: right;
      min-width: 120px;
    }
    .score-label {
      font-size: 9px;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
    }
    .score-val {
      font-size: 16px;
      font-weight: 800;
      margin-top: 2px;
    }
    .score-red { color: #e11d48; }
    .score-amber { color: #d97706; }
    .section {
      margin-bottom: 16px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0369a1;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }
    .narrative-box {
      background: #f8fafc;
      border-left: 3px solid #0284c7;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      font-size: 12px;
      color: #334155;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 14px;
    }
    .kpi {
      background: #f1f5f9;
      border-radius: 6px;
      padding: 8px 10px;
    }
    .kpi-lbl { font-size: 10px; color: #64748b; font-weight: 600; }
    .kpi-num { font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 2px; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      margin-top: 6px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 6px 8px;
      text-align: left;
    }
    th {
      background: #f8fafc;
      font-weight: 700;
      color: #475569;
    }
    .company-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    .company-card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 10px;
      background: #ffffff;
    }
    .comp-name { font-weight: 700; font-size: 12px; color: #0f172a; }
    .comp-hook { font-size: 10.5px; color: #475569; margin-top: 3px; }
    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      font-size: 10px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="badge">Executive Recruiting Intelligence Brief</div>
      <h1>${roleTitle}</h1>
      <div class="meta">
        <strong>${metro}</strong> (${workModel}) • Seniority: <strong>${report.input.seniority.value}</strong> • Generated: <strong>${new Date(report.createdAt).toLocaleDateString()}</strong>
      </div>
    </div>
    <div class="scores">
      <div class="score-card">
        <div class="score-label">Difficulty Index</div>
        <div class="score-val score-red">${report.recruitingDifficultyScore.score}/100</div>
      </div>
      <div class="score-card">
        <div class="score-label">Talent Availability</div>
        <div class="score-val score-amber">${report.talentAvailabilityScore.score}/100</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">1. Executive Strategy & Market Assessment</div>
    <div class="narrative-box">
      ${report.executiveSummary.executiveBriefNarrative}
    </div>
  </div>

  <div class="grid-4">
    <div class="kpi">
      <div class="kpi-lbl">Addressable Pool</div>
      <div class="kpi-num">${report.talentSupply.addressable.count.toLocaleString()}</div>
    </div>
    <div class="kpi">
      <div class="kpi-lbl">Median Comp (P50)</div>
      <div class="kpi-num">$${p50}</div>
    </div>
    <div class="kpi">
      <div class="kpi-lbl">Est. Time to Hire</div>
      <div class="kpi-num">${report.executiveRecruitingBrief.timeToHireEstimate}</div>
    </div>
    <div class="kpi">
      <div class="kpi-lbl">Budget Alignment</div>
      <div class="kpi-num" style="font-size: 12px; margin-top: 4px;">${budgetAlign.split(' ')[0]}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">2. Compensation Benchmarks (Annual USD)</div>
    <table>
      <thead>
        <tr>
          <th>Percentile</th>
          <th>Total Target Compensation</th>
          <th>Budget Alignment Status</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>25th Percentile (P25)</td><td><strong>$${p25}</strong></td><td>Baseline entry band</td></tr>
        <tr><td>50th Percentile (Median)</td><td><strong>$${p50}</strong></td><td>National calibrated median</td></tr>
        <tr><td>75th Percentile (P75)</td><td><strong>$${p75}</strong></td><td>Competitive tier closing band</td></tr>
        <tr><td>90th Percentile (P90)</td><td><strong>$${p90}</strong></td><td>Hyperscaler & Top Tier</td></tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">3. Priority Target Poaching Employers</div>
    <div class="company-grid">
      ${report.competitiveEmployerLandscape.slice(0, 4).map((c) => `
        <div class="company-card">
          <div class="comp-name">${c.name} <span style="font-size:9px; color:#64748b;">(${c.tier})</span></div>
          <div class="comp-hook"><strong>Angle:</strong> ${c.poachingAngle}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">4. Recommended Closing Playbook</div>
    <div class="narrative-box" style="border-left-color: #10b981;">
      <strong>Strategy:</strong> ${report.executiveRecruitingBrief.closingStrategy}
    </div>
  </div>

  <div class="footer">
    <span>TalentIQ Enterprise Intelligence Platform</span>
    <span>Confidential — For Internal Executive & TA Leadership Use Only</span>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>`;
  };

  // Trigger dedicated Clean PDF Download window
  const handleDownloadPDF = () => {
    const htmlContent = generateExecutiveBriefHTML();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      // Fallback if popup blocked: print current view
      window.print();
    }
  };

  // Download Handler for file downloads
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div
      id="export-center-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="export-center-modal-content"
        className="glass-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                Talent Intelligence Distribution Center
              </div>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Export & Share Market Map
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlighted Executive Brief PDF Download Banner */}
        <div className="p-4 bg-gradient-to-r from-cyan-950/80 to-indigo-950/80 border border-cyan-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 glow-subtle">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
              <FileDown className="w-4 h-4 text-cyan-400" />
              <span>Executive Briefing Document (PDF)</span>
            </div>
            <p className="text-xs text-slate-300">
              Formatted C-Suite one-pager with calibrated compensation tables, target company hooks, and closing playbook.
            </p>
          </div>

          <button
            id="btn-download-executive-pdf"
            onClick={handleDownloadPDF}
            className="px-5 py-2.5 accent-gradient text-white rounded-xl text-xs font-bold font-mono transition-all shadow-lg glow flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Export Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. PDF / Print View */}
          <div className="glass-card-interactive rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Executive PDF / Print</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Print-formatted executive briefing deck for Hiring Managers & VPs.
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="w-full py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Brief</span>
            </button>
          </div>

          {/* 2. Markdown Dossier */}
          <div className="glass-card-interactive rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Markdown Dossier (.md)</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Formatted for Notion, Jira, Slack, or Google Docs sharing.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  downloadFile(
                    generateMarkdownDossier(),
                    `TalentMap_${roleTitle.replace(/\s+/g, '_')}_${metro}.md`,
                    'text/markdown'
                  )
                }
                className="flex-1 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .MD</span>
              </button>
              <button
                onClick={() => handleCopy(generateMarkdownDossier(), 'md')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                title="Copy Markdown"
              >
                {copiedFormat === 'md' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 3. CSV Target Company Matrix */}
          <div className="glass-card-interactive rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Company Matrix CSV (.csv)</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Structured target company poaching list ready for Excel or Sheets.
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                downloadFile(
                  generateCompanyCSV(),
                  `TargetCompanies_${roleTitle.replace(/\s+/g, '_')}.csv`,
                  'text/csv'
                )
              }
              className="w-full py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Spreadsheet</span>
            </button>
          </div>

          {/* 4. Full JSON Bundle */}
          <div className="glass-card-interactive rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-300">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Full JSON Package (.json)</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Complete 23-part raw data payload for custom ATS/CRM integrations.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  downloadFile(
                    JSON.stringify(report, null, 2),
                    `TalentMap_${report.id}.json`,
                    'application/json'
                  )
                }
                className="flex-1 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download JSON</span>
              </button>
              <button
                onClick={() => handleCopy(JSON.stringify(report, null, 2), 'json')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                title="Copy JSON"
              >
                {copiedFormat === 'json' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Clipboard Summary */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-bold text-white block">Fast Slack / Email Executive Summary</span>
            <span className="text-slate-400 text-[11px]">Copy a high-impact 4-bullet executive snapshot to your clipboard.</span>
          </div>
          <button
            onClick={() =>
              handleCopy(
                `*Talent Intelligence Briefing: ${roleTitle} (${metro})*\n• Recruiting Difficulty: ${report.recruitingDifficultyScore.score}/100 (${report.recruitingDifficultyScore.band})\n• Addressable Supply: ${report.talentSupply.addressable.count.toLocaleString()} profiles\n• Median Compensation: $${(report.compensationIntelligence?.percentiles?.p50 ?? report.compensationIntelligence?.baseSalary?.p50 ?? 195000).toLocaleString()}\n• Top Poaching Targets: ${report.competitiveEmployerLandscape.slice(0, 4).map((c) => c.name).join(', ')}\n• Closing Strategy: ${report.executiveRecruitingBrief.closingStrategy}`,
                'slack'
              )
            }
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            {copiedFormat === 'slack' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFormat === 'slack' ? 'Copied Snapshot' : 'Copy Snapshot'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
