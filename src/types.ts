export interface ProfileData {
  id: string;
  name: string;
  titles: string[];
  bio: string;
  shortBio: string;
  avatarUrl: string;
  cvUrl: string;
  cvFileName: string;
  email: string;
  phone: string;
  location: string;
  university: string;
  major: string;
  statusText: string;
  socials: {
    github: string;
    linkedin: string;
    instagram: string;
    figma: string;
    twitter?: string;
  };
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string; // e.g., 'Web App', 'UI/UX', 'Laravel', 'React'
  shortDesc: string;
  description: string;
  thumbnail: string;
  images: string[];
  techStack: string[];
  githubUrl: string;
  demoUrl: string;
  status: 'Completed' | 'Ongoing';
  order: number;
  featured: boolean;
  createdAt: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools & Design' | 'Other';
  percentage: number;
  iconName: string; // e.g. 'Code', 'Database', 'Layout', 'Figma', etc.
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  order: number;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  type: 'Full-time' | 'Part-time' | 'Freelance' | 'Internship' | 'Organization' | 'Education';
  period: string; // e.g., '2023 - Present'
  location: string;
  description: string;
  skillsUsed: string[];
  order: number;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  imageUrl: string;
  verifyUrl?: string;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'Super Admin' | 'Admin';
  avatarUrl: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'skill' | 'certificate' | 'message' | 'profile';
  timestamp: string;
}

export interface WebsiteStats {
  totalProjects: number;
  totalSkills: number;
  totalCertificates: number;
  totalMessages: number;
  unreadMessages: number;
  totalVisitors: number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: ToastType;
}
