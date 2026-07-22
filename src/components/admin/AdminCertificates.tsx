import React, { useState } from 'react';
import { ShieldCheck, Plus, Edit2, Trash2, Upload, X } from 'lucide-react';
import { CertificateItem, ToastType } from '../../types';
import { portfolioApi } from '../../services/api';
import { ConfirmModal } from '../ConfirmModal';

interface AdminCertificatesProps {
  certificates: CertificateItem[];
  onCertificatesChanged: () => void;
  onShowToast: (title: string, message: string, type: ToastType) => void;
}

export const AdminCertificates: React.FC<AdminCertificatesProps> = ({
  certificates,
  onCertificatesChanged,
  onShowToast,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formState, setFormState] = useState<Partial<CertificateItem>>({
    title: '',
    issuer: '',
    issueDate: '2026',
    credentialId: '',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    verifyUrl: '',
  });

  const handleOpenAdd = () => {
    setEditingCert(null);
    setFormState({
      title: '',
      issuer: '',
      issueDate: '2026',
      credentialId: '',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
      verifyUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: CertificateItem) => {
    setEditingCert(cert);
    setFormState({ ...cert });
    setIsModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({ ...prev, imageUrl: reader.result as string }));
        onShowToast('Sertifikat Terpilih', 'Gambar sertifikat berhasil diunggah.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.issuer) {
      onShowToast('Form Incomplete', 'Mohon isi judul dan penerbit sertifikat.', 'warning');
      return;
    }

    try {
      if (editingCert) {
        await portfolioApi.updateCertificate(editingCert.id, formState);
        onShowToast('Sertifikat Diperbarui', `Sertifikat "${formState.title}" berhasil diubah.`, 'success');
      } else {
        await portfolioApi.createCertificate(formState);
        onShowToast('Sertifikat Ditambahkan', `Sertifikat "${formState.title}" berhasil dibuat.`, 'success');
      }
      setIsModalOpen(false);
      onCertificatesChanged();
    } catch (err) {
      onShowToast('Gagal Menyimpan', 'Terjadi kesalahan saat menyimpan sertifikat.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await portfolioApi.deleteCertificate(deletingId);
      onShowToast('Sertifikat Dihapus', 'Sertifikat berhasil dihapus.', 'success');
      setDeletingId(null);
      onCertificatesChanged();
    } catch (err) {
      onShowToast('Gagal Menghapus', 'Terjadi kesalahan saat menghapus sertifikat.', 'error');
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Kelola Sertifikat</h2>
          <p className="text-xs text-slate-400">Upload dan atur kredensial sertifikasi Anda</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Sertifikat</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
              </div>

              <div>
                <span className="text-[10px] font-mono text-sky-400">{cert.issuer} ({cert.issueDate})</span>
                <h3 className="font-bold text-slate-100 text-sm leading-tight">{cert.title}</h3>
                {cert.credentialId && (
                  <p className="text-[11px] font-mono text-slate-500 mt-1">ID: {cert.credentialId}</p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">ID: {cert.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(cert)}
                  className="p-2 rounded-lg bg-slate-800 text-sky-400 hover:bg-slate-700"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingId(cert.id)}
                  className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
              {editingCert ? 'Edit Sertifikat' : 'Upload Sertifikat Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Judul Sertifikat *</label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Penerbit / Issuer *</label>
                <input
                  type="text"
                  required
                  placeholder="Dicoding / Coursera / Google"
                  value={formState.issuer}
                  onChange={(e) => setFormState({ ...formState, issuer: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tahun / Tanggal Terbit</label>
                  <input
                    type="text"
                    value={formState.issueDate}
                    onChange={(e) => setFormState({ ...formState, issueDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Credential ID</label>
                  <input
                    type="text"
                    value={formState.credentialId}
                    onChange={(e) => setFormState({ ...formState, credentialId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Gambar Sertifikat URL / File</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formState.imageUrl}
                    onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                  <label className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-sky-400 cursor-pointer hover:bg-slate-700 shrink-0">
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Link Verifikasi Online</label>
                <input
                  type="text"
                  value={formState.verifyUrl}
                  onChange={(e) => setFormState({ ...formState, verifyUrl: e.target.value })}
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
                  Simpan Sertifikat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingId}
        title="Hapus Sertifikat?"
        message="Apakah Anda yakin ingin menghapus sertifikat ini?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
