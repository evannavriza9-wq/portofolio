import React, { useState } from 'react';
import { Mail, Search, Trash2, CheckCircle2, Eye, Reply, X, Calendar, User } from 'lucide-react';
import { ContactMessage, ToastType } from '../../types';
import { portfolioApi } from '../../services/api';
import { ConfirmModal } from '../ConfirmModal';

interface AdminMessagesProps {
  messages: ContactMessage[];
  onMessagesChanged: () => void;
  onShowToast: (title: string, message: string, type: ToastType) => void;
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({
  messages,
  onMessagesChanged,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');
  const [activeMessageModal, setActiveMessageModal] = useState<ContactMessage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredMessages = messages.filter((msg) => {
    const matchesFilter =
      filterRead === 'all'
        ? true
        : filterRead === 'unread'
        ? !msg.read
        : msg.read;

    const matchesSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleOpenMessage = async (msg: ContactMessage) => {
    setActiveMessageModal(msg);
    if (!msg.read) {
      try {
        await portfolioApi.markMessageRead(msg.id, true);
        onMessagesChanged();
      } catch (err) {
        console.error('Failed to mark read:', err);
      }
    }
  };

  const handleToggleReadStatus = async (msg: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await portfolioApi.markMessageRead(msg.id, !msg.read);
      onShowToast('Status Diperbarui', `Pesan ditandai sebagai ${!msg.read ? 'sudah dibaca' : 'belum dibaca'}.`, 'info');
      onMessagesChanged();
    } catch (err) {
      onShowToast('Gagal', 'Terjadi kesalahan memperbarui status pesan.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await portfolioApi.deleteMessage(deletingId);
      onShowToast('Pesan Dihapus', 'Pesan berhasil dihapus dari inbox.', 'success');
      setDeletingId(null);
      if (activeMessageModal?.id === deletingId) {
        setActiveMessageModal(null);
      }
      onMessagesChanged();
    } catch (err) {
      onShowToast('Gagal Menghapus', 'Terjadi kesalahan saat menghapus pesan.', 'error');
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Kelola Pesan Masuk</h2>
          <p className="text-xs text-slate-400">Inquiries dan pesan pengunjung dari Contact Form</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterRead('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              filterRead === 'all' ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-400'
            }`}
          >
            Semua ({messages.length})
          </button>
          <button
            onClick={() => setFilterRead('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              filterRead === 'unread' ? 'bg-rose-500 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'
            }`}
          >
            Belum Dibaca ({messages.filter((m) => !m.read).length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari pesan, nama, atau email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
          Tidak ada pesan dalam kategori ini.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpenMessage(msg)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                !msg.read
                  ? 'bg-sky-500/10 border-sky-500/30 text-slate-100'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-3">
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                  )}
                  <span className="font-bold text-sm">{msg.name}</span>
                  <span className="text-xs text-slate-400 font-mono">({msg.email})</span>
                  <span className="text-[10px] text-slate-500 font-mono ml-auto sm:ml-2">{msg.createdAt}</span>
                </div>
                <h4 className="text-xs font-semibold text-sky-300">{msg.subject}</h4>
                <p className="text-xs text-slate-400 line-clamp-1">{msg.message}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => handleToggleReadStatus(msg, e)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 hover:text-sky-400"
                >
                  {msg.read ? 'Tandai Belum Dibaca' : 'Tandai Dibaca'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingId(msg.id);
                  }}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-rose-400 hover:bg-rose-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Modal Detail */}
      {activeMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100">
            <button
              onClick={() => setActiveMessageModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-2 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base">{activeMessageModal.subject}</h3>
                  <p className="text-xs text-slate-400 font-mono">{activeMessageModal.createdAt}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">Dari Pengirim:</span>
                  <span className="font-bold text-slate-200">{activeMessageModal.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-mono text-sky-400">{activeMessageModal.email}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Isi Pesan:</h4>
                <p className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {activeMessageModal.message}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={`mailto:${activeMessageModal.email}?subject=Re: ${encodeURIComponent(activeMessageModal.subject)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-lg"
                >
                  <Reply className="w-4 h-4" />
                  <span>Balas Via Email</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDeletingId(activeMessageModal.id)}
                    className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveMessageModal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingId}
        title="Hapus Pesan?"
        message="Apakah Anda yakin ingin menghapus pesan ini dari inbox?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
