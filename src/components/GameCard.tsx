import React from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { motion } from 'motion/react';

interface GameCardProps {
  title: string;
  slug: string;
  thumbnail: string;
  description: string;
}

const GameCard: React.FC<GameCardProps> = ({ title, slug, thumbnail, description }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-lg"
    >
      <Link href={`/play/${slug}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="bg-emerald-500 p-2 rounded-full shadow-lg">
              <Play size={16} className="text-black fill-current" />
            </div>
            <span className="text-white font-medium text-sm drop-shadow-md">Play Now</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
          <p className="text-zinc-400 text-xs line-clamp-2">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default GameCard;
