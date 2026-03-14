export interface AnalysisResult {
  isBlurry: boolean;
  blurReason?: string;
  isHPProduct: boolean;
  matchesModel: boolean;
  mismatchReason?: string;
  errors: {
    type: string;
    description: string;
    repairCost: number;
    imageIndex: number;
    coordinates: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }[];
  overallHealth: "Excellent" | "Good" | "Fair" | "Poor";
  summary: string;
  totalRepairCost: number;
  estimatedResaleValue: number;
  originalPrice: number;
  estimatedRemainingLifeYears: number;
  recommendation: {
    action: "Repair" | "Sell As-Is" | "Recycle";
    reasoning: string;
  };
}

export interface SitePrintAnalysisResult {
  isBlurry: boolean;
  blurReason?: string;
  isHPProduct: boolean;
  componentType: "Inkjet" | "Unknown";
  condition: "Excellent" | "Good" | "Fair" | "Worn" | "Critical";
  wearLevel: number;
  estimatedRemainingLifeYears: number;
  repairNeeded: boolean;
  repairTimeline?: string;
  devaluationPercentage: number;
  summary: string;
  manualRepairRecommendations: string[];
  detectedIssues: {
    type: string;
    description: string;
    severity: "Low" | "Medium" | "High";
  }[];
}

export interface User {
  id: number;
  email: string;
  name: string;
  country: string;
  role: string;
}

export interface UserProfile extends User {}

export interface TechnicianStat {
  model: string;
  results: AnalysisResult;
  country: string;
}

export interface FleetDevice {
  id: string;
  name: string;
  type: 'laptop' | 'siteprint';
  health: number;
  lastInspection: string;
  nextService: string;
  status: 'online' | 'offline' | 'maintenance';
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'ai';
  content: string;
}
