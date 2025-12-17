
export enum UserRole {
  ALUMNI = 'ALUMNI',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  CREATOR = 'CREATOR' // New Role
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  imageUrl?: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  rating: number; // 1-5
  category: 'Bug' | 'Feature' | 'Content' | 'Other';
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  graduationYear?: number;
  department?: string;
  company?: string;
  jobTitle?: string;
  location?: string;
  skills: string[];
  certifications?: string[]; 
  projects?: Project[]; 
  bio: string;
  interests: string[];
  mentorshipTopics?: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    portfolio?: string;
  };
  privacySettings?: {
    showEmail: boolean;
    showCompany: boolean;
    showSocials: boolean;
  };
  preferences?: {
    analysisReminder?: boolean; 
  };
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: 'Webinar' | 'Reunion' | 'Workshop' | 'Networking';
  attendees: number;
  image: string;
  description: string;
  attendeeIds: string[];
}

export interface MentorshipMatch {
  mentorId: string;
  matchScore: number;
  reason: string;
  suggestedTopics: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Part-time' | 'Contract';
  postedDate: string;
  description: string;
  requirements: string[];
  postedByAlumniId?: string; 
  applicationUrl?: string;
  isAiGenerated?: boolean; // Track if created by AI
}

export interface JobMatch {
  jobId: string;
  matchScore: number;
  reason: string;
}

export interface EventMatch {
  eventId: string;
  matchScore: number;
  reason: string;
}

export interface StatMetric {
  label: string;
  value: string | number;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
}
