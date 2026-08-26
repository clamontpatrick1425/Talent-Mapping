export type ConfidenceLevel = 'verified' | 'estimated' | 'inferred' | 'unknown';

export interface ConfValue<T> {
  value: T;
  confidence: ConfidenceLevel;
  source?: string;
  note?: string;
}

export type SeniorityLevel =
  | 'ENTRY'
  | 'MID'
  | 'SENIOR'
  | 'STAFF'
  | 'PRINCIPAL'
  | 'DIRECTOR'
  | 'VP'
  | 'EXECUTIVE';

export type WorkModel = 'REMOTE' | 'HYBRID' | 'ON-SITE';
export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TalentMapInput {
  role: ConfValue<string>;
  geography: {
    location: string;
    radiusMiles: number;
    confidence: ConfidenceLevel;
  };
  seniority: ConfValue<SeniorityLevel>;
  industry: ConfValue<string>;
  companyType: ConfValue<string[]>;
  skills: {
    required: ConfValue<string[]>;
    preferred: ConfValue<string[]>;
  };
  technologies: ConfValue<string[]>;
  education: ConfValue<string>;
  yearsExperience: {
    min: number;
    max: number;
    confidence: ConfidenceLevel;
  };
  workModel: ConfValue<WorkModel>;
  compensationTarget: {
    min: number;
    max: number;
    currency: string;
    confidence: ConfidenceLevel;
  };
  targetCompanies: ConfValue<string[]>;
  excludedCompanies: ConfValue<string[]>;
  hiringUrgency: ConfValue<UrgencyLevel>;
  hiringVolume: ConfValue<number>;
  additionalNotes?: string;
}

export interface JDSourceInfo {
  method: 'upload' | 'manual' | 'preset';
  fileName?: string;
  rawText?: string;
  presetId?: string;
}

export interface RoleDecomposition {
  coreJobFunction: string;
  primaryResponsibilities: string[];
  technicalSkillRequirements: {
    mustHave: string[];
    stronglyPreferred: string[];
    niceToHave: string[];
    emerging: string[];
    transferable: string[];
  };
  technologyStack: {
    languages: string[];
    cloudPlatforms: string[];
    databases: string[];
    frameworks: string[];
    infrastructure: string[];
    securityTech?: string[];
    aiMlTech?: string[];
    dataTech?: string[];
    devEnvironments?: string[];
    enterprisePlatforms?: string[];
  };
  domainExpertise: string[];
  leadershipRequirements: string;
}

export interface TalentProfileMatrixItem {
  category: string;
  requirement: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  confidence: ConfidenceLevel;
  notes?: string;
}

export interface GeographicTalentMarket {
  metroName: string;
  estimatedTalentPopulation: number;
  workforceSize: number;
  concentrationDensity: 'High' | 'Moderate' | 'Low';
  growthTrend: 'Rapid Growth' | 'Moderate Growth' | 'Stable' | 'Contracting';
  majorEmployers: string[];
  relevantIndustries: string[];
  universityPipeline: string[];
  remoteTalentAvailability: 'High' | 'Moderate' | 'Low';
  commutingRadiusMiles: number;
  adjacentMetros: Array<{ name: string; distanceMiles: number; talentDensity: string }>;
  relocationPotential: 'Favorable' | 'Neutral' | 'Challenging';
  hybridMarketOptions: string;
  marketConfidence: ConfidenceLevel;
}

export interface TalentSupplyFunnel {
  totalPotential: { count: number; confidence: ConfidenceLevel; condition: string };
  addressable: { count: number; confidence: ConfidenceLevel; condition: string };
  highlyQualified: { count: number; confidence: ConfidenceLevel; condition: string };
  active: { count: number; confidence: ConfidenceLevel; condition: string };
  passive: { count: number; confidence: ConfidenceLevel; condition: string };
  emerging: { count: number; confidence: ConfidenceLevel; condition: string };
}

export type AvailabilityBand =
  | 'Very High Availability'
  | 'High Availability'
  | 'Moderate Availability'
  | 'Low Availability'
  | 'Extremely Scarce';

export interface ScoreFactor {
  factor: string;
  impact: 'positive' | 'neutral' | 'negative';
  weight: number;
  description: string;
}

export interface TalentAvailabilityScoreData {
  score: number; // 0-100
  band: AvailabilityBand;
  factors: ScoreFactor[];
  summary: string;
}

export type FitRank = 'Excellent Fit' | 'Strong Fit' | 'Potential Fit' | 'Stretch Fit';

