'use client';

// src/app/admin/page.tsx
// Trang admin chính: danh sách game + nút thêm/sửa/xoá
// Khi thêm game đầu tiên → Firestore tự tạo collection 'games'

import { useEffect, useState } from 'react';
import {
  collection, getDocs, deleteDoc, doc, query, orderBy,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Game } from '../../types/game';
import {
  Plus, Pencil, Trash2, Loader2, Gamepad2,
  Eye, EyeOff, Star, TrendingUp, RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GameFormModal from './GameFormModal';

const STATUS_STYLE: Record<string, string> = {
  published: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  beta:      'bg-amber-500/10  text-amber-400  border-amber-500/20',
  maintenance: 'bg-red-500/10 text-red-400 border-red-500/20',
};
const STATUS_LABEL: Record<string, string> = {
  published: 'Đã đăng', beta: 'Beta', maintenance: 'Bảo trì',
};

export default function AdminPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editGame, setEditGame] = useState<Game | null>(null);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'games'), orderBy('created_at', 'desc'));
      const snap = await getDocs(q);
      setGames(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Game, 'id'>) }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGames(); }, []);

  const handleDelete = async (game: Game) => {
    if (!confirm(`Xoá game "${game.title}"?`)) return;
    setDeleting(game.id);
    await deleteDoc(doc(db, 'games', game.id));
    setGames((prev) => prev.filter((g) => g.id !== game.id));
    setDeleting(null);
  };

  const openAdd = () => { setEditGame(null); setModalOpen(true); };
  const openEdit = (game: Game) => { setEditGame(game); setModalOpen(true); };
  const handleSaved = () => { setModalOpen(false); fetchGames(); };

  // ── Stats tổng hợp ────────────────────────────────────────
  const totalPlays = games.reduce((s, g) => s + (g.stats?.plays ?? 0), 0);
  const published  = games.filter((g) => g.status === 'published').length;
  const featured   = games.filter((g) => g.is_featured).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Game</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {games.length} game trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchGames}
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl transition-colors"
          >
            <RefreshCw size={16} className="text-zinc-400" />
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
          >
            <Plus size={16} />
            Thêm game
          </button>
        </div>
      </div>

      {/* ── Stats cards ────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Gamepad2,  color: 'text-violet-400', label: 'Tổng game',    value: games.length },
          { icon: TrendingUp, color: 'text-emerald-400', label: 'Lượt chơi',  value: totalPlays >= 1000 ? `${(totalPlays/1000).toFixed(1)}k` : totalPlays },
          { icon: Star,      color: 'text-amber-400',   label: 'Nổi bật',     value: featured },
        ].map(({ icon: Icon, color, label, value }) => (
          <div key={label} className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4">
            <Icon size={18} className={color} />
            <div className="mt-3">
              <p className="text-zinc-500 text-[11px] uppercase font-bold tracking-wider">{label}</p>
              <p className="text-2xl font-bold mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Game list ──────────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-violet-400" size={28} />
        </div>
      ) : games.length === 0 ? (
        // ── Empty state ──────────────────────────────────────
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 space-y-4"
        >
          <div className="inline-flex p-5 bg-zinc-900 rounded-3xl border border-white/5">
            <Gamepad2 size={40} className="text-zinc-700" />
          </div>
          <div>
            <p className="text-zinc-400 font-medium">Chưa có game nào</p>
            <p className="text-zinc-600 text-sm mt-1">
              Nhấn "Thêm game" để tạo game đầu tiên — Firestore sẽ tự tạo collection
            </p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            <Plus size={16} />
            Thêm game đầu tiên
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {games.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-white/10 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-16 h-12 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                  {game.assets?.icon ? (
                    <img src={game.assets.icon} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gamepad2 size={18} className="text-zinc-600" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm truncate">{game.title}</span>
                    {game.is_featured && (
                      <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[game.status]}`}>
                      {STATUS_LABEL[game.status]}
                    </span>
                    <span className="text-zinc-600 text-xs">{game.category}</span>
                    <span className="text-zinc-600 text-xs">/{game.slug}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-4 text-center shrink-0">
                  <div>
                    <p className="text-xs font-bold">{(game.stats?.plays ?? 0) >= 1000 ? `${((game.stats?.plays ?? 0)/1000).toFixed(1)}k` : (game.stats?.plays ?? 0)}</p>
                    <p className="text-[10px] text-zinc-600">lượt chơi</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold">{(game.stats?.rating_avg ?? 0).toFixed(1)}</p>
                    <p className="text-[10px] text-zinc-600">rating</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`/game/${game.slug}`}
                    target="_blank"
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    title="Xem trang"
                  >
                    <Eye size={14} className="text-zinc-400" />
                  </a>
                  <button
                    onClick={() => openEdit(game)}
                    className="p-2 bg-zinc-800 hover:bg-violet-500/20 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Pencil size={14} className="text-zinc-400 hover:text-violet-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(game)}
                    disabled={deleting === game.id}
                    className="p-2 bg-zinc-800 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                    title="Xoá"
                  >
                    {deleting === game.id
                      ? <Loader2 size={14} className="animate-spin text-zinc-400" />
                      : <Trash2 size={14} className="text-zinc-400" />
                    }
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── Form Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <GameFormModal
            game={editGame}
            onClose={() => setModalOpen(false)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
