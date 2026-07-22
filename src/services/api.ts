import {
  ProfileData,
  ProjectItem,
  SkillItem,
  ExperienceItem,
  CertificateItem,
  ContactMessage,
  AdminUser,
  WebsiteStats,
  ActivityLog,
} from '../types';

import {
  initialProfile,
  initialProjects,
  initialSkills,
  initialExperiences,
  initialCertificates,
  initialMessages,
  initialWebsiteStats,
} from '../data/initialData';

const BASE_URL = '/api';

async function fetchJson<T>(url: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call failed for ${url}, using fallback if available:`, err);
    if (fallback !== undefined) return fallback;
    throw err;
  }
}

export const portfolioApi = {
  // Profile
  getProfile: async (): Promise<ProfileData> => {
    return fetchJson<ProfileData>(`${BASE_URL}/profile`, undefined, initialProfile);
  },
  updateProfile: async (data: Partial<ProfileData>): Promise<ProfileData> => {
    return fetchJson<ProfileData>(`${BASE_URL}/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Projects
  getProjects: async (): Promise<ProjectItem[]> => {
    return fetchJson<ProjectItem[]>(`${BASE_URL}/projects`, undefined, initialProjects);
  },
  createProject: async (data: Partial<ProjectItem>): Promise<ProjectItem> => {
    return fetchJson<ProjectItem>(`${BASE_URL}/projects`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateProject: async (id: string, data: Partial<ProjectItem>): Promise<ProjectItem> => {
    return fetchJson<ProjectItem>(`${BASE_URL}/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteProject: async (id: string): Promise<{ success: boolean; id: string }> => {
    return fetchJson<{ success: boolean; id: string }>(`${BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });
  },

  // Skills
  getSkills: async (): Promise<SkillItem[]> => {
    return fetchJson<SkillItem[]>(`${BASE_URL}/skills`, undefined, initialSkills);
  },
  createSkill: async (data: Partial<SkillItem>): Promise<SkillItem> => {
    return fetchJson<SkillItem>(`${BASE_URL}/skills`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateSkill: async (id: string, data: Partial<SkillItem>): Promise<SkillItem> => {
    return fetchJson<SkillItem>(`${BASE_URL}/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteSkill: async (id: string): Promise<{ success: boolean; id: string }> => {
    return fetchJson<{ success: boolean; id: string }>(`${BASE_URL}/skills/${id}`, {
      method: 'DELETE',
    });
  },

  // Experiences
  getExperiences: async (): Promise<ExperienceItem[]> => {
    return fetchJson<ExperienceItem[]>(`${BASE_URL}/experiences`, undefined, initialExperiences);
  },
  createExperience: async (data: Partial<ExperienceItem>): Promise<ExperienceItem> => {
    return fetchJson<ExperienceItem>(`${BASE_URL}/experiences`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateExperience: async (id: string, data: Partial<ExperienceItem>): Promise<ExperienceItem> => {
    return fetchJson<ExperienceItem>(`${BASE_URL}/experiences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteExperience: async (id: string): Promise<{ success: boolean; id: string }> => {
    return fetchJson<{ success: boolean; id: string }>(`${BASE_URL}/experiences/${id}`, {
      method: 'DELETE',
    });
  },

  // Certificates
  getCertificates: async (): Promise<CertificateItem[]> => {
    return fetchJson<CertificateItem[]>(`${BASE_URL}/certificates`, undefined, initialCertificates);
  },
  createCertificate: async (data: Partial<CertificateItem>): Promise<CertificateItem> => {
    return fetchJson<CertificateItem>(`${BASE_URL}/certificates`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateCertificate: async (id: string, data: Partial<CertificateItem>): Promise<CertificateItem> => {
    return fetchJson<CertificateItem>(`${BASE_URL}/certificates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteCertificate: async (id: string): Promise<{ success: boolean; id: string }> => {
    return fetchJson<{ success: boolean; id: string }>(`${BASE_URL}/certificates/${id}`, {
      method: 'DELETE',
    });
  },

  // Messages
  getMessages: async (): Promise<ContactMessage[]> => {
    return fetchJson<ContactMessage[]>(`${BASE_URL}/messages`, undefined, initialMessages);
  },
  sendMessage: async (data: { name: string; email: string; subject?: string; message: string }): Promise<ContactMessage> => {
    return fetchJson<ContactMessage>(`${BASE_URL}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  markMessageRead: async (id: string, read: boolean = true): Promise<ContactMessage> => {
    return fetchJson<ContactMessage>(`${BASE_URL}/messages/${id}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ read }),
    });
  },
  deleteMessage: async (id: string): Promise<{ success: boolean; id: string }> => {
    return fetchJson<{ success: boolean; id: string }>(`${BASE_URL}/messages/${id}`, {
      method: 'DELETE',
    });
  },

  // Overview Stats
  getOverviewStats: async (): Promise<{ stats: WebsiteStats; activityLogs: ActivityLog[] }> => {
    return fetchJson<{ stats: WebsiteStats; activityLogs: ActivityLog[] }>(`${BASE_URL}/stats`, undefined, {
      stats: initialWebsiteStats,
      activityLogs: [],
    });
  },

  recordVisitor: async (): Promise<{ totalVisitors: number }> => {
    return fetchJson<{ totalVisitors: number }>(`${BASE_URL}/stats/visitor`, {
      method: 'POST',
    }, { totalVisitors: initialWebsiteStats.totalVisitors });
  },

  // Auth
  loginAdmin: async (email: string, password: string): Promise<{ success: boolean; token?: string; user?: AdminUser; error?: string }> => {
    return fetchJson<{ success: boolean; token?: string; user?: AdminUser; error?: string }>(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  updateAdminPassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    return fetchJson<{ success: boolean; message?: string }>(`${BASE_URL}/auth/password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};
