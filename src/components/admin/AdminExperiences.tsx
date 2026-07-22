import React, { useState } from 'react';
import { Briefcase, Plus, Edit2, Trash2, X } from 'lucide-react';
import { ExperienceItem, ToastType } from '../../types';
import { portfolioApi } from '../../services/api';
import { ConfirmModal } from '../ConfirmModal';

interface AdminExperiencesProps {
  experiences: ExperienceItem[];
  onExperiencesChanged: () => void;
  onShowToast: (title: string, message: string, type: ToastType) => void;
}

export const AdminExperiences: React.FC<AdminExperiencesProps> = ({
  experiences,
  onExperiencesChanged,
  onShowToast,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formState, setFormState] = useState<Partial<ExperienceItem>>({
    role: '',
    organization: '',
    type: 'Full-time',
    period: '2025 - Present',
    location: 'Remote',
    description: '',
    skillsUsed: [],
  });

  const [skillsInput, setSkillsInput] = useState('');

  const handleOpenAdd = () => {
    setEditingExp(null);
    setFormState({
      role: '',
      organization: '',
      type: 'Full-time',
      period: '2025 - Present',
      location: 'Remote',
      description: '',
      skillsUsed: [],
    });
    setSkillsInput('React, Laravel, Tailwind');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: ExperienceItem) => {
    setEditingExp(exp);
    setFormState({ ...exp });
    setSkillsInput((exp.skillsUsed || []).join(', '));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.role || !formState.organization) {
      onShowToast('Form Incomplete', 'Mohon isi posisi dan nama perusahaan.', 'warning');
      return;
    }

    const parsedSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      ...formState,
      skillsUsed: parsedSkills,
    };

    try {
      if (editingExp) {
        await portfolioApi.updateExperience(editingExp.id, payload);
        onShowToast('Experience Diperbarui', `Pengalaman "${payload.role}" berhasil diubah.`, 'success');
      } else {
        await portfolioApi.createExperience(payload);
        onShowToast('Experience Ditambahkan', `Pengalaman "${payload.role}" berhasil ditambahkan.`, 'success');
      }
      setIsModalOpen(false);
      onExperiencesChanged();
    } catch (err) {
      onShowToast('Gagal Menyimpan', 'Terjadi kesalahan saat menyimpan pengalaman.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await portfolioApi.deleteExperience(deletingId);
      onShowToast('Experience Dihapus', 'Pengalaman berhasil dihapus.', 'success');
      setDeletingId(null);
      onExperiencesChanged();
    } catch (err) {
      onShowToast('Gagal Menghapus', 'Terjadi kesalahan saat menghapus pengalaman.', 'error');
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Kelola Experience & Karir</h2>
          <p className="text-xs text-slate-400">Atur riwayat karir, magang, dan organisasi</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Experience</span>
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold">
                  {exp.type}
                </span>
                <span className="text-xs text-slate-400 font-mono">{exp.period}</span>
              </div>
              <h3 className="font-bold text-slate-100 text-base">{exp.role}</h3>
              <p className="text-xs text-slate-300">
                {exp.organization} — <span className="text-slate-400">{exp.location}</span>
              </p>
              <p className="text-xs text-slate-400 line-clamp-2 max-w-2xl">{exp.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleOpenEdit(exp)}
                className="p-2 rounded-lg bg-slate-800 text-sky-400 hover:bg-slate-700"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeletingId(exp.id)}
                className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-2 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-100 mb-4">
              {editingExp ? 'Edit Experience' : 'Tambah Experience Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Posisi / Role *</label>
                  <input
                    type="text"
                    required
                    value={formState.role}
                    onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Perusahaan / Org *</label>
                  <input
                    type="text"
                    required
                    value={formState.organization}
                    onChange={(e) => setFormState({ ...formState, organization: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipe Pengalaman</label>
                  <select
                    value={formState.type}
                    onChange={(e) => setFormState({ ...formState, type: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                    <option value="Organization">Organization</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Periode</label>
                  <input
                    type="text"
                    value={formState.period}
                    onChange={(e) => setFormState({ ...formState, period: e.target.value })}
                    placeholder="2025 - Present"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Lokasi</label>
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  placeholder="Remote / Jakarta, Indonesia"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi & Tanggung Jawab</label>
                <textarea
                  rows={3}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Skills Digunakan (pisahkan koma)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
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
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg"
                >
                  Simpan Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingId}
        title="Hapus Experience?"
        message="Apakah Anda yakin ingin menghapus pengalaman ini?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
