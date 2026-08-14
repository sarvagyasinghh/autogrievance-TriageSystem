export type CategoryType = 'academic' | 'facilities' | 'financial' | 'social' | 'cultural' | 'housing';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Security Threat';

export type GrievanceStatus = 
  | 'Pending Review'
  | 'Escalated to Police'
  | 'Recalled from Police'
  | 'Re-Routed'
  | 'Under Investigation'
  | 'Resolved'
  | 'Dismissed';

export interface TimelineEvent {
  id: string;
  time: string;
  actor: string;
  action: string;
  note?: string;
  isPolice?: boolean;
  isBias?: boolean;
  isResolved?: boolean;
}

export interface Grievance {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  department: string;
  originalTargetDept: string;
  urgencyScore: number; // 0 to 100
  priority: PriorityLevel;
  status: GrievanceStatus;
  sentiment: 'Extremely Distressed' | 'Distressed' | 'Negative' | 'Neutral' | 'Frustrated' | 'Constructive';
  sentimentBreakdown: { negative: number; neutral: number; positive: number };
  submittedAt: string;
  anonymous: boolean;
  submitterName?: string;
  studentGroup: string;
  isMinorityAffiliation: boolean;
  isMisclassifiedBias: boolean;
  triggerKeywords: string[];
  biasExplanation?: string;
  recalledAt?: string;
  recalledBy?: string;
  timeline: TimelineEvent[];
  evidenceFiles?: string[];
  courseCode?: string;
  location?: string;
}

export interface BiasModelConfig {
  policeEscalationThreshold: number; // e.g., 85
  semanticBiasFilter: boolean;
  culturalLexiconWhitelist: boolean;
  humanInTheLoopCircuitBreaker: boolean;
  activeDebiasingMode: 'legacy_uncalibrated' | 'mitigated_v2' | 'fairness_active';
  demographicDisparityScore: number; // e.g. 4.8x before, 1.0x after
  falsePositiveRate: number; // e.g. 78% before, 2% after
}

export interface StudentUnionDemand {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_review' | 'satisfied';
  actionKey: string;
}

export interface TriageAnalytics {
  totalItems: number;
  pendingProcessing: number;
  highUrgency: number;
  policeEscalations: number;
  recalledCount: number;
  biasAlertCount: number;
  avgWaitTime: string;
}
