import React, { useState } from 'react';
import { Mail, Send, MapPin, Phone, MessageSquare, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { ProfileData, ToastType } from '../types';
import { portfolioApi } from '../services/api';

interface ContactProps {
  profile: ProfileData;
  onShowToast: (title: string, message: string, type: ToastType) => void;
}

export const Contact: React.FC<ContactProps> = ({ profile, onShowToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      onShowToast('Form Tidak Lengkap', 'Mohon isi Nama, Email, dan Pesan Anda.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await portfolioApi.sendMessage(formData);
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      onShowToast('Pesan Terkirim!', 'Terima kasih telah menghubungi Evan. Pesan telah masuk ke Admin Dashboard.', 'success');
      setTimeout(() => setSubmittedSuccess(false), 5000);
    } catch (err) {
      setIsSubmitting(false);
      onShowToast('Gagal Mengirim', 'Terjadi kesalahan saat membuat pesan. Coba lagi.', 'error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Let's Build Something Together
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Have a project idea, web application request, or collaboration in mind? Feel free to send a message!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-6">
              <h3 className="text-xl font-bold text-slate-100">Contact Information</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                I am currently open for full-stack web development projects, custom software requests, and UI/UX consultations.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 block uppercase">Email Direct</span>
                    <a href={`mailto:${profile.email}`} className="text-sm font-medium text-slate-200 hover:text-sky-400 transition-colors">
                      {profile.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 block uppercase">Phone / WhatsApp</span>
                    <span className="text-sm font-medium text-slate-200">{profile.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 block uppercase">Location</span>
                    <span className="text-sm font-medium text-slate-200">{profile.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 to-blue-600/10 border border-sky-500/20">
                <p className="text-xs text-sky-300">
                  ⚡ Response Time: Usually within 24 hours on business days.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Send Me a Message</h3>
                  <p className="text-xs text-slate-400">Direct form connected to live Admin Dashboard</p>
                </div>
                <MessageSquare className="w-6 h-6 text-sky-400" />
              </div>

              {submittedSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Pesan Anda berhasil dikirim! Evan akan membalas via email secepatnya.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Nama Lengkap <span className="text-sky-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama Anda"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500/60 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Alamat Email <span className="text-sky-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500/60 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Subjek / Topik
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Diskusi Proyek Website Custom"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Pesan Anda <span className="text-sky-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan detail proyek, ide, atau pertanyaan Anda di sini..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500/60 transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/25 transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim Pesan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Pesan Sekarang</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
