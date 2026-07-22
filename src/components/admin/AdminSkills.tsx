import React, { useState } from 'react';
import { Award, Plus, Edit2, Trash2, Code, Zap, Database, Server, Box, Layers, GitBranch, Figma, X } from 'lucide-react';
import { SkillItem, ToastType } from '../../types';
import { portfolioApi } from '../../services/api';
import { ConfirmModal } from '../ConfirmModal';

interface AdminSkillsProps {
  skills: SkillItem[];
  onSkillsChanged: () => void;
  onShowToast: (title: string, message: string, type: ToastType) => void;
}

export const AdminSkills: React.FC<AdminSkillsProps> = ({ skills, onSkillsChanged, onShowToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formState, setFormState] = useState<Partial<SkillItem>>({
    name: '',
    category: 'Frontend',
    percentage: 85,
    iconName: 'Code',
    proficiency: 'Advanced',
  });

  const handleOpenAddModal = () => {
    setEditingSkill(null);
    setFormState({
      name: '',
      category: 'Frontend',
      percentage: 85,
      iconName: 'Code',
      proficiency: 'Advanced',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (skill: SkillItem) => {
    setEditingSkill(skill);
    setFormState({ ...skill });
    setIsModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name) {
      onShowToast('Form Incomplete', 'Mohon isi nama skill.', 'warning');
      return;
    }

    try {
      if (editingSkill) {
        await portfolioApi.updateSkill(editingSkill.id, formState);
        onShowToast('Skill Diperbarui', `Skill "${formState.name}" berhasil diubah.`, 'success');
      } else {
        await portfolioApi.createSkill(formState);
        onShowToast('Skill Ditambahkan', `Skill "${formState.name}" berhasil ditambahkan.`, 'success');
      }
      setIsModalOpen(false);
      onSkillsChanged();
    } catch (err) {
      onShowToast('Gagal Menyimpan', 'Terjadi kesalahan saat menyimpan skill.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await portfolioApi.deleteSkill(deletingId);
      onShowToast('Skill Dihapus', 'Skill berhasil dihapus.', 'success');
      setDeletingId(null);
      onSkillsChanged();
    } catch (err) {
      onShowToast('Gagal Menghapus', 'Terjadi kesalahan saat menghapus skill.', 'error');
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Kelola Skill & Kemampuan</h2>
          <p className="text-xs text-slate-400">Atur persentase proficiency dan ikon skill</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Skill</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider">
                  {skill.category}
                </span>
                <h3 className="font-bold text-slate-100 text-sm">{skill.name}</h3>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-sky-400 font-mono">{skill.percentage}%</span>
                <span className="block text-[10px] text-slate-500">{skill.proficiency}</span>
              </div>
            </div>

            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-sky-500 to-blue-500 h-full rounded-full"
                style={{ width: `${skill.percentage}%` }}
              ></div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Icon: {skill.iconName}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(skill)}
                  className="p-1.5 rounded-lg bg-slate-800 text-sky-400 hover:bg-slate-700"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletingId(skill.id)}
                  className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-2 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-100 mb-4">
              {editingSkill ? 'Edit Skill' : 'Tambah Skill Baru'}
            </h3>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Skill *</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Contoh: React / Laravel / Figma"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori</label>
                <select
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Tools & Design">Tools & Design</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Persentase Kemampuan ({formState.percentage}%)
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={formState.percentage}
                  onChange={(e) => setFormState({ ...formState, percentage: Number(e.target.value) })}
                  className="w-full accent-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tingkat / Proficiency</label>
                <select
                  value={formState.proficiency}
                  onChange={(e) => setFormState({ ...formState, proficiency: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
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
                  Simpan Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingId}
        title="Hapus Skill?"
        message="Apakah Anda yakin ingin menghapus skill ini?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
