
export enum ViewType {
  DASHBOARD = 'dashboard',
  PROFILE = 'profile',
  CAREER_DISCOVERY = 'career_discovery',
  ROADMAP = 'roadmap',
  RESOURCES = 'resources',
  RESUME_ANALYZER = 'resume_analyzer',
  COMMUNICATION_LAB = 'communication_lab',
  MOCK_INTERVIEW = 'mock_interview'
}

export interface Skill {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
  category?: string;
}

export interface Certification {
  name: string;
  url?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  education: string;
  skills: Skill[];
  certifications: Certification[];
  interests: string[];
  preferredDomains: string[];
  profilePicture?: string;
  links: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

export interface CareerRoadmapStep {
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  resources: { name: string; url: string }[];
  milestone: string;
}

export interface ResumeAnalysisResult {
  score: number;
  missingSkills: string[];
  weakAreas: string[];
  recommendations: string[];
  linkedInTips: string[];
}

export interface InterviewQuestion {
  question: string;
  suggestedAnswerPoints: string[];
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  overallFeedback: string;
}
