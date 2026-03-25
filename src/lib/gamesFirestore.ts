import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  increment,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Game, GameSummary } from '../types/game';

const GAMES_COLLECTION = 'games';

// ──────────────────────────────────────────────
// Helper: chuyển Firestore document → Game object
// ──────────────────────────────────────────────
function docToGame(id: string, data: Record<string, unknown>): Game {
  return {
    id,
    slug: data.slug as string,
    title: data.title as string,
    category: data.category as string,
    tags: (data.tags as string[]) ?? [],
    description: data.description as string,
    content: (data.content as string) ?? '',
    version: (data.version as string) ?? '1.0.0',
    is_featured: (data.is_featured as boolean) ?? false,
    status: (data.status as Game['status']) ?? 'published',
    seo: data.seo as Game['seo'],
    assets: data.assets as Game['assets'],
    stats: (data.stats as Game['stats']) ?? {
      plays: 0,
      likes: 0,
      rating_avg: 0,
      rating_count: 0,
    },
    leaderboard_id: data.leaderboard_id as string | undefined,
    created_at:
      data.created_at instanceof Timestamp
        ? data.created_at.toDate().toISOString()
        : (data.created_at as string),
    updated_at:
      data.updated_at instanceof Timestamp
        ? data.updated_at.toDate().toISOString()
        : (data.updated_at as string),
  };
}

// ──────────────────────────────────────────────
// Lấy game theo slug — dùng cho generateMetadata
// và trang chi tiết/play
// ──────────────────────────────────────────────
export async function getGameBySlug(slug: string): Promise<Game | null> {
  try {
    const q = query(
      collection(db, GAMES_COLLECTION),
      where('slug', '==', slug),
      where('status', '==', 'published'),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docSnap = snap.docs[0];
    return docToGame(docSnap.id, docSnap.data() as Record<string, unknown>);
  } catch (err) {
    console.error('[getGameBySlug] error:', err);
    return null;
  }
}

// ──────────────────────────────────────────────
// Lấy game theo Document ID — nhanh hơn khi đã biết ID
// ──────────────────────────────────────────────
export async function getGameById(id: string): Promise<Game | null> {
  try {
    const docSnap = await getDoc(doc(db, GAMES_COLLECTION, id));
    if (!docSnap.exists()) return null;
    return docToGame(docSnap.id, docSnap.data() as Record<string, unknown>);
  } catch (err) {
    console.error('[getGameById] error:', err);
    return null;
  }
}

// ──────────────────────────────────────────────
// Lấy danh sách game cho trang chủ
// ──────────────────────────────────────────────
export async function getAllGames(): Promise<GameSummary[]> {
  try {
    // Chỉ where status — không orderBy nhiều field để tránh cần Composite Index
    const q = query(
      collection(db, GAMES_COLLECTION),
      where('status', '==', 'published')
    );
    const snap = await getDocs(q);
    const games = snap.docs.map((d) => {
      const game = docToGame(d.id, d.data() as Record<string, unknown>);
      return {
        id: game.id,
        slug: game.slug,
        title: game.title,
        category: game.category,
        tags: game.tags,
        description: game.description,
        is_featured: game.is_featured,
        status: game.status,
        assets: game.assets,
        stats: game.stats,
      } satisfies GameSummary;
    });

    // Sort trên client: featured lên đầu → sau đó theo lượt chơi
    return games.sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return (b.stats?.plays ?? 0) - (a.stats?.plays ?? 0);
    });
  } catch (err) {
    console.error('[getAllGames] error:', err);
    return [];
  }
}

// ──────────────────────────────────────────────
// Lấy game nổi bật (featured) cho hero section
// ──────────────────────────────────────────────
export async function getFeaturedGames(maxItems = 3): Promise<GameSummary[]> {
  try {
    const q = query(
      collection(db, GAMES_COLLECTION),
      where('status', '==', 'published'),
      where('is_featured', '==', true),
      orderBy('stats.plays', 'desc'),
      limit(maxItems)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const game = docToGame(d.id, d.data() as Record<string, unknown>);
      return {
        id: game.id,
        slug: game.slug,
        title: game.title,
        category: game.category,
        tags: game.tags,
        description: game.description,
        is_featured: game.is_featured,
        status: game.status,
        assets: game.assets,
        stats: game.stats,
      } satisfies GameSummary;
    });
  } catch (err) {
    console.error('[getFeaturedGames] error:', err);
    return [];
  }
}

// ──────────────────────────────────────────────
// Tăng play_count mỗi khi người dùng bắt đầu chơi
// Gọi từ client component trong /play/[slug]/page.tsx
// ──────────────────────────────────────────────
export async function incrementPlayCount(gameId: string): Promise<void> {
  try {
    await updateDoc(doc(db, GAMES_COLLECTION, gameId), {
      'stats.plays': increment(1),
    });
  } catch (err) {
    console.error('[incrementPlayCount] error:', err);
  }
}

// ──────────────────────────────────────────────
// Lấy slug của tất cả game — dùng cho generateStaticParams
// giúp Next.js pre-render tất cả trang game khi build
// ──────────────────────────────────────────────
export async function getAllGameSlugs(): Promise<string[]> {
  try {
    const q = query(
      collection(db, GAMES_COLLECTION),
      where('status', '==', 'published')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => (d.data() as { slug: string }).slug);
  } catch (err) {
    console.error('[getAllGameSlugs] error:', err);
    return [];
  }
}
