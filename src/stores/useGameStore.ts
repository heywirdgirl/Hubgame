import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  currentScore: number;
  highScore: Record<string, number>; // slug -> score
  currentGameSlug: string | null;
  setCurrentScore: (score: number) => void;
  setHighScore: (slug: string, score: number) => void;
  setCurrentGameSlug: (slug: string | null) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      currentScore: 0,
      highScore: {},
      currentGameSlug: null,
      setCurrentScore: (score) => set({ currentScore: score }),
      setHighScore: (slug, score) =>
        set((state) => {
          const currentBest = state.highScore[slug] || 0;
          if (score > currentBest) {
            return {
              highScore: { ...state.highScore, [slug]: score },
            };
          }
          return state;
        }),
      setCurrentGameSlug: (slug) => set({ currentGameSlug: slug }),
    }),
    {
      name: 'mini-game-portal-storage',
    }
  )
);
