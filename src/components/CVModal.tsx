import React from 'react';
import { X, Download, FileText, CheckCircle2 } from 'lucide-react';
import { ProfileData } from '../types';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
}

export const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose, profile }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    // Generate a downloadable text resume summary or download link
    const element = document.createElement('a');
    const file = new Blob([
      `CURRICULUM VITAE - EVAN AKBAR
===================================================
Name: ${profile.name}
Email: ${profile.email}
Phone: ${profile.phone}
Location: ${profile.location}
University: ${profile.university} (${profile.major})
Status: ${profile.statusText}

SUMMARY:
${profile.bio}

SKILLS & TECHNOLOGIES:
- Frontend: HTML5, CSS3, JavaScript, React, Tailwind CSS, Blade
- Backend & DB: PHP, Laravel, Node.js, Express, MySQL, PostgreSQL
- Tools & Design: Git & GitHub, Figma, UI/UX Design, REST APIs

SOCIAL LINKS:
- GitHub: ${profile.socials.github}
- LinkedIn: ${profile.socials.linkedin}
- Figma: ${profile.socials.figma}
===================================================
Downloaded from Evan Akbar's Official Portfolio`
    ], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = profile.cvFileName || 'CV_Evan_Akbar.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Curriculum Vitae</h3>
            <p className="text-xs text-slate-400">{profile.name} — Web Developer & UI/UX Designer</p>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 space-y-5 text-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-800">
            <div>
              <h4 className="text-lg font-bold text-sky-400">{profile.name}</h4>
              <p className="text-xs text-slate-300 font-mono">{profile.university} • {profile.major}</p>
            </div>
            <div className="text-xs text-slate-400 space-y-0.5">
              <p>Email: {profile.email}</p>
              <p>Location: {profile.location}</p>
            </div>
          </div>

          <div>
            <h5 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Professional Summary</h5>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">{profile.bio}</p>
          </div>

          <div>
            <h5 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Core Competencies</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Full-Stack Web Development (React + Laravel)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>UI/UX Interface Design & Figma Prototyping</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>RESTful API & Database Engineering (MySQL)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Responsive Design & Modern CSS (Tailwind)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            Tutup
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
};
