import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Database,
  Trash2,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { getAutoSaveMeta, clearAllAutoSavedData, AutoSaveMeta } from '../services/storageService';

interface AutoSaveIndicatorProps {
  onManualSave?: () => void;
  onResetWorkspace?: () => void;
  isSaving?: boolean;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  onManualSave,
  onResetWorkspace,
  isSaving = false,
}) => {
  const [meta, setMeta] = useState<AutoSaveMeta>(() => getAutoSaveMeta());
  const [isOpen, setIsOpen] = useState(false);
  const [timeAgoText, setTimeAgoText] = useState('just now');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update time ago string
  const updateRelativeTime = (isoString: string) => {
    if (!isoString) return 'just now';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 5) return 'just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    return `${diffHours}h ago`;
  };

  useEffect(() => {
    const handleAutoSaveEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AutoSaveMeta>;
      if (customEvent.detail) {
        setMeta(customEvent.detail);
        setTimeAgoText('just now');
      }
    };

    window.addEventListener('talentiq:autosave', handleAutoSaveEvent);

    const interval = setInterval(() => {
      setTimeAgoText(updateRelativeTime(meta.lastSaved));
    }, 5000);

    return () => {
      window.removeEventListener('talentiq:autosave', handleAutoSaveEvent);
      clearInterval(interval);
    };
  }, [meta.lastSaved]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowConfirmReset(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleManualSaveTrigger = () => {
    if (onManualSave) {
      onManualSave();
    }
    setMeta(getAutoSaveMeta());
    setTimeAgoText('just now');
  };

  const handleConfirmReset = () => {
    clearAllAutoSavedData();
    setShowConfirmReset(false);
    setIsOpen(false);
    if (onResetWorkspace) {
      onResetWorkspace();
    }
  };

  const formattedDate = meta.lastSaved
    ? new Date(meta.lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Recently';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        id="btn-autosave-status"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-xs font-mono transition-all text-slate-300 hover:text-white cursor-pointer group shadow-xs"
        title="Auto-Save Active (localStorage persistence)"
      >
        <span className="relative flex h-2 w-2">
          {isSaving ? (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          ) : (
            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isSaving ? 'bg-cyan-400' : 'bg-emerald-400'
            }`}
          ></span>
        </span>

        <span className="hidden sm:inline text-[11px] text-slate-400 font-medium">
          {isSaving ? (
            <span className="text-cyan-300 font-mono">Auto-saving...</span>
          ) : (
            <>
              Auto-saved <span className="text-emerald-400 font-semibold">{timeAgoText}</span>
            </>
          )}
        </span>

        <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-card border border-slate-700/90 shadow-2xl p-4 z-50 animate-fadeIn text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white text-xs">Local Auto-Save</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Active
            </span>
          </div>

          <div className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
            <div className="flex items-center justify-between text-slate-400">
              <span>Last Snapshot:</span>
              <span className="text-slate-200 font-mono font-semibold">{formattedDate}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Saved Items:</span>
              <span className="text-cyan-300 font-mono">Report, Intake, Candidates</span>
            </div>
            <p className="text-[10px] text-slate-400 pt-1 leading-normal">
              Your intake specs, talent report calculations, and candidate pipeline changes are securely cached in your browser so you will never lose progress on page refresh.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={handleManualSaveTrigger}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-indigo-300" />
              <span>Force Save Now</span>
            </button>

            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full flex items-center justify-center gap-1.5 py-1 px-2 text-[11px] text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3 text-slate-500 group-hover:text-rose-400" />
                <span>Clear Auto-Saved State</span>
              </button>
            ) : (
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                <p className="text-[10px] text-rose-300 text-center font-medium">
                  Reset local cache and reload fresh template?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleConfirmReset}
                    className="flex-1 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold transition-all cursor-pointer"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