export interface SkillAdjacencyNode {
  skill: string;
  fit: FitRank;
  rationale: string;
  transitionDifficulty: 'Low' | 'Medium' | 'High';
  exampleProfiles: string[];
}

export interface SkillAdjacencyMapData {
  primarySkill: string;
  directAdjacent: SkillAdjacencyNode[];
  operationalAdjacent: SkillAdjacencyNode[];
  broaderTransferable: SkillAdjacencyNode[];
}

export interface SkillsMarketAnalysisData {
  coreSkills: Array<{ name: string; prevalence: string; notes: string }>;
  scarceSkills: Array<{ name: string; scarcityReason: string; marketScarcityRating: 'High' | 'Critical' }>;
  emergingSkills: Array<{ name: string; growthRate: string; adoptionTrend: string }>;
  adjacentSkills: Array<{ name: string; plausibleSubstituteFor: string; transferabilityRating: string }>;
  transferableSkills: Array<{ name: string; donorField: string; rampUpPeriod: string }>;
}

export interface EmployerLandscapeItem {
  id: string;
  name: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';
  tierLabel: string;
  workforceRelevance: 'Exact Skill Match' | 'Adjacent Talent' | 'Talent Incubator' | 'Emerging Competitor';
  hiringActivity: 'High' | 'Moderate' | 'Low' | 'Cooling' | 'Layoff Signals';
  relevantTitles: string[];
  relevantSkills: string[];
  geographicPresence: string;
  talentConcentration: 'High' | 'Moderate' | 'Dispersed';
  employerAttractiveness: 'Very High' | 'High' | 'Moderate' | 'Vulnerable to Poaching';
  recruitingDifficulty: 'Very Hard' | 'Hard' | 'Moderate' | 'Favorable Target';
  rationale: string;
  poachingAngle: string;
}

export interface TalentMovementData {
  feederCompanies: Array<{ name: string; talentFlow: string; rationale: string }>;
  destinationCompanies: Array<{ name: string; pullFactor: string }>;
  careerProgressionSteps: string[];
  industryMigrationPatterns: Array<{ from: string; to: string; driver: string }>;
  likelyExporters: string[];
  likelyImporters: string[];
  movementInsights: string[];
}

export interface TargetCompanyEntry {
  priority: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';
  company: string;
  talentRelevance: 'Very High' | 'High' | 'Moderate';
  whyTarget: string;
  estimatedTargetTalentPool: string;
  primaryLocations: string;
}

export interface TargetTitleEntry {
  title: string;
  rank: 'Primary' | 'Secondary' | 'Adjacent';
  rationale: string;
  booleanKeyword: string;
}

export interface CandidateArchetype {
  id: string;
  number: number;
  name: string;
  archetypeType: string;
  backgroundSummary: string;
  targetCompanies: string[];
  targetTitles: string[];
  keySkills: string[];
  likelyMotivations: string[];
  recruitingChallenges: string[];
  recommendedMessagingHook: string;
  sampleOutreachSnippet: string;
}

export interface CandidateSearchStrategyData {
  linkedinBoolean: Array<{ name: string; query: string; purpose: string }>;
  googleXray: Array<{ name: string; query: string; platform: string }>;
  githubSearch: Array<{ name: string; query: string; purpose: string }>;
  professionalCommunities: Array<{
    name: string;
    category: 'Conference' | 'Community' | 'Open Source' | 'Association' | 'Academic';
    relevance: string;
    url?: string;
  }>;
}

export interface TalentSegment {
  segmentId: 'Segment A' | 'Segment B' | 'Segment C' | 'Segment D';
  name: string;
  matchProfile: string;
  skillGapToClose: string;
  sourcingPriority: 'Immediate Target' | 'Strong Adjacent' | 'High-Potential' | 'Long-Term Pipeline';
  estimatedShare: number; // percentage (sum ~100)
  actionableTactic: string;
  conversionLikelihood: 'High' | 'Medium' | 'Low';
}

export interface CompensationIntelligenceData {
  currency: string;
  baseSalary: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  percentiles?: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  totalCashTarget: {
    min: number;
    target: number;
    max: number;
  };
  budgetAlignment?: string;
  equityNotes: string;
  geographicPremiums: Array<{ metro: string; adjustmentPct: number; notes: string }>;
  scarceSkillPremiums: Array<{ skill: string; premiumPercentage: number; description: string }>;
  marketPosition: 'Below Market' | 'At Market' | 'Above Market' | 'Upper Quartile';
  confidence: ConfidenceLevel;
  dataSource: string;
  salaryDisclaimer: string;
}

export type DifficultyBand = 'Easy' | 'Manageable' | 'Challenging' | 'Difficult' | 'Extremely Difficult';

