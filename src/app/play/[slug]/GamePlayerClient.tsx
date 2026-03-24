'use client';

// src/app/play/[slug]/GamePlayerClient.tsx
// ──────────────────────────────────────────────────────────────
// Client Component: load iframe Godot, nhận score qua postMessage,
// tăng play count khi game bắt đầu
// ──────────────────────────────────────────────────────────────

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '../../../stores/useGameStore';
import { ChevronLeft, Trophy, Share2, Maximize2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { incrementPlayCount } from '../../../lib/gamesFirestore';
import type { Game } from '../../../types/game';

interface GamePlayerClientProps {
  game: Game | null;
  slug: string;
}

export default function GamePlayerClient({ game, slug }: GamePlayerClientProps) {
  const router = useRouter();
  const { setCurrentScore, setHighScore, highScore } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showScoreToast, setShowScoreToast] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [mounted, setMounted] = useState(false);
  const hasTrackedPlay = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Tăng play count một lần khi iframe load xong ────────────
  useEffect(() => {
    if (!mounted || !game || hasTrackedPlay.current) return;
    hasTrackedPlay.current = true;
    incrementPlayCount(game.id);
  }, [mounted, game]);

  // ── Nhận score từ iframe Godot qua postMessage ──────────────
  useEffect(() => {
    if (!mounted) return;
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SEND_SCORE') {
        const score = event.data.score as number;
        setLastScore(score);
        setCurrentScore(score);
        if (slug) setHighScore(slug, score);
        setShowScoreToast(true);
        setTimeout(() => setShowScoreToast(false), 3000);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [mounted, slug, setCurrentScore, setHighScore]);

  // ── Fullscreen ──────────────────────────────────────────────
  const handleFullscreen = () => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe[title="Game Player"]');
    if (iframe?.requestFullscreen) iframe.requestFullscreen();
  };

  // ── Share ───────────────────────────────────────────────────
  const handleShare = () => {
    if (navigator.share && game) {
      navigator.share({
        title: game.title,
        text: game.description,
        url: window.location.origin + `/game/${slug}`,
      });
    }
  };

  if (!mounted) return <div className="h-screen w-full bg-black" />;

  // ── Game không tìm thấy ─────────────────────────────────────
  if (!game) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center gap-4 text-white">
        <AlertTriangle size={40} className="text-amber-400" />
        <h1 className="text-xl font-bold">Game không tồn tại</h1>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-emerald-500 text-black font-bold rounded-xl"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  const iframeUrl = game.assets.iframe_url;
  const bestScore = highScore[slug] ?? 0;

  return (
    <div className="h-screen w-full bg-black flex flex-col overflow-hidden">

      {/* ── Top Bar ──────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-white/10 z-10 shrink-0"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
            aria-label="Quay lại"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div>
            <h2 className="text-white font-bold text-sm">{game.title}</h2>
            <div className="flex items-center gap-1.5">
              <Trophy size={10} className="text-amber-400" />
              <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                Kỷ lục: {bestScore}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
            aria-label="Chia sẻ"
          >
            <Share2 size={18} className="text-white" />
          </button>
          <button
            onClick={handleFullscreen}
            className="p-2 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
            aria-label="Toàn màn hình"
          >
            <Maximize2 size={18} className="text-white" />
          </button>
        </div>
      </motion.header>

      {/* ── Game iframe ──────────────────────────────────────── */}
      <div className="flex-1 relative bg-zinc-950 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black z-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
            />
            <p className="text-zinc-500 text-xs font-medium animate-pulse">
              Đang tải game...
            </p>
          </div>
        )}
        <iframe
          src={iframeUrl}
          className="w-full h-full border-none"
          title="Game Player"
          onLoad={() => setIsLoading(false)}
          allow="autoplay; fullscreen; cross-origin-isolated"
        />
      </div>

      {/* ── Score Toast ──────────────────────────────────────── */}
      <AnimatePresence>
        {showScoreToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-6 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-3 z-50"
          >
            <Trophy size={20} fill="black" />
            <span>Điểm mới: {lastScore}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
