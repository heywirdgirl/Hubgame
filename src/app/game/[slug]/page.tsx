import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getGameBySlug } from '../../../lib/games';
import { Play, ArrowLeft, Trophy, Users, Star } from 'lucide-react';

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return {
      title: 'Game Not Found',
    };
  }

  return {
    title: `${game.title} | Play Free Online`,
    description: game.description,
    openGraph: {
      title: game.title,
      description: game.description,
      images: [game.thumbnail],
    },
  };
}

export default async function GameDetailsPage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="p-4 flex items-center border-b border-white/10 bg-zinc-950 sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Games</span>
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Image & Quick Stats */}
          <div className="space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={game.thumbnail}
                alt={`${game.title} gameplay screenshot`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-900 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center gap-2">
                <Users size={20} className="text-blue-400" />
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Players</span>
                <span className="font-semibold">10k+</span>
              </div>
              <div className="bg-zinc-900 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center gap-2">
                <Star size={20} className="text-amber-400" />
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Rating</span>
                <span className="font-semibold">4.8/5</span>
              </div>
              <div className="bg-zinc-900 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center gap-2">
                <Trophy size={20} className="text-emerald-400" />
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Rank</span>
                <span className="font-semibold">Top 10</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Play Button */}
          <div className="flex flex-col h-full justify-center space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{game.title}</h1>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs font-medium border border-white/5">Action</span>
                <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs font-medium border border-white/5">Singleplayer</span>
                <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs font-medium border border-white/5">Web Browser</span>
              </div>
              <p className="text-zinc-400 text-lg leading-relaxed">
                {game.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link
                href={`/play/${game.slug}`}
                className="group relative flex items-center justify-center gap-3 w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xl py-5 px-8 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]"
              >
                <Play size={24} className="fill-current" />
                <span>Play Game Now</span>
                <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
              </Link>
              <p className="text-center text-zinc-500 text-sm mt-4">
                Free to play • No download required
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
