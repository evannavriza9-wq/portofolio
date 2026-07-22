import React, { useState } from 'react';
import { User, Save, Upload, Link as LinkIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { ProfileData, ToastType } from '../../types';
import { portfolioApi } from '../../services/api';

interface AdminProfileProps {
  profile: ProfileData;
  onProfileUpdated: (updated: ProfileData) => void;
  onShowToast: (title: string, message: string, type: ToastType) => void;
}

export const AdminProfile: React.FC<AdminProfileProps> = ({ profile, onProfileUpdated, onShowToast }) => {
  const [formData, setFormData] = useState<ProfileData>({ ...profile });
  const [titlesInput, setTitlesInput] = useState((profile.titles || []).join(', '));
  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
        onShowToast('Foto Terpilih', 'Foto profil berhasil diunggah secara lokal.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const parsedTitles = titlesInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      ...formData,
      titles: parsedTitles.length > 0 ? parsedTitles : ['Web Developer', 'UI/UX Designer', 'Informatics Student'],
    };

    try {
      const updated = await portfolioApi.updateProfile(payload);
      setIsSaving(false);
      onProfileUpdated(updated);
      onShowToast('Profil Diperbarui', 'Data profil Evan Akbar berhasil disimpan.', 'success');
    } catch (err) {
      setIsSaving(false);
      onShowToast('Gagal Menyimpan', 'Terjadi kesalahan saat memperbarui profil.', 'error');
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Kelola Profil Personal</h2>
          <p className="text-xs text-slate-400">Atur nama, bio, status, link CV, dan akun sosial media</p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Simpan Perubahan</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Avatar & Main Credentials Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">
            Foto Profil & Status
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group shrink-0">
              <img
                src={formData.avatarUrl}
                alt="Avatar Preview"
                className="w-28 h-28 rounded-2xl object-cover border-2 border-slate-700 bg-slate-950 shadow-md"
              />
              <label className="absolute inset-0 bg-slate-950/70 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] text-sky-400 font-mono cursor-pointer transition-opacity">
                <Upload className="w-5 h-5 mb-1" />
                <span>Ubah Foto</span>
                <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
              </label>
            </div>

            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Foto Profil URL / Image Link
                </label>
                <input
                  type="text"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Status Availability Pill
                </label>
                <input
                  type="text"
                  value={formData.statusText}
                  onChange={(e) => setFormData({ ...formData, statusText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Basic Personal Details */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">
            Informasi Dasar
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Titles (Typing Animation - pisahkan koma)
              </label>
              <input
                type="text"
                value={titlesInput}
                onChange={(e) => setTitlesInput(e.target.value)}
                placeholder="Web Developer, UI/UX Designer, Informatics Student"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Kontak</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor Telepon / WA</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Universitas</label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Jurusan / Major</label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Short Bio (Hero section)</label>
            <input
              type="text"
              value={formData.shortBio}
              onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Lengkap (About section)</label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 resize-none"
            ></textarea>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">
            Media Sosial & Link CV
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub URL</label>
              <input
                type="text"
                value={formData.socials.github}
                onChange={(e) =>
                  setFormData({ ...formData, socials: { ...formData.socials, github: e.target.value } })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={formData.socials.linkedin}
                onChange={(e) =>
                  setFormData({ ...formData, socials: { ...formData.socials, linkedin: e.target.value } })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Figma URL</label>
              <input
                type="text"
                value={formData.socials.figma}
                onChange={(e) =>
                  setFormData({ ...formData, socials: { ...formData.socials, figma: e.target.value } })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.socials.instagram}
                onChange={(e) =>
                  setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
