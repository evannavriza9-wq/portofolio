import React, { useState } from 'react';
import { FolderGit2, ExternalLink, Github, Search, CheckCircle, Clock, Eye, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectsProps {
  projects: ProjectItem[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Extract distinct categories dynamically
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter((project) => {
    const matchesCat = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <section id="projects" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Featured Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Projects & Case Studies
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            A showcase of web platforms, UI/UX designs, and backend systems built with modern technology.
          </p>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          {/* Categories Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari project / tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Projects Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
            <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">Tidak ada project yang ditemukan</p>
            <p className="text-xs text-slate-500 mt-1">Coba kata kunci lain atau pilih kategori berbeda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group rounded-3xl bg-slate-900/60 border border-slate-800/80 overflow-hidden flex flex-col justify-between hover:border-sky-500/40 transition-all duration-300 backdrop-blur-md hover:-translate-y-1"
              >
                <div>
                  {/* Thumbnail Image Container */}
                  <div className="relative overflow-hidden aspect-[16/10] bg-slate-950">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-slate-950/80 border border-slate-800 text-slate-200 backdrop-blur-md shadow">
                      {project.status === 'Completed' ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Completed</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span className="text-amber-400">Ongoing</span>
                        </>
                      )}
                    </div>

                    {/* Category Pill */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 backdrop-blur-md">
                      {project.category}
                    </div>

                    {/* Overlay Action Button */}
                    <button
                      onClick={() => {
                        setActiveProjectModal(project);
                        setSelectedImageIndex(0);
                      }}
                      className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Detail</span>
                    </button>
                  </div>

                  {/* Project Info */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-sky-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {project.shortDesc}
                    </p>

                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Links */}
                <div className="p-6 pt-0 border-t border-slate-800/50 mt-4 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 transition-colors font-medium"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setActiveProjectModal(project);
                      setSelectedImageIndex(0);
                    }}
                    className="text-slate-400 hover:text-sky-400 font-mono text-[11px] underline underline-offset-4"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {activeProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 my-8">
              <button
                onClick={() => setActiveProjectModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                {/* Modal Title & Badges */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {activeProjectModal.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-950 border border-slate-800 text-slate-300">
                      Status: {activeProjectModal.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100">{activeProjectModal.title}</h3>
                </div>

                {/* Main Preview Image */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={activeProjectModal.images?.[selectedImageIndex] || activeProjectModal.thumbnail}
                    alt={activeProjectModal.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Screenshots Gallery Thumbnail Row */}
                {activeProjectModal.images && activeProjectModal.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {activeProjectModal.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                          selectedImageIndex === idx ? 'border-sky-400 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Project Overview */}
                <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Deskripsi Lengkap</h4>
                  <p>{activeProjectModal.description || activeProjectModal.shortDesc}</p>
                </div>

                {/* Tech Stack List */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Teknologi yang Digunakan</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProjectModal.techStack.map((tech, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl text-xs font-mono bg-slate-950 border border-slate-800 text-sky-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* External Link Buttons */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {activeProjectModal.githubUrl && (
                      <a
                        href={activeProjectModal.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 text-xs font-medium"
                      >
                        <Github className="w-4 h-4" />
                        <span>Repository GitHub</span>
                      </a>
                    )}
                    {activeProjectModal.demoUrl && (
                      <a
                        href={activeProjectModal.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-lg shadow-sky-500/25"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveProjectModal(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
