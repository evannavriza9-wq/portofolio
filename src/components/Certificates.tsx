import React, { useState } from 'react';
import { Award, ExternalLink, ShieldCheck, Eye, X, Calendar, CheckCircle2 } from 'lucide-react';
import { CertificateItem } from '../types';

interface CertificatesProps {
  certificates: CertificateItem[];
}

export const Certificates: React.FC<CertificatesProps> = ({ certificates }) => {
  const [activeCert, setActiveCert] = useState<CertificateItem | null>(null);

  return (
    <section id="certificates" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Certificates & Qualifications
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Verified industry certifications and course completions in software engineering and design.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group rounded-3xl bg-slate-900/60 border border-slate-800/80 overflow-hidden flex flex-col justify-between hover:border-sky-500/40 transition-all duration-300 backdrop-blur-md hover:-translate-y-1"
            >
              <div>
                {/* Image Preview Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>

                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Verified</span>
                  </div>

                  <button
                    onClick={() => setActiveCert(cert)}
                    className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                </div>

                {/* Details */}
                <div className="p-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>Issued: {cert.issueDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-sky-400 transition-colors">
                    {cert.title}
                  </h3>

                  <p className="text-xs text-slate-400">
                    Issuer: <span className="text-slate-200 font-medium">{cert.issuer}</span>
                  </p>

                  {cert.credentialId && (
                    <p className="text-[11px] font-mono text-slate-500 truncate">
                      ID: {cert.credentialId}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Link */}
              <div className="p-6 pt-0 border-t border-slate-800/50 mt-4 flex items-center justify-between text-xs">
                {cert.verifyUrl ? (
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Verifikasi Sertifikat</span>
                  </a>
                ) : (
                  <span className="text-slate-500 text-[11px]">Original Credential</span>
                )}

                <button
                  onClick={() => setActiveCert(cert)}
                  className="text-slate-400 hover:text-slate-200 font-mono text-[11px]"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Certificate Preview */}
        {activeCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100">
              <button
                onClick={() => setActiveCert(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-slate-100">{activeCert.title}</h3>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-[16/10] bg-slate-950">
                  <img src={activeCert.imageUrl} alt={activeCert.title} className="w-full h-full object-cover" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 font-mono block">Penerbit</span>
                    <span className="font-semibold text-slate-200">{activeCert.issuer}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono block">Tahun Terbit</span>
                    <span className="font-semibold text-slate-200">{activeCert.issueDate}</span>
                  </div>
                  {activeCert.credentialId && (
                    <div className="col-span-2">
                      <span className="text-slate-500 font-mono block">Credential ID</span>
                      <span className="font-mono text-sky-400">{activeCert.credentialId}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  {activeCert.verifyUrl && (
                    <a
                      href={activeCert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-lg shadow-sky-500/20"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Buka Link Verifikasi</span>
                    </a>
                  )}
                  <button
                    onClick={() => setActiveCert(null)}
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
