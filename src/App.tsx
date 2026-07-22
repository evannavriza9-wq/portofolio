import React, { useState, useEffect } from 'react';
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
  ToastMessage,
  ToastType,
} from './types';

import { portfolioApi } from './services/api';
import { LoadingScreen } from './components/LoadingScreen';
import { ToastContainer } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Certificates } from './components/Certificates';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CVModal } from './components/CVModal';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProfile } from './components/admin/AdminProfile';
import { AdminProjects } from './components/admin/AdminProjects';
import { AdminSkills } from './components/admin/AdminSkills';
import { AdminExperiences } from './components/admin/AdminExperiences';
import { AdminCertificates } from './components/admin/AdminCertificates';
import { AdminMessages } from './components/admin/AdminMessages';
import { AdminSqlExport } from './components/admin/AdminSqlExport';

export default function App() {
  const [viewMode, setViewMode] = useState<'portfolio' | 'admin'>('portfolio');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Core Data States
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<WebsiteStats>({
    totalProjects: 0,
    totalSkills: 0,
    totalCertificates: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalVisitors: 1248,
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Auth States
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('admin_token'));

  // Modals & Notifications
  const [isCVOpen, setIsCVOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeSection, setActiveSection] = useState('home');

  // Load all initial data from API
  const loadAllData = async () => {
    try {
      const [profData, projData, skillData, expData, certData, msgData, overviewData] =
        await Promise.all([
          portfolioApi.getProfile(),
          portfolioApi.getProjects(),
          portfolioApi.getSkills(),
          portfolioApi.getExperiences(),
          portfolioApi.getCertificates(),
          portfolioApi.getMessages(),
          portfolioApi.getOverviewStats(),
        ]);

      setProfile(profData);
      setProjects(projData);
      setSkills(skillData);
      setExperiences(expData);
      setCertificates(certData);
      setMessages(msgData);
      setStats(overviewData.stats);
      setActivityLogs(overviewData.activityLogs);
    } catch (err) {
      console.error('Error loading portfolio data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    portfolioApi.recordVisitor();
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'certificates', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (title: string, message: string, type: ToastType = 'info') => {
    const id = 'toast-' + Date.now();
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAdminLoginSuccess = (user: AdminUser, token: string) => {
    setAdminUser(user);
    setAdminToken(token);
    setViewMode('admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setAdminUser(null);
    setAdminToken(null);
    setViewMode('portfolio');
    showToast('Logout Berhasil', 'Anda telah keluar dari Admin Panel.', 'info');
  };

  if (isLoading || !profile) {
    return <LoadingScreen isLoading={true} />;
  }

  // Render Admin View
  if (viewMode === 'admin') {
    if (!adminToken) {
      return (
        <>
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            onShowToast={showToast}
            onBackToSite={() => setViewMode('portfolio')}
          />
          <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
        </>
      );
    }

    const mockAdminUser: AdminUser = adminUser || {
      id: 'admin-1',
      email: 'admin@evan.dev',
      name: 'Evan Akbar (Admin)',
      role: 'Super Admin',
      avatarUrl: profile.avatarUrl,
    };

    return (
      <AdminLayout
        user={mockAdminUser}
        activeTab={adminTab}
        setActiveTab={setAdminTab}
        unreadCount={stats.unreadMessages}
        onLogout={handleLogout}
        onViewWebsite={() => setViewMode('portfolio')}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            stats={stats}
            activityLogs={activityLogs}
            recentMessages={messages}
            onNavigateTab={setAdminTab}
          />
        )}

        {adminTab === 'profile' && (
          <AdminProfile
            profile={profile}
            onProfileUpdated={(updated) => {
              setProfile(updated);
              loadAllData();
            }}
            onShowToast={showToast}
          />
        )}

        {adminTab === 'projects' && (
          <AdminProjects
            projects={projects}
            onProjectsChanged={loadAllData}
            onShowToast={showToast}
          />
        )}

        {adminTab === 'skills' && (
          <AdminSkills
            skills={skills}
            onSkillsChanged={loadAllData}
            onShowToast={showToast}
          />
        )}

        {adminTab === 'experiences' && (
          <AdminExperiences
            experiences={experiences}
            onExperiencesChanged={loadAllData}
            onShowToast={showToast}
          />
        )}

        {adminTab === 'certificates' && (
          <AdminCertificates
            certificates={certificates}
            onCertificatesChanged={loadAllData}
            onShowToast={showToast}
          />
        )}

        {adminTab === 'messages' && (
          <AdminMessages
            messages={messages}
            onMessagesChanged={loadAllData}
            onShowToast={showToast}
          />
        )}

        {adminTab === 'sqlexport' && (
          <AdminSqlExport onShowToast={showToast} />
        )}

        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </AdminLayout>
    );
  }

  // Render Public Portfolio View
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-slate-950 font-sans">
      <Navbar
        activeSection={activeSection}
        onOpenAdmin={() => setViewMode('admin')}
        isAdminLoggedIn={!!adminToken}
      />

      <main>
        <Hero profile={profile} onOpenCV={() => setIsCVOpen(true)} />
        <About
          profile={profile}
          projectsCount={projects.length}
          skillsCount={skills.length}
          experiencesCount={experiences.length}
        />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience experiences={experiences} />
        <Certificates certificates={certificates} />
        <Contact profile={profile} onShowToast={showToast} />
      </main>

      <Footer profile={profile} onOpenAdmin={() => setViewMode('admin')} />

      <CVModal isOpen={isCVOpen} onClose={() => setIsCVOpen(false)} profile={profile} />

      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
