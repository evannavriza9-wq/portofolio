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

import { db } from '../lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';

const BASE_URL = '/api';

// Helper for REST fallback
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

// Log activity into Firebase Firestore
async function logActivity(title: string, description: string, type: 'project' | 'skill' | 'certificate' | 'message' | 'profile') {
  try {
    const logId = 'act-' + Date.now();
    const log: ActivityLog = {
      id: logId,
      title,
      description,
      type,
      timestamp: 'Just now',
    };
    await setDoc(doc(db, 'activityLogs', logId), log);
  } catch (e) {
    console.warn('Failed to log activity to Firestore:', e);
  }
}

export const portfolioApi = {
  // ---------------- PROFILE ----------------
  getProfile: async (): Promise<ProfileData> => {
    try {
      const docRef = doc(db, 'profile', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as ProfileData;
      } else {
        // Seed initial profile to Firestore
        await setDoc(docRef, initialProfile);
        return initialProfile;
      }
    } catch (err) {
      console.warn('Firestore getProfile error, using REST API:', err);
      return fetchJson<ProfileData>(`${BASE_URL}/profile`, undefined, initialProfile);
    }
  },

  updateProfile: async (data: Partial<ProfileData>): Promise<ProfileData> => {
    try {
      const docRef = doc(db, 'profile', 'main');
      const currentSnap = await getDoc(docRef);
      const currentData = currentSnap.exists() ? (currentSnap.data() as ProfileData) : initialProfile;
      const updatedProfile: ProfileData = { ...currentData, ...data };
      await setDoc(docRef, updatedProfile, { merge: true });

      // Log activity & sync REST
      await logActivity('Profile Updated', 'Admin updated personal profile information', 'profile');
      fetchJson(`${BASE_URL}/profile`, { method: 'PUT', body: JSON.stringify(data) }).catch(() => {});

      return updatedProfile;
    } catch (err) {
      console.warn('Firestore updateProfile error, falling back to REST:', err);
      return fetchJson<ProfileData>(`${BASE_URL}/profile`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }
  },

  // ---------------- PROJECTS ----------------
  getProjects: async (): Promise<ProjectItem[]> => {
    try {
      const querySnap = await getDocs(collection(db, 'projects'));
      if (!querySnap.empty) {
        const list: ProjectItem[] = [];
        querySnap.forEach((d) => list.push(d.data() as ProjectItem));
        return list.sort((a, b) => (a.order || 0) - (b.order || 0));
      } else {
        // Seed initial projects
        for (const proj of initialProjects) {
          await setDoc(doc(db, 'projects', proj.id), proj);
        }
        return initialProjects;
      }
    } catch (err) {
      console.warn('Firestore getProjects error, using REST API:', err);
      return fetchJson<ProjectItem[]>(`${BASE_URL}/projects`, undefined, initialProjects);
    }
  },

  createProject: async (data: Partial<ProjectItem>): Promise<ProjectItem> => {
    const id = 'proj-' + Date.now();
    const newProject: ProjectItem = {
      id,
      title: data.title || 'New Project',
      category: data.category || 'Web App',
      shortDesc: data.shortDesc || '',
      description: data.description || '',
      thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      images: data.images || [],
      techStack: data.techStack || ['React', 'Tailwind CSS'],
      githubUrl: data.githubUrl || '',
      demoUrl: data.demoUrl || '',
      status: data.status || 'Completed',
      order: Date.now(),
      featured: data.featured || false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      await setDoc(doc(db, 'projects', id), newProject);
      await logActivity('Project Created', `Created project "${newProject.title}"`, 'project');
      fetchJson(`${BASE_URL}/projects`, { method: 'POST', body: JSON.stringify(data) }).catch(() => {});
      return newProject;
    } catch (err) {
      console.warn('Firestore createProject error, falling back to REST:', err);
      return fetchJson<ProjectItem>(`${BASE_URL}/projects`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  },

  updateProject: async (id: string, data: Partial<ProjectItem>): Promise<ProjectItem> => {
    try {
      const docRef = doc(db, 'projects', id);
      const snap = await getDoc(docRef);
      const current = snap.exists() ? (snap.data() as ProjectItem) : ({ id } as ProjectItem);
      const updated = { ...current, ...data };
      await setDoc(docRef, updated, { merge: true });

      await logActivity('Project Updated', `Updated project "${updated.title || id}"`, 'project');
      fetchJson(`${BASE_URL}/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }).catch(() => {});
      return updated;
    } catch (err) {
      console.warn('Firestore updateProject error, falling back to REST:', err);
      return fetchJson<ProjectItem>(`${BASE_URL}/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }
  },

  deleteProject: async (id: string): Promise<{ success: boolean; id: string }> => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      await logActivity('Project Deleted', `Deleted project ID: ${id}`, 'project');
      fetchJson(`${BASE_URL}/projects/${id}`, { method: 'DELETE' }).catch(() => {});
      return { success: true, id };
    } catch (err) {
      console.warn('Firestore deleteProject error, falling back to REST:', err);
      return fetchJson<{ success: boolean; id: string }>(`${BASE_URL}/projects/${id}`, {
        method: 'DELETE',
      });
    }
  },

  // ---------------- SKILLS ----------------
  getSkills: async (): Promise<SkillItem[]> => {
    try {
      const querySnap = await getDocs(collection(db, 'skills'));
      if (!querySnap.empty) {
        const list: SkillItem[] = [];
        querySnap.forEach((d) => list.push(d.data() as SkillItem));
        return list.sort((a, b) => (a.order || 0) - (b.order || 0));
      } else {
        for (const sk of initialSkills) {
          await setDoc(doc(db, 'skills', sk.id), sk);
        }
        return initialSkills;
      }
    } catch (err) {
      console.warn('Firestore getSkills error, using REST API:', err);
      return fetchJson<SkillItem[]>(`${BASE_URL}/skills`, undefined, initialSkills);
    }
  },

  createSkill: async (data: Partial<SkillItem>): Promise<SkillItem> => {
    const id = 'sk-' + Date.now();
    const newSkill: SkillItem = {
      id,
      name: data.name || 'New Skill',
      category: data.category || 'Other',
      percentage: Number(data.percentage) || 80,
      iconName: data.iconName || 'Code',
      proficiency: data.proficiency || 'Advanced',
      order: Date.now(),
    };

    try {
      await setDoc(doc(db, 'skills', id), newSkill);
      await logActivity('Skill Created', `Created skill "${newSkill.name}"`, 'skill');
      fetchJson(`${BASE_URL}/skills`, { method: 'POST', body: JSON.stringify(data) }).catch(() => {});
      return newSkill;
    } catch (err) {
      console.warn('Firestore createSkill error, falling back to REST:', err);
      return fetchJson<SkillItem>(`${BASE_URL}/skills`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  },

  updateSkill: async (id: string, data: Partial<SkillItem>): Promise<SkillItem> => {
    try {
      const docRef = doc(db, 'skills', id);
      const snap = await getDoc(docRef);
      const current = snap.exists() ? (snap.data() as SkillItem) : ({ id } as SkillItem);
      const updated = { ...current, ...data };
      await setDoc(docRef, updated, { merge: true });

      await logActivity('Skill Updated', `Updated skill "${updated.name || id}"`, 'skill');
      fetchJson(`${BASE_URL}/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }).catch(() => {});
      return updated;
    } catch (err) {
      console.warn('Firestore updateSkill error, falling back to REST:', err);
      return fetchJson<SkillItem>(`${BASE_URL}/skills/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }
  },

  deleteSkill: async (id: string): Promise<{ success: boolean; id: string }> => {
    try {
      await deleteDoc(doc(db, 'skills', id));
      await logActivity('Skill Deleted', `Deleted skill ID: ${id}`, 'skill');
      fetchJson(`${BASE_URL}/skills/${id}`, { method: 'DELETE' }).catch(() => {});
      return { success: true, id };
    } catch (err) {
      console.warn('Firestore deleteSkill error, falling back to REST:', err);
      return fetchJson<{ success: boolean; id: string }>(`${BASE_URL}/skills/${id}`, {
        method: 'DELETE',
      });
    }
  },

  // ---------------- EXPERIENCES ----------------
  getExperiences: async (): Promise<ExperienceItem[]> => {
    try {
      const querySnap = await getDocs(collection(db, 'experiences'));
      if (!querySnap.empty) {
        const list: ExperienceItem[] = [];
        querySnap.forEach((d) => list.push(d.data() as ExperienceItem));
        return list.sort((a, b) => (a.order || 0) - (b.order || 0));
      } else {
        for (const exp of initialExperiences) {
          await setDoc(doc(db, 'experiences', exp.id), exp);
        }
        return initialExperiences;
      }
    } catch (err) {
      console.warn('Firestore getExperiences error, using REST API:', err);
      return fetchJson<ExperienceItem[]>(`${BASE_URL}/experiences`, undefined, initialExperiences);
    }
  },

  createExperience: async (data: Partial<ExperienceItem>): Promise<ExperienceItem> => {
    const id = 'exp-' + Date.now();
    const newExp: ExperienceItem = {
      id,
      role: data.role || 'Software Engineer',
      organization: data.organization || 'Company',
      type: data.type || 'Internship',
      period: data.period || '2025 - 2026',
      location: data.location || 'Indonesia',
      description: data.description || '',
      skillsUsed: data.skillsUsed || [],
      order: Date.now(),
    };

    try {
      await setDoc(doc(db, 'experiences', id), newExp);
      await logActivity('Experience Created', `Added experience "${newExp.role} at ${newExp.organization}"`, 'profile');
      fetchJson(`${BASE_URL}/experiences`, { method: 'POST', body: JSON.stringify(data) }).catch(() => {});
      return newExp;
    } catch (err) {
      console.warn('Firestore createExperience error, falling back to REST:', err);
      return fetchJson<ExperienceItem>(`${BASE_URL}/experiences`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  },

  updateExperience: async (id: string, data: Partial<ExperienceItem>): Promise<ExperienceItem> => {
    try {
      const docRef = doc(db, 'experiences', id);
      const snap = await getDoc(docRef);
      const current = snap.exists() ? (snap.data() as ExperienceItem) : ({ id } as ExperienceItem);
      const updated = { ...current, ...data };
      await setDoc(docRef, updated, { merge: true });

      await logActivity('Experience Updated', `Updated experience "${updated.role || id}"`, 'profile');
      fetchJson(`${BASE_URL}/experiences/${id}`, { method: 'PUT', body: JSON.stringify(data) }).catch(() => {});
      return updated;
    } catch (err) {
      console.warn('Firestore updateExperience error, falling back to REST:', err);
      return fetchJson<ExperienceItem>(`${BASE_URL}/experiences/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }
  },

  deleteExperience: async (id: string): Promise<{ success: boolean; id: string }> => {
    try {
      await deleteDoc(doc(db, 'experiences', id));
      await logActivity('Experience Deleted', `Deleted experience ID: ${id}`, 'profile');
      fetchJson(`${BASE_URL}/experiences/${id}`, { method: 'DELETE' }).catch(() => {});
      return { success: true, id };
    } catch (err) {
      console.warn('Firestore deleteExperience error, falling back to REST:', err);
      return fetchJson<{ success: boolean; id: string }>(`${BASE_URL}/experiences/${id}`, {
        method: 'DELETE',
      });
    }
  },

  // ---------------- CERTIFICATES ----------------
  getCertificates: async (): Promise<CertificateItem[]> => {
    try {
      const querySnap = await getDocs(collection(db, 'certificates'));
      if (!querySnap.empty) {
        const list: CertificateItem[] = [];
        querySnap.forEach((d) => list.push(d.data() as CertificateItem));
        return list.sort((a, b) => (a.order || 0) - (b.order || 0));
      } else {
        for (const cert of initialCertificates) {
          await setDoc(doc(db, 'certificates', cert.id), cert);
        }
        return initialCertificates;
      }
    } catch (err) {
      console.warn('Firestore getCertificates error, using REST API:', err);
      return fetchJson<CertificateItem[]>(`${BASE_URL}/certificates`, undefined, initialCertificates);
    }
  },

  createCertificate: async (data: Partial<CertificateItem>): Promise<CertificateItem> => {
    const id = 'cert-' + Date.now();
    const newCert: CertificateItem = {
      id,
      title: data.title || 'New Certificate',
      issuer: data.issuer || 'Issuer Name',
      issueDate: data.issueDate || '2025',
      credentialId: data.credentialId || '',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
      verifyUrl: data.verifyUrl || '',
      order: Date.now(),
    };

    try {
      await setDoc(doc(db, 'certificates', id), newCert);
      await logActivity('Certificate Created', `Added certificate "${newCert.title}"`, 'certificate');
      fetchJson(`${BASE_URL}/certificates`, { method: 'POST', body: JSON.stringify(data) }).catch(() => {});
      return newCert;
    } catch (err) {
      console.warn('Firestore createCertificate error, falling back to REST:', err);
      return fetchJson<CertificateItem>(`${BASE_URL}/certificates`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  },

  updateCertificate: async (id: string, data: Partial<CertificateItem>): Promise<CertificateItem> => {
    try {
      const docRef = doc(db, 'certificates', id);
      const snap = await getDoc(docRef);
      const current = snap.exists() ? (snap.data() as CertificateItem) : ({ id } as CertificateItem);
      const updated = { ...current, ...data };
      await setDoc(docRef, updated, { merge: true });

      await logActivity('Certificate Updated', `Updated certificate "${updated.title || id}"`, 'certificate');
      fetchJson(`${BASE_URL}/certificates/${id}`, { method: 'PUT', body: JSON.stringify(data) }).catch(() => {});
      return updated;
    } catch (err) {
      console.warn('Firestore updateCertificate error, falling back to REST:', err);
      return fetchJson<CertificateItem>(`${BASE_URL}/certificates/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }
  },

  deleteCertificate: async (id: string): Promise<{ success: boolean; id: string }> => {
    try {
      await deleteDoc(doc(db, 'certificates', id));
      await logActivity('Certificate Deleted', `Deleted certificate ID: ${id}`, 'certificate');
      fetchJson(`${BASE_URL}/certificates/${id}`, { method: 'DELETE' }).catch(() => {});
      return { success: true, id };
    } catch (err) {
      console.warn('Firestore deleteCertificate error, falling back to REST:', err);
      return fetchJson<{ success: boolean; id: string }>(`${BASE_URL}/certificates/${id}`, {
        method: 'DELETE',
      });
    }
  },

  // ---------------- MESSAGES ----------------
  getMessages: async (): Promise<ContactMessage[]> => {
    try {
      const querySnap = await getDocs(collection(db, 'messages'));
      if (!querySnap.empty) {
        const list: ContactMessage[] = [];
        querySnap.forEach((d) => list.push(d.data() as ContactMessage));
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else {
        for (const msg of initialMessages) {
          await setDoc(doc(db, 'messages', msg.id), msg);
        }
        return initialMessages;
      }
    } catch (err) {
      console.warn('Firestore getMessages error, using REST API:', err);
      return fetchJson<ContactMessage[]>(`${BASE_URL}/messages`, undefined, initialMessages);
    }
  },

  sendMessage: async (data: { name: string; email: string; subject?: string; message: string }): Promise<ContactMessage> => {
    const id = 'msg-' + Date.now();
    const newMsg: ContactMessage = {
      id,
      name: data.name,
      email: data.email,
      subject: data.subject || 'Pesan Baru dari Portofolio',
      message: data.message,
      read: false,
      createdAt: new Date().toLocaleString('id-ID'),
    };

    try {
      await setDoc(doc(db, 'messages', id), newMsg);
      await logActivity('New Message', `Received message from ${newMsg.name}`, 'message');
      fetchJson(`${BASE_URL}/messages`, { method: 'POST', body: JSON.stringify(data) }).catch(() => {});
      return newMsg;
    } catch (err) {
      console.warn('Firestore sendMessage error, falling back to REST:', err);
      return fetchJson<ContactMessage>(`${BASE_URL}/messages`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  },

  markMessageRead: async (id: string, read: boolean = true): Promise<ContactMessage> => {
    try {
      const docRef = doc(db, 'messages', id);
      const snap = await getDoc(docRef);
      const current = snap.exists() ? (snap.data() as ContactMessage) : ({ id } as ContactMessage);
      const updated = { ...current, read };
      await setDoc(docRef, updated, { merge: true });
      fetchJson(`${BASE_URL}/messages/${id}/read`, { method: 'PATCH', body: JSON.stringify({ read }) }).catch(() => {});
      return updated;
    } catch (err) {
      console.warn('Firestore markMessageRead error, falling back to REST:', err);
      return fetchJson<ContactMessage>(`${BASE_URL}/messages/${id}/read`, {
        method: 'PATCH',
        body: JSON.stringify({ read }),
      });
    }
  },

  deleteMessage: async (id: string): Promise<{ success: boolean; id: string }> => {
    try {
      await deleteDoc(doc(db, 'messages', id));
      fetchJson(`${BASE_URL}/messages/${id}`, { method: 'DELETE' }).catch(() => {});
      return { success: true, id };
    } catch (err) {
      console.warn('Firestore deleteMessage error, falling back to REST:', err);
      return fetchJson<{ success: boolean; id: string }>(`${BASE_URL}/messages/${id}`, {
        method: 'DELETE',
      });
    }
  },

  // ---------------- OVERVIEW STATS & LOGS ----------------
  getOverviewStats: async (): Promise<{ stats: WebsiteStats; activityLogs: ActivityLog[] }> => {
    try {
      // Get counts from collections
      const [pSnap, sSnap, cSnap, mSnap, logsSnap, statsSnap] = await Promise.all([
        getDocs(collection(db, 'projects')).catch(() => null),
        getDocs(collection(db, 'skills')).catch(() => null),
        getDocs(collection(db, 'certificates')).catch(() => null),
        getDocs(collection(db, 'messages')).catch(() => null),
        getDocs(collection(db, 'activityLogs')).catch(() => null),
        getDoc(doc(db, 'stats', 'main')).catch(() => null),
      ]);

      let unreadCount = 0;
      if (mSnap && !mSnap.empty) {
        mSnap.forEach((d) => {
          if (!d.data().read) unreadCount++;
        });
      }

      const logs: ActivityLog[] = [];
      if (logsSnap && !logsSnap.empty) {
        logsSnap.forEach((d) => logs.push(d.data() as ActivityLog));
      }

      const stats: WebsiteStats = {
        totalProjects: pSnap ? pSnap.size : initialWebsiteStats.totalProjects,
        totalSkills: sSnap ? sSnap.size : initialWebsiteStats.totalSkills,
        totalCertificates: cSnap ? cSnap.size : initialWebsiteStats.totalCertificates,
        totalMessages: mSnap ? mSnap.size : initialWebsiteStats.totalMessages,
        unreadMessages: unreadCount,
        totalVisitors: statsSnap && statsSnap.exists() ? (statsSnap.data().totalVisitors || 1248) : 1248,
      };

      return {
        stats,
        activityLogs: logs.sort((a, b) => b.id.localeCompare(a.id)).slice(0, 15),
      };
    } catch (err) {
      console.warn('Firestore getOverviewStats error, falling back to REST:', err);
      return fetchJson<{ stats: WebsiteStats; activityLogs: ActivityLog[] }>(`${BASE_URL}/stats`, undefined, {
        stats: initialWebsiteStats,
        activityLogs: [],
      });
    }
  },

  recordVisitor: async (): Promise<{ totalVisitors: number }> => {
    try {
      const statsRef = doc(db, 'stats', 'main');
      const snap = await getDoc(statsRef);
      const current = snap.exists() ? (snap.data().totalVisitors || 1248) : 1248;
      const newTotal = current + 1;
      await setDoc(statsRef, { totalVisitors: newTotal }, { merge: true });
      fetchJson(`${BASE_URL}/stats/visitor`, { method: 'POST' }).catch(() => {});
      return { totalVisitors: newTotal };
    } catch (err) {
      return { totalVisitors: initialWebsiteStats.totalVisitors };
    }
  },

  // ---------------- AUTH ----------------
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