export interface RecruitingDifficultyScoreData {
  score: number; // 0-100
  band: DifficultyBand;
  factors: Array<{ factor: string; scoreContribution: number; assessment: string }>;
  comparativeBenchmark: string;
  expectedTimeToFillDays: number;
}

export interface SourcingStrategyData {
  geographicStrategy: string;
  companyStrategy: string;
  skillStrategy: string;
  titleStrategy: string;
  candidateChannelStrategy: string;
  outreachCadence: string;
}

export interface RecruitingRecommendationItem {
  id: string;
  recommendation: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low Priority';
  category: 'Geographic' | 'Compensation' | 'Competitor Targeting' | 'Requirements' | 'Pipeline' | 'Engagement';
  targetStakeholder: 'Recruiter' | 'Hiring Manager' | 'TA Leadership';
  rationale: string;
  expectedImpact: string;
}

export interface ExecutiveTalentSummaryData {
  talentMarketSize: 'Large' | 'Moderate' | 'Small' | 'Niche / Specialized';
  talentAvailabilityBand: AvailabilityBand;
  recruitingDifficultyScore: number;
  recruitingDifficultyBand: DifficultyBand;
  top5ScarceSkills: string[];
  top10TargetCompanies: string[];
  best5AdjacentTalentPools: string[];
  recommendedGeography: string;
  compensationPosition: string;
  recommendedSourcingStrategySummary: string;
  expectedRecruitingRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  executiveBriefNarrative: string;
}

export interface DataQualityMetric {
  metricName: string;
  category: string;
  status: ConfidenceLevel;
  evidenceSource: string;
  verificationDate: string;
  notes: string;
}

export interface DataQualityReportData {
  verifiedCount: number;
  estimatedCount: number;
  inferredCount: number;
  unknownCount: number;
  dataPoints: DataQualityMetric[];
  methodologySummary: string;
  statutoryWarning: string;
}

export interface RisksAndConstraintsData {
  risks: Array<{
    risk: string;
    severity: 'High' | 'Medium' | 'Low';
    trigger: string;
    mitigationStrategy: string;
  }>;
  complianceNotes: string[];
}

export interface ExecutiveRecruitingBriefData {
  executiveHeader: string;
  keyTakeaways: string[];
  timeToHireEstimate: string;
  pipelineVelocityExpectation: string;
  recommendedHiringTeamPivots: string[];
  closingStrategy: string;
}

export interface TalentMapReport {
  id: string;
  createdAt: string;
  generatedBy: string;
  version: string;
  jdSource: JDSourceInfo;
  input: TalentMapInput;
  
  // 23 Parts Framework
  roleDecomposition: RoleDecomposition;
  talentProfile: {
    matrix: TalentProfileMatrixItem[];
    personaNarrative: string;
  };
  geographicMarket: GeographicTalentMarket;
  talentSupply: TalentSupplyFunnel;
  talentAvailabilityScore: TalentAvailabilityScoreData;
  skillsAnalysis: SkillsMarketAnalysisData;
  skillAdjacencyMap: SkillAdjacencyMapData;
  competitiveEmployerLandscape: EmployerLandscapeItem[];
  talentMovement: TalentMovementData;
  targetCompanies: TargetCompanyEntry[];
  targetTitles: TargetTitleEntry[];
  candidateArchetypes: CandidateArchetype[];
  sourcingStrings: CandidateSearchStrategyData;
  talentSegmentation: TalentSegment[];
  compensationIntelligence: CompensationIntelligenceData;
  recruitingDifficultyScore: RecruitingDifficultyScoreData;
  sourcingStrategy: SourcingStrategyData;
  recruitingRecommendations: RecruitingRecommendationItem[];
  executiveSummary: ExecutiveTalentSummaryData;
  dataQualityReport: DataQualityReportData;
  risksAndConstraints: RisksAndConstraintsData;
  executiveRecruitingBrief: ExecutiveRecruitingBriefData;
}

export type CandidatePipelineStage =
  | 'identified'
  | 'screening'
  | 'outreached'
  | 'interviewing'
  | 'offered'
  | 'archived';

export interface TrackedCandidate {
  id: string;
  name: string;
  currentTitle: string;
  currentCompany: string;
  location: string;
  matchScore: number;
  stage: CandidatePipelineStage;
  sourceType: 'LinkedIn Boolean' | 'Google X-Ray' | 'GitHub Search' | 'Target Company List' | 'Manual';
  labels: string[];
  skills: string[];
  notes?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  createdAt: string;
  lastUpdated: string;
}
