import { TalentMapInput, TalentMapReport, TrackedCandidate } from '../types';

export interface IntakeDraftState {
  rawText: string;
  fileName: string | null;
  formData: TalentMapInput;
  currentStep: 1 | 2;
  fileExtractStatus?: string | null;
  lastUpdated: string;
}

export interface NavigationState {
  activeTab: 'intake' | 'dashboard' | 'insights' | 'report' | 'sourcing' | 'executive';
  sourcingSubTab: 'search' | 'tracker' | 'outreach';
  lastUpdated: string;
}

export interface AutoSaveMeta {
  lastSaved: string;
  saveCount: number;
  autoSaveEnabled: boolean;
}

const STORAGE_KEYS = {
  REPORT: 'talentiq_autosave_report',
  INTAKE: 'talentiq_autosave_intake',
  NAVIGATION: 'talentiq_autosave_navigation',
  META: 'talentiq_autosave_meta',
  CANDIDATES_PREFIX: 'talentiq_candidates_',
};

/**
 * Save Active Talent Report
 */
export function saveReportToStorage(report: TalentMapReport | null): void {
  if (typeof window === 'undefined' || !report) return;
  try {
    localStorage.setItem(STORAGE_KEYS.REPORT, JSON.stringify(report));
    recordSaveAction();
  } catch (err) {
    console.warn('Failed to auto-save report to localStorage:', err);
  }
}

/**
 * Load Active Talent Report
 */
export function loadReportFromStorage(): TalentMapReport | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORT);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse saved report from localStorage:', err);
    return null;
  }
}

/**
 * Save Intake Draft
 */
export function saveIntakeDraftToStorage(draft: IntakeDraftState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.INTAKE, JSON.stringify(draft));
    recordSaveAction();
  } catch (err) {
    console.warn('Failed to auto-save intake draft to localStorage:', err);
  }
}

/**
 * Load Intake Draft
 */
export function loadIntakeDraftFromStorage(): IntakeDraftState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INTAKE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse saved intake draft:', err);
    return null;
  }
}

/**
 * Save Navigation State
 */
export function saveNavigationStateToStorage(nav: NavigationState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.NAVIGATION, JSON.stringify(nav));
  } catch (err) {
    console.warn('Failed to save navigation state:', err);
  }
}

/**
 * Load Navigation State
 */
export function loadNavigationStateFromStorage(): NavigationState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NAVIGATION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

/**
 * Save Candidate Tracker State for specific report
 */
export function saveCandidatesToStorage(reportId: string, candidates: TrackedCandidate[]): void {
  if (typeof window === 'undefined' || !reportId) return;
  try {
    localStorage.setItem(`${STORAGE_KEYS.CANDIDATES_PREFIX}${reportId}`, JSON.stringify(candidates));
    recordSaveAction();
  } catch (err) {
    console.warn('Failed to save candidates to localStorage:', err);
  }
}

/**
 * Load Candidate Tracker State for specific report
 */
export function loadCandidatesFromStorage(reportId: string): TrackedCandidate[] | null {
  if (typeof window === 'undefined' || !reportId) return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.CANDIDATES_PREFIX}${reportId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

/**
 * Record AutoSave Meta event & dispatch window event for real-time UI updates
 */
function recordSaveAction(): void {
  try {
    const prevMeta = getAutoSaveMeta();
    const newMeta: AutoSaveMeta = {
      lastSaved: new Date().toISOString(),
      saveCount: (prevMeta?.saveCount || 0) + 1,
      autoSaveEnabled: prevMeta?.autoSaveEnabled ?? true,
    };
    localStorage.setItem(STORAGE_KEYS.META, JSON.stringify(newMeta));
    window.dispatchEvent(new CustomEvent('talentiq:autosave', { detail: newMeta }));
  } catch (e) {
    // ignore
  }
}

/**
 * Get AutoSave Metadata
 */
export function getAutoSaveMeta(): AutoSaveMeta {
  if (typeof window === 'undefined') {
    return { lastSaved: new Date().toISOString(), saveCount: 0, autoSaveEnabled: true };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.META);
    if (!raw) return { lastSaved: new Date().toISOString(), saveCount: 0, autoSaveEnabled: true };
    return JSON.parse(raw);
  } catch {
    return { lastSaved: new Date().toISOString(), saveCount: 0, autoSaveEnabled: true };
  }
}

/**
 * Clear All Stored TalentIQ Data
 */
export function clearAllAutoSavedData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.REPORT);
    localStorage.removeItem(STORAGE_KEYS.INTAKE);
    localStorage.removeItem(STORAGE_KEYS.NAVIGATION);
    // Remove candidate keys
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith(STORAGE_KEYS.CANDIDATES_PREFIX)) {
        localStorage.removeItem(k);
      }
    });
    recordSaveAction();
  } catch (err) {
    console.error('Failed to clear auto-saved data:', err);
  }
}
