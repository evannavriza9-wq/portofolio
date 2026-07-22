import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, KeyRound, Loader2, Info } from 'lucide-react';
import { portfolioApi } from '../../services/api';
import { ToastType, AdminUser } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser, token: string) => void;
  onShowToast: (title: string, message: string, type: ToastType) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onShowToast, onBackToSite }) => {
  const [email, setEmail] = useState('admin@evan.dev');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await portfolioApi.loginAdmin(email, password);
      setIsLoading(false);

      if (res.success && res.user && res.token) {
        if (rememberMe) {
          localStorage.setItem('admin_token', res.token);
        }
        onShowToast('Login Berhasil', `Selamat datang kembali, ${res.user.name}`, 'success');
        onLoginSuccess(res.user, res.token);
      } else {
        setErrorMsg(res.error || 'Email atau password salah');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Gagal login. Coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-slate-100">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 mx-auto flex items-center justify-center shadow-lg shadow-sky-500/20 mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Admin Dashboard Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Masuk untuk mengelola seluruh konten portofolio Evan Akbar</p>
        </div>

        {/* Credentials Helper Box */}
        <div className="mb-6 p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 flex items-start gap-3">
          <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Kredensial Demo Admin:</span>
            <p className="font-mono text-[11px] text-slate-300">Email: <strong className="text-sky-300">admin@evan.dev</strong></p>
            <p className="font-mono text-[11px] text-slate-300">Password: <strong className="text-sky-300">password123</strong></p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@evan.dev"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-sky-500 focus:ring-0"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/25 transition-all mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>Masuk Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <button
            onClick={onBackToSite}
            className="text-xs text-slate-400 hover:text-sky-400 underline underline-offset-4 font-mono transition-colors"
          >
            ← Kembali ke Website Utama
          </button>
        </div>
      </div>
    </div>
  );
};
