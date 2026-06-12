/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HeroData {
  name: string;
  taglines: string[];
  bio: string;
  resumeUrl: string;
  availabilityStatus: boolean;
  socials: {
    github: string;
    linkedin: string;
    instagram: string;
    email: string;
    twitter: string;
  };
}

export interface TerminalLine {
  id?: string;
  command: string;
  output: string;
}

export interface StatCounter {
  id?: string;
  value: string;
  label: string;
}

export interface AboutData {
  bio: string;
  terminalLines: TerminalLine[];
  stats: StatCounter[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  category: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  order: number;
  createdAt?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  dateIssued: string;
  credentialId?: string;
  certificateUrl: string;
  order: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Freelance' | 'Contract';
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
  techUsed: string[];
  companyUrl: string;
  order: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  degreeAbbr: string;
  startYear: number;
  endYear: number;
  current: boolean;
  score: string;
  scoreType: 'CGPA' | 'Percentage' | 'GPA';
  coursework: string[];
  achievements: string[];
  order: number;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Dynamic markdown supporting remark-gfm
  tags: string[];
  category: string; // Dynamic categorization support
  status: 'published' | 'draft';
  readTime: number; // in minutes
  coverImage?: string;
  publishedAt: string;
  createdAt?: string;
}

export interface SiteMeta {
  pageTitle: string;
  metaDescription: string;
  faviconEmoji: string;
}

export interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromName: string;
  toEmail: string;
}

export interface SettingsData {
  leetcodeUsername: string;
  githubUsername: string;
  leetcodeCustomEasy?: number;
  leetcodeCustomMedium?: number;
  leetcodeCustomHard?: number;
  leetcodeCustomRanking?: string;
  leetcodeCustomStreak?: number;
  githubCustomRepos?: number;
  githubCustomFollowers?: number;
  githubCustomStars?: number;
  githubCustomCommits?: number;
  githubCustomLanguages?: string;
  sectionVisibility: {
    about: boolean;
    skills: boolean;
    projects: boolean;
    certifications: boolean;
    experience: boolean;
    education: boolean;
    leetcode: boolean;
    github: boolean;
    blog: boolean;
    contact: boolean;
  };
  siteMeta: SiteMeta;
  smtpConfig: SMTPConfig;
  socials: {
    github: string;
    linkedin: string;
    instagram: string;
    email: string;
    twitter: string;
  };
}

export interface LeetCodeStats {
  username: string;
  ranking: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  streak: number;
  maxStreak: number;
  badges: Array<{ name: string; iconUrl?: string }>;
  lastUpdated: string;
}

export interface GitHubStats {
  username: string;
  publicRepos: number;
  followers: number;
  stars: number;
  commitsThisYear: number;
  topLanguages: Array<{ name: string; percentage: number }>;
  lastUpdated: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalCertifications: number;
  publishedPosts: number;
  draftPosts: number;
  skillsCount: number;
}
