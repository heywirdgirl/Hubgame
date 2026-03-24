// src/app/play/[slug]/page.tsx
// ──────────────────────────────────────────────────────────────
// Trang chơi game — Client Component
// generateMetadata (Server) lấy dữ liệu Firestore để tạo SEO
// Client component load iframe Godot + tăng play count
// ──────────────────────────────────────────────────────────────
import { Metadata } from 'next';
import { getGameBySlug } from '../../../lib/gamesFirestore';
import GamePlayerClient from './GamePlayerClient';

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

// ── generateMetadata ─────────────────────────────────────────
export async function generateMetadata({ params }: PlayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) return { title: 'Game không tồn tại | HubGame' };

  const appUrl = process.env.APP_URL ?? 'https://hubgame.app';

  return {
    title: `Đang chơi: ${game.seo.meta_title}`,
    description: game.seo.meta_desc,
    // Trang play không nên bị index (nội dung trùng với /game/[slug])
    robots: { index: false, follow: false },
    openGraph: {
      title: `Đang chơi: ${game.title}`,
      description: game.seo.meta_desc,
      url: `${appUrl}/play/${game.slug}`,
      images: [{ url: game.assets.og_image, width: 1200, height: 630 }],
    },
  };
}

// ── Server Component wrapper ─────────────────────────────────
export default async function PlayPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  // Truyền dữ liệu game đã fetch xuống Client Component
  return <GamePlayerClient game={game} slug={slug} />;
}
