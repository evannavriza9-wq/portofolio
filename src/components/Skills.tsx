import React, { useState } from 'react';
import { Award, Code, Database, Layout, Server, GitBranch, Figma, Zap, Box, Layers, Palette, Cpu } from 'lucide-react';
import { SkillItem } from '../types';

interface SkillsProps {
  skills: SkillItem[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools & Design'];

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter((s) => s.category === selectedCategory);

  const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'code':
      case 'html':
        return <Code className="w-5 h-5 text-orange-400" />;
      case 'palette':
      case 'css':
        return <Palette className="w-5 h-5 text-sky-400" />;
      case 'zap':
      case 'javascript':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'server':
      case 'php':
        return <Server className="w-5 h-5 text-indigo-400" />;
      case 'database':
      case 'mysql':
        return <Database className="w-5 h-5 text-blue-400" />;
      case 'box':
      case 'laravel':
        return <Box className="w-5 h-5 text-rose-400" />;
      case 'atom':
      case 'react':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'layers':
      case 'tailwind':
        return <Layers className="w-5 h-5 text-teal-400" />;
      case 'gitbranch':
      case 'git':
        return <GitBranch className="w-5 h-5 text-red-400" />;
      case 'figma':
        return <Figma className="w-5 h-5 text-purple-400" />;
      default:
        return <Layout className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <section id="skills" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Skills & Proficiency
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Technologies, frameworks, and design tools I leverage to build robust digital products.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-sky-500/40 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 group-hover:scale-110 transition-transform">
                    {getIcon(skill.iconName || skill.name)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm sm:text-base group-hover:text-sky-400 transition-colors">
                      {skill.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {skill.category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-sky-400 font-mono">
                    {skill.percentage}%
                  </span>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider">
                    {skill.proficiency}
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                <div
                  className="bg-gradient-to-r from-sky-500 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out shadow-sm shadow-sky-500/50"
                  style={{ width: `${skill.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
