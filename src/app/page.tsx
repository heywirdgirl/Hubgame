// Mini-Game Portal Homepage
'use client';

import React, { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import { useGameStore } from '../stores/useGameStore';
import { Trophy, Gamepad2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { games } from '../lib/games';

const HomePage: React.FC = () => {
  const { highScore } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
            <h1 className="text-2xl font-bold tracking-tight">Game Portal</h1>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Mini Games Shell</p>
          </div>
        </div>
        <div className="bg-zinc-900/50 p-2 rounded-full border border-white/5">
          <Sparkles size={20} className="text-amber-400" />
        </div>
      </motion.header>

      {/* Stats Quick View */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <div className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
          <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Total Games</span>
          <span className="text-2xl font-bold">{games.length}</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {games.map((game, index) => (
          <motion.div
            key={game.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <GameCard {...game} />
          </motion.div>
        ))}
      </div>

      {/* Footer / Telegram Mini App Style */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none">
        <div className="max-w-md mx-auto bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center justify-center gap-2 pointer-events-auto shadow-2xl">
          <span className="text-zinc-400 text-xs font-medium">Powered by Godot 4 & Next.js</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
