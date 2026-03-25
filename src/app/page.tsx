// src/app/page.tsx — Trang chủ, lấy data từ Firestore
'use client';

import React, { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import { useGameStore } from '../stores/useGameStore';
import { Trophy, Gamepad2, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getAllGames } from '../lib/gamesFirestore';
import type { GameSummary } from '../types/game';

const HomePage: React.FC = () => {
  const { highScore } = useGameStore();
  const [games, setGames] = useState<GameSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getAllGames().then((data) => {
      setGames(data);
      setLoading(false);
    });
  }, []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8 pt-4 px-2"
      >
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20">
            <Gamepad2 size={24} className="text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">HubGame</h1>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Mini Game Portal</p>
          </div>
        </div>
        <div className="bg-zinc-900/50 p-2 rounded-full border border-white/5">
          <Sparkles size={20} className="text-amber-400" />
        </div>
      </motion.header>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <div className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
          <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Tổng game</span>
          <span className="text-2xl font-bold">{loading ? '—' : games.length}</span>
        </div>
        <div className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
          <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">High Scores</span>
          <div className="flex items-center gap-1.5">
            <Trophy size={14} className="text-amber-400" />
            <span className="text-2xl font-bold">{Object.keys(highScore).length}</span>
          </div>
        </div>
      </motion.div>

      {/* Game Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-400" size={28} />
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <Gamepad2 size={40} className="mx-auto mb-3 text-zinc-800" />
          <p>Chưa có game nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.08 }}
            >
              <GameCard {...game} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none">
        <div className="max-w-md mx-auto bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center justify-center gap-2 pointer-events-auto shadow-2xl">
          <span className="text-zinc-400 text-xs font-medium">Powered by Godot 4 & Next.js</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
