import React from 'react';
import { User, Code, Award, Briefcase, GraduationCap, CheckCircle2, Sparkles } from 'lucide-react';
import { ProfileData, ProjectItem, SkillItem, ExperienceItem } from '../types';

interface AboutProps {
  profile: ProfileData;
  projectsCount: number;
  skillsCount: number;
  experiencesCount: number;
}

export const About: React.FC<AboutProps> = ({ profile, projectsCount, skillsCount, experiencesCount }) => {
  const stats = [
    { label: 'Projects Completed', value: `${projectsCount}+`, icon: Code, color: 'text-sky-400' },
    { label: 'Technical Skills', value: `${skillsCount}+`, icon: Award, color: 'text-blue-400' },
    { label: 'Years Experience', value: '3+', icon: Briefcase, color: 'text-indigo-400' },
    { label: 'Education Level', value: 'Undergrad', icon: GraduationCap, color: 'text-teal-400' },
  ];

  const highlights = [
    'Clean, scalable architecture following SOLID principles & modern practices.',
    'Expertise in React 19, TypeScript, Tailwind CSS, and full-stack integration.',
    'Robust backend development using Laravel REST APIs & MySQL database design.',
    'Human-centered UI/UX design workflow in Figma from wireframe to design system.',
  ];

  return (
    <section id="about" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono mb-3">
            <User className="w-3.5 h-3.5" />
            <span>About Me</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Passionate Developer & Creative Designer
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Crafting elegant web solutions at the intersection of robust backend code and intuitive user interfaces.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-sky-500/40 transition-all duration-300 group"
              >
                <div className={`p-3 rounded-xl bg-slate-950 border border-slate-800/80 w-fit mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Main Bio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Bio Text Card */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                <span>My Journey</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mb-4">
                Siswa Rekayasa Perangkat Lunak (RPL) & Developer
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base mb-6 whitespace-pre-line">
                {profile.bio}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <div>
                <span className="text-slate-500 font-mono block">Sekolah / Instansi</span>
                <span className="font-semibold text-slate-200">{profile.university}</span>
              </div>
              <div>
                <span className="text-slate-500 font-mono block">Jurusan</span>
                <span className="font-semibold text-slate-200">{profile.major}</span>
              </div>
              <div>
                <span className="text-slate-500 font-mono block">Fokus Keahlian</span>
                <span className="font-semibold text-slate-200">Software, Web & UI/UX</span>
              </div>
            </div>
          </div>

          {/* Quick Info & Tech Stack Badges Card */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between space-y-6">
            <div>
              <h4 className="text-lg font-bold text-slate-100 mb-2">Core Philosophy</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                "Code is art with logic. Great software should be fast, accessible, easy to maintain, and visually delightful."
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Name:</span>
                <span className="font-bold text-slate-200">{profile.name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Email:</span>
                <span className="font-mono text-sky-400">{profile.email}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Location:</span>
                <span className="font-medium text-slate-200">{profile.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Active Developer
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 to-blue-600/10 border border-sky-500/20">
              <p className="text-xs text-sky-300 font-medium">
                💡 Open for freelance work, web development contracts, and UI/UX consultations.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
