import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../../../stores/useGameStore';
import { ChevronLeft, Trophy, Share2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GamePlayer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { setCurrentScore, setHighScore, highScore } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showScoreToast, setShowScoreToast] = useState(false);
  const [lastScore, setLastScore] = useState(0);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: In production, you should check event.origin
      if (event.data && event.data.type === 'SEND_SCORE') {
        const score = event.data.score;
        setLastScore(score);
        setCurrentScore(score);
        if (slug) {
          setHighScore(slug, score);
        }
        setShowScoreToast(true);
        setTimeout(() => setShowScoreToast(false), 3000);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [slug, setCurrentScore, setHighScore]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen w-full bg-black flex flex-col overflow-hidden">
      {/* Top Bar */}
      <motion.header
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="flex items-center justify-between p-4 bg-zinc-900 border-b border-white/10 z-10"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div>
            <h2 className="text-white font-bold text-sm capitalize">{slug?.replace('-', ' ')}</h2>
            <div className="flex items-center gap-1.5">
              <Trophy size={10} className="text-amber-400" />
              <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                Best: {slug ? highScore[slug] || 0 : 0}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors">
            <Share2 size={18} className="text-white" />
          </button>
          <button className="p-2 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors">
            <Maximize2 size={18} className="text-white" />
          </button>
        </div>
      </motion.header>

      {/* Game Iframe Wrapper */}
      <div className="flex-1 relative bg-zinc-950">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black z-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
            />
            <p className="text-zinc-500 text-xs font-medium animate-pulse">Loading Game Engine...</p>
          </div>
        )}
        <iframe
          src={`/games/${slug}/index.html`}
          className="w-full h-full border-none"
          title="Game Player"
          onLoad={() => setIsLoading(false)}
          allow="autoplay; fullscreen; cross-origin-isolated"
        />
      </div>

      {/* Score Notification */}
      <AnimatePresence>
        {showScoreToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-6 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-3 z-50"
          >
            <Trophy size={20} fill="black" />
            <span>Score Updated: {lastScore}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamePlayer;
