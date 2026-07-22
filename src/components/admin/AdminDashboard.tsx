import React from 'react';
import {
  FolderGit2,
  Award,
  ShieldCheck,
  Mail,
  Users,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { WebsiteStats, ActivityLog, ContactMessage } from '../../types';

interface AdminDashboardProps {
  stats: WebsiteStats;
  activityLogs: ActivityLog[];
  recentMessages: ContactMessage[];
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  activityLogs,
  recentMessages,
  onNavigateTab,
}) => {
  const metricCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      change: '+12% month',
      icon: FolderGit2,
      tab: 'projects',
      color: 'from-sky-500/20 to-blue-600/20 text-sky-400 border-sky-500/30',
    },
    {
      title: 'Total Skills',
      value: stats.totalSkills,
      change: 'Active Stack',
      icon: Award,
      tab: 'skills',
      color: 'from-purple-500/20 to-indigo-600/20 text-purple-400 border-purple-500/30',
    },
    {
      title: 'Total Sertifikat',
      value: stats.totalCertificates,
      change: 'Verified Credentials',
      icon: ShieldCheck,
      tab: 'certificates',
      color: 'from-teal-500/20 to-emerald-600/20 text-teal-400 border-teal-500/30',
    },
    {
      title: 'Pesan Masuk',
      value: stats.totalMessages,
      change: `${stats.unreadMessages} Belum Dibaca`,
      icon: Mail,
      tab: 'messages',
      color: 'from-rose-500/20 to-amber-600/20 text-rose-400 border-rose-500/30',
    },
    {
      title: 'Visitor Website',
      value: stats.totalVisitors,
      change: 'Unique Sessions',
      icon: Users,
      tab: 'dashboard',
      color: 'from-blue-500/20 to-cyan-600/20 text-blue-400 border-blue-500/30',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>SaaS Control Center</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">
            Selamat Datang di Admin Panel, Evan Akbar
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Kelola data portofolio, statistik project, keterampilan, sertifikat, serta respon pesan pengunjung website secara real-time.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('projects')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/25 transition-all shrink-0"
        >
          <span>Tambah Project Baru</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(card.tab)}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{card.title}</span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-100 group-hover:text-sky-400 transition-colors">
                  {card.value}
                </h3>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  {card.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Messages & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Messages Widget */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100">Pesan Masuk Terbaru</h3>
              <p className="text-xs text-slate-400">Pesan dari kontak form website</p>
            </div>
            <button
              onClick={() => onNavigateTab('messages')}
              className="text-xs font-mono text-sky-400 hover:underline"
            >
              Lihat Semua →
            </button>
          </div>

          {recentMessages.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">Belum ada pesan masuk.</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.slice(0, 4).map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => onNavigateTab('messages')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    !msg.read
                      ? 'bg-sky-500/10 border-sky-500/30 text-slate-100'
                      : 'bg-slate-950 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{msg.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.createdAt}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-sky-300 mb-1">{msg.subject}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Log */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100">Aktivitas Terbaru</h3>
              <p className="text-xs text-slate-400">Log perubahan sistem</p>
            </div>
            <Activity className="w-5 h-5 text-sky-400" />
          </div>

          <div className="space-y-4 pt-1">
            {activityLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-sky-400 shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{log.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{log.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
