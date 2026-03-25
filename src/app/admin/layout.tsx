'use client';

import { useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, signOut, User,
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Shield, LogOut, Loader2 } from 'lucide-react';

const googleProvider = new GoogleAuthProvider();

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleEmailLogin = async () => {
    setError('');
    setSigningIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Email hoặc mật khẩu không đúng');
    } finally {
      setSigningIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setError('Đăng nhập Google thất bại');
    } finally {
      setSigningIn(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="animate-spin text-violet-400" size={32} />
      </div>
    );
  }

  // ── Login screen ──────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">

          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-violet-500/10 rounded-2xl border border-violet-500/20">
              <Shield size={28} className="text-violet-400" />
            </div>
            <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
            <p className="text-zinc-500 text-sm">HubGame Management</p>
          </div>

          {/* Google login */}
          <button
            onClick={handleGoogleLogin}
            disabled={signingIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 disabled:opacity-50 text-zinc-900 font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            {/* Google icon SVG */}
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.1l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.5 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"/>
            </svg>
            Đăng nhập bằng Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-zinc-600 text-xs">hoặc</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Email/Password */}
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500/50"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500/50"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              onClick={handleEmailLogin}
              disabled={signingIn}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {signingIn && <Loader2 size={15} className="animate-spin" />}
              Đăng nhập bằng Email
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ── Admin shell ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/95 backdrop-blur z-50">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-violet-500/10 rounded-lg border border-violet-500/20">
            <Shield size={16} className="text-violet-400" />
          </div>
          <span className="font-bold text-sm tracking-wide">HubGame Admin</span>
        </div>
        <div className="flex items-center gap-3">
          {user.photoURL && (
            <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" referrerPolicy="no-referrer" />
          )}
          <span className="text-zinc-500 text-xs hidden sm:block">{user.email}</span>
          <button
            onClick={() => signOut(auth)}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <LogOut size={14} className="text-zinc-400" />
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
