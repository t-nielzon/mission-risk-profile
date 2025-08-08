// Core types for the Mission Risk Profile application

export interface MissionDetails {
  callsign: string;
  pic_name: string;
  cp_name: string;
  ac_nr: string;
  lesson: string;
  area_assignment: string;
  date_time: string;
}

export type RiskLevel = 0 | 1 | 2;

export interface QuestionAnswer {
  questionId: string;
  answered: boolean;
  skipped: boolean;
  picAnswer?: RiskLevel;
  cpAnswer?: RiskLevel;
  sharedAnswer?: RiskLevel;
  customText?: string;
  overrideScore?: RiskLevel;
}

export interface CustomHazard {
  description: string;
  riskLevel: RiskLevel;
}

export interface QuestionDefinition {
  id: string;
  category: "mission" | "environment" | "human_factor" | "aircraft";
  question: string;
  type: "individual" | "shared" | "custom";
  options: {
    green: string;
    yellow?: string;
    red?: string;
  };
  placeholders: {
    pic?: string;
    cp?: string;
    shared?: string;
  };
}

export interface MRPScores {
  pic: number;
  cp: number;
}

export type MDALevel = "PIC" | "SUP" | "SC" | "CMDT";

export interface MRPResults {
  scores: MRPScores;
  mda: {
    pic: MDALevel;
    cp: MDALevel;
  };
}

export interface MRPFormData {
  missionDetails: MissionDetails;
  answers: Record<string, QuestionAnswer>;
  customHazards: {
    mission?: CustomHazard;
    environment?: CustomHazard;
    aircraft?: CustomHazard;
    pic_other?: CustomHazard;
    cp_other?: CustomHazard;
  };
  comments: string;
}

export interface NavigationState {
  currentStep: number;
  totalSteps: number;
  currentCategory: string;
  completedSteps: Set<number>;
  skippedSteps: Set<number>;
}

export interface EmailData {
  picEmail?: string;
  userEmail?: string;
  sendEmails: boolean;
}

