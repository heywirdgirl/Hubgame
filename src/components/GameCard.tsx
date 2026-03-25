import React from 'react';
import Link from 'next/link';
import { Play, Star } from 'lucide-react';
import { motion } from 'motion/react';
import type { GameSummary } from '../types/game';

const GameCard: React.FC<GameSummary> = ({ title, slug, description, assets, stats, is_featured, category }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-lg"
    >
      <Link href={`/game/${slug}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={assets.cover || assets.icon}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Featured badge */}
          {is_featured && (
            <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star size={10} className="text-black fill-black" />
              <span className="text-black text-[10px] font-bold">Nổi bật</span>
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="bg-emerald-500 p-2 rounded-full shadow-lg">
              <Play size={16} className="text-black fill-current" />
            </div>
            <span className="text-white font-medium text-sm drop-shadow-md">Chơi ngay</span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-white font-semibold text-base leading-tight">{title}</h3>
            <span className="text-zinc-500 text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full shrink-0">{category}</span>
          </div>
          <p className="text-zinc-400 text-xs line-clamp-2 mb-2">{description}</p>

          {/* Mini stats */}
          {stats && (
            <div className="flex items-center gap-3 text-zinc-600 text-[11px]">
              <span>🎮 {stats.plays >= 1000 ? `${(stats.plays / 1000).toFixed(1)}k` : stats.plays} lượt</span>
              {stats.rating_avg > 0 && <span>⭐ {stats.rating_avg.toFixed(1)}</span>}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default GameCard;
