import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Award,
  Briefcase,
  ShieldCheck,
  Mail,
  User,
  Database,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Globe,
  Bell,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { AdminUser } from '../../types';

interface AdminLayoutProps {
  user: AdminUser;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount: number;
  onLogout: () => void;
  onViewWebsite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  activeTab,
  setActiveTab,
  unreadCount,
  onLogout,
  onViewWebsite,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Kelola Profil', icon: User },
    { id: 'projects', label: 'Kelola Project', icon: FolderGit2 },
    { id: 'skills', label: 'Kelola Skill', icon: Award },
    { id: 'experiences', label: 'Kelola Experience', icon: Briefcase },
    { id: 'certificates', label: 'Kelola Sertifikat', icon: ShieldCheck },
    { id: 'messages', label: 'Kelola Pesan', icon: Mail, badge: unreadCount },
    { id: 'sqlexport', label: 'Database & SQL', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside
        className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between z-30 shrink-0 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center font-bold text-white shrink-0 shadow-md shadow-sky-500/20">
                EA
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-bold text-slate-100 text-sm tracking-tight truncate">
                    Admin SaaS
                  </span>
                  <span className="text-[10px] text-sky-400 font-mono">
                    Evan Akbar Panel
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors hidden sm:block"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}

                  {/* Badge */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-slate-950 text-sky-400'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={onViewWebsite}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium bg-slate-950 border border-slate-800 text-slate-300 hover:text-sky-400 transition-colors"
          >
            <Globe className="w-4 h-4 text-sky-400 shrink-0" />
            {!collapsed && <span>Lihat Website</span>}
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Logout Admin</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Bar Header */}
        <header className="bg-slate-900 border-b border-slate-800 h-16 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-slate-100">
              {menuItems.find((m) => m.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono hidden sm:inline-block">
              REST API Connected
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Website Switcher */}
            <button
              onClick={onViewWebsite}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors hidden sm:flex"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Preview Live Site</span>
            </button>

            {/* Notification Indicator */}
            <div className="relative">
              <button
                onClick={() => setActiveTab('messages')}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Profile Dropdown / Badge */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-slate-200 leading-tight">{user.name}</span>
                <span className="text-[10px] text-slate-500">{user.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {children}
        </main>

      </div>

    </div>
  );
};
