import React from 'react';
import { Briefcase, Calendar, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import { ExperienceItem } from '../types';

interface ExperienceProps {
  experiences: ExperienceItem[];
}

export const Experience: React.FC<ExperienceProps> = ({ experiences }) => {
  return (
    <section id="experience" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Work Experience & Leadership
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            My professional career path, software engineering internships, and organizational leadership roles.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Central Glowing Line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 via-blue-600 to-slate-800 -translate-x-1/2 hidden sm:block"></div>

          <div className="space-y-12">
            {experiences.map((exp, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={exp.id}
                  className={`relative flex flex-col sm:flex-row items-center ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Glowing Node Dot on Timeline */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-950 border-2 border-sky-400 flex items-center justify-center z-20 shadow-lg shadow-sky-500/30 hidden sm:flex">
                    <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping"></div>
                  </div>

                  {/* Content Card */}
                  <div className="w-full sm:w-1/2 px-0 sm:px-8">
                    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-sky-500/40 transition-all duration-300 group">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          {exp.type}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-sky-400" />
                          <span>{exp.period}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-100 group-hover:text-sky-400 transition-colors">
                        {exp.role}
                      </h3>

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mt-1 mb-3">
                        <Building2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>{exp.organization}</span>
                        {exp.location && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400 font-normal">{exp.location}</span>
                          </>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                        {exp.description}
                      </p>

                      {/* Skills Badges */}
                      {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                          {exp.skillsUsed.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
