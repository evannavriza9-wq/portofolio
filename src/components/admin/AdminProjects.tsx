import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  Clock,
  Github,
  ExternalLink,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { ProjectItem, ToastType } from '../../types';
import { portfolioApi } from '../../services/api';
import { ConfirmModal } from '../ConfirmModal';

interface AdminProjectsProps {
  projects: ProjectItem[];
  onProjectsChanged: () => void;
  onShowToast: (title: string, message: string, type: ToastType) => void;
}

export const AdminProjects: React.FC<AdminProjectsProps> = ({
  projects,
  onProjectsChanged,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deletion Confirm state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formState, setFormState] = useState<Partial<ProjectItem>>({
    title: '',
    category: 'Web App',
    shortDesc: '',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    images: [],
    techStack: ['React', 'Tailwind CSS'],
    githubUrl: '',
    demoUrl: '',
    status: 'Completed',
  });

  const [techInput, setTechInput] = useState('');

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormState({
      title: '',
      category: 'Web App',
      shortDesc: '',
      description: '',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      images: [],
      techStack: ['React', 'Tailwind CSS', 'Laravel'],
      githubUrl: '',
      demoUrl: '',
      status: 'Completed',
    });
    setTechInput('React, Tailwind CSS, Laravel');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj: ProjectItem) => {
    setEditingProject(proj);
    setFormState({ ...proj });
    setTechInput((proj.techStack || []).join(', '));
    setIsModalOpen(true);
  };

  const handleThumbnailFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({ ...prev, thumbnail: reader.result as string }));
        onShowToast('Thumbnail Terpilih', 'Gambar thumbnail berhasil diunggah.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      let loaded = 0;
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            newImages.push(reader.result as string);
          }
          loaded++;
          if (loaded === files.length) {
            setFormState((prev) => ({
              ...prev,
              images: [...(prev.images || []), ...newImages],
            }));
            onShowToast('Galeri Diunggah', `${newImages.length} screenshot ditambahkan.`, 'info');
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.category) {
      onShowToast('Form Incomplete', 'Mohon isi judul dan kategori project.', 'warning');
      return;
    }

    setIsSubmitting(true);

    const parsedTech = techInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      ...formState,
      techStack: parsedTech.length > 0 ? parsedTech : ['React', 'Tailwind CSS'],
    };

    try {
      if (editingProject) {
        await portfolioApi.updateProject(editingProject.id, payload);
        onShowToast('Project Diperbarui', `Project "${payload.title}" berhasil disimpan.`, 'success');
      } else {
        await portfolioApi.createProject(payload);
        onShowToast('Project Ditambahkan', `Project "${payload.title}" berhasil dibuat.`, 'success');
      }

      setIsSubmitting(false);
      setIsModalOpen(false);
      onProjectsChanged();
    } catch (err) {
      setIsSubmitting(false);
      onShowToast('Gagal Menyimpan', 'Terjadi kesalahan saat menyimpan project.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await portfolioApi.deleteProject(deletingId);
      onShowToast('Project Dihapus', 'Project telah berhasil dihapus.', 'success');
      setDeletingId(null);
      onProjectsChanged();
    } catch (err) {
      onShowToast('Gagal Menghapus', 'Terjadi kesalahan saat menghapus project.', 'error');
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Kelola Project Portofolio</h2>
          <p className="text-xs text-slate-400">Tambah, ubah, hapus, dan atur galeri project Anda</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Projects Table / Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-950/80 border border-slate-800 text-sky-400 font-semibold">
                  {proj.category}
                </span>
                <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-950/80 border border-slate-800 text-slate-300">
                  {proj.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-100 text-base">{proj.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{proj.shortDesc}</p>
              </div>

              <div className="flex flex-wrap gap-1">
                {proj.techStack.map((tech, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-400 border border-slate-800">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">ID: {proj.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(proj)}
                  className="p-2 rounded-lg bg-slate-800 text-sky-400 hover:bg-slate-700 transition-colors"
                  title="Edit Project"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingId(proj.id)}
                  className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/20 transition-colors"
                  title="Hapus Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-100 mb-4">
              {editingProject ? 'Edit Project' : 'Tambah Project Baru'}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Judul Project *</label>
                  <input
                    type="text"
                    required
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori *</label>
                  <input
                    type="text"
                    required
                    placeholder="Web App / Laravel / React / UI/UX"
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Singkat *</label>
                <input
                  type="text"
                  required
                  value={formState.shortDesc}
                  onChange={(e) => setFormState({ ...formState, shortDesc: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Detail (Rich Writeup)</label>
                <textarea
                  rows={4}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 resize-none"
                ></textarea>
              </div>

              {/* Image Upload Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Thumbnail URL / File</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formState.thumbnail}
                      onChange={(e) => setFormState({ ...formState, thumbnail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                    />
                    <label className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-sky-400 cursor-pointer hover:bg-slate-700 shrink-0">
                      <Upload className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={handleThumbnailFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status Project</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
                  </select>
                </div>
              </div>

              {/* Upload Multiple Screenshots */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Upload Galeri Screenshots Project</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sky-400 text-xs font-semibold cursor-pointer hover:bg-slate-800">
                    <ImageIcon className="w-4 h-4" />
                    <span>Pilih Beberapa Gambar</span>
                    <input type="file" multiple accept="image/*" onChange={handleMultipleImagesUpload} className="hidden" />
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {formState.images?.length || 0} screenshot terunggah
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tech Stack (pisahkan koma)</label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="React, Laravel, Tailwind CSS, MySQL"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Link Repository GitHub</label>
                  <input
                    type="text"
                    value={formState.githubUrl}
                    onChange={(e) => setFormState({ ...formState, githubUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Link Live Demo</label>
                  <input
                    type="text"
                    value={formState.demoUrl}
                    onChange={(e) => setFormState({ ...formState, demoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Memproses...' : 'Simpan Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!deletingId}
        title="Hapus Project?"
        message="Apakah Anda yakin ingin menghapus project ini dari sistem portofolio? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Project"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />

    </div>
  );
};
