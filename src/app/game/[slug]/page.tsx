// src/app/game/[slug]/page.tsx
// ──────────────────────────────────────────────────────────────
// Trang chi tiết game — Server Component
// generateMetadata tự động lấy dữ liệu từ Firestore theo slug
// và tạo đầy đủ <title>, <meta>, Open Graph, Twitter Card
// ──────────────────────────────────────────────────────────────

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Play, ArrowLeft, Trophy, Users, Star, Tag, Info } from 'lucide-react';
import { getGameBySlug, getAllGameSlugs } from '../../../lib/gamesFirestore';

// ── Kiểu props ──────────────────────────────────────────────
interface GamePageProps {
  params: Promise<{ slug: string }>;
}

// ── generateStaticParams ─────────────────────────────────────
// Pre-render tất cả trang game lúc build → tốc độ tải nhanh nhất
export async function generateStaticParams() {
  const slugs = await getAllGameSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ── generateMetadata ─────────────────────────────────────────
// Next.js tự động chèn vào <head> cho mỗi trang game
export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    return { title: 'Game không tồn tại | HubGame' };
  }

  const appUrl = process.env.APP_URL ?? 'https://hubgame.app';
  const canonicalUrl = `${appUrl}/game/${game.slug}`;

  return {
    // ── Thẻ <title> ──────────────────────────────────────────
    title: game.seo.meta_title,

    // ── <meta name="description"> ────────────────────────────
    description: game.seo.meta_desc,

    // ── <meta name="keywords"> ───────────────────────────────
    keywords: game.seo.keywords,

    // ── Canonical URL ────────────────────────────────────────
    alternates: { canonical: canonicalUrl },

    // ── Open Graph (Facebook / Zalo / Telegram) ──────────────
    openGraph: {
      title: game.seo.meta_title,
      description: game.seo.meta_desc,
      url: canonicalUrl,
      siteName: 'HubGame',
      type: 'website',
      images: [
        {
          url: game.assets.og_image,
          width: 1200,
          height: 630,
          alt: game.title,
        },
      ],
    },

    // ── Twitter Card ─────────────────────────────────────────
    twitter: {
      card: 'summary_large_image',
      title: game.seo.meta_title,
      description: game.seo.meta_desc,
      images: [game.assets.og_image],
    },

    // ── Robots ───────────────────────────────────────────────
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

// ── Page Component ───────────────────────────────────────────
export default async function GameDetailsPage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) notFound();

  const statusLabel: Record<string, string> = {
    published: '',
    beta: '🧪 Beta',
    maintenance: '🔧 Bảo trì',
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Navigation ─────────────────────────────────────── */}
      <nav className="p-4 flex items-center border-b border-white/10 bg-zinc-950 sticky top-0 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Về trang chủ</span>
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          {/* ── Cột trái: Ảnh & Stats ──────────────────────── */}
          <div className="space-y-6">
            {/* Cover image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={game.assets.cover}
                alt={`${game.title} gameplay screenshot`}
                className="w-full h-full object-cover"
              />
              {game.status !== 'published' && (
                <span className="absolute top-3 right-3 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                  {statusLabel[game.status]}
                </span>
              )}
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-zinc-900 p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2 text-center">
                <Users size={20} className="text-blue-400" />
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Lượt chơi</span>
                <span className="font-semibold text-sm">
                  {game.stats.plays >= 1000
                    ? `${(game.stats.plays / 1000).toFixed(1)}k`
                    : game.stats.plays}
                </span>
              </div>
              <div className="bg-zinc-900 p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2 text-center">
                <Star size={20} className="text-amber-400" />
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Đánh giá</span>
                <span className="font-semibold text-sm">
                  {game.stats.rating_avg > 0
                    ? `${game.stats.rating_avg.toFixed(1)}/5`
                    : '—'}
                </span>
              </div>
              <div className="bg-zinc-900 p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2 text-center">
                <Trophy size={20} className="text-emerald-400" />
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Thích</span>
                <span className="font-semibold text-sm">{game.stats.likes}</span>
              </div>
            </div>

            {/* Tags */}
            {game.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-xs border border-white/5"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Cột phải: Thông tin & Nút chơi ────────────── */}
          <div className="flex flex-col space-y-6">
            <span className="inline-block w-fit px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
              {game.category}
            </span>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              {game.title}
            </h1>

            <p className="text-zinc-400 text-base leading-relaxed">
              {game.description}
            </p>

            <Link
              href={`/play/${game.slug}`}
              className="group relative flex items-center justify-center gap-3 w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xl py-5 px-8 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]"
            >
              <Play size={24} className="fill-current" />
              <span>Chơi ngay — Miễn phí</span>
              <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
            </Link>

            <p className="text-center text-zinc-500 text-xs">
              Không cần tải về • Chơi trực tiếp trên trình duyệt
            </p>

            {game.content && (
              <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-zinc-300 font-semibold text-sm mb-2">
                  <Info size={16} className="text-emerald-400" />
                  Hướng dẫn chơi
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                  {game.content}
                </p>
              </div>
            )}

            <p className="text-zinc-600 text-xs text-right">
              Phiên bản {game.version}
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
