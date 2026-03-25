'use client';

// src/app/admin/GameFormModal.tsx
// Modal thêm / chỉnh sửa game
// Khi save lần đầu → Firestore tự tạo collection 'games'

import { useState, useEffect } from 'react';
import {
  collection, addDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Game, GameStatus } from '../../types/game';
import { X, Loader2, Save, Wand2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  game: Game | null;      // null = thêm mới
  onClose: () => void;
  onSaved: () => void;
}

// Tự động tạo slug từ title
function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // bỏ dấu tiếng Việt
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')   // ký tự đặc biệt → khoảng trắng
    .trim()
    .replace(/\s+/g, '-')           // khoảng trắng → dấu gạch
    .replace(/-+/g, '-')            // nhiều gạch liên tiếp → 1 gạch
    .replace(/^-|-$/g, '');         // bỏ gạch đầu/cuối
}

const CATEGORIES = ['Giải đố', 'Logic', 'Hành động', 'Arcade', 'Nhập vai', 'Thể thao', 'Chiến thuật', 'Giáo dục'];

export default function GameFormModal({ game, onClose, onSaved }: Props) {
  const isEdit = !!game;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showSEO, setShowSEO] = useState(false);

  // ── Form state ────────────────────────────────────────────
  const [title, setTitle]             = useState(game?.title ?? '');
  const [slug, setSlug]               = useState(game?.slug ?? '');
  const [slugManual, setSlugManual]   = useState(false);
  const [category, setCategory]       = useState(game?.category ?? 'Giải đố');
  const [description, setDescription] = useState(game?.description ?? '');
  const [content, setContent]         = useState(game?.content ?? '');
  const [tags, setTags]               = useState((game?.tags ?? []).join(', '));
  const [version, setVersion]         = useState(game?.version ?? '1.0.0');
  const [status, setStatus]           = useState<GameStatus>(game?.status ?? 'published');
  const [isFeatured, setIsFeatured]   = useState(game?.is_featured ?? false);

  // Assets
  const [iframeUrl, setIframeUrl] = useState(game?.assets?.iframe_url ?? '');
  const [iconUrl, setIconUrl]     = useState(game?.assets?.icon ?? '');
  const [coverUrl, setCoverUrl]   = useState(game?.assets?.cover ?? '');
  const [ogUrl, setOgUrl]         = useState(game?.assets?.og_image ?? '');
  const [pckUrl, setPckUrl]       = useState(game?.assets?.pck_url ?? '');

  // SEO
  const [metaTitle, setMetaTitle] = useState(game?.seo?.meta_title ?? '');
  const [metaDesc, setMetaDesc]   = useState(game?.seo?.meta_desc ?? '');
  const [keywords, setKeywords]   = useState((game?.seo?.keywords ?? []).join(', '));

  // Auto-generate slug khi gõ title
  useEffect(() => {
    if (!slugManual && !isEdit) {
      setSlug(toSlug(title));
    }
  }, [title, slugManual, isEdit]);

  // Auto-fill SEO nếu chưa nhập
  const autoFillSEO = () => {
    if (!metaTitle) setMetaTitle(`Chơi ${title} Online Miễn Phí | HubGame`);
    if (!metaDesc)  setMetaDesc(description);
    if (!keywords)  setKeywords(tags);
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSave = async () => {
    setError('');
    if (!title.trim())      return setError('Tên game không được trống');
    if (!slug.trim())       return setError('Slug không được trống');
    if (!iframeUrl.trim())  return setError('Đường dẫn game (iframe URL) không được trống');

    setSaving(true);
    try {
      const payload = {
        title:       title.trim(),
        slug:        slug.trim(),
        category,
        description: description.trim(),
        content:     content.trim(),
        tags:        tags.split(',').map((t) => t.trim()).filter(Boolean),
        version:     version.trim(),
        status,
        is_featured: isFeatured,
        seo: {
          meta_title: metaTitle || `Chơi ${title} Online Miễn Phí | HubGame`,
          meta_desc:  metaDesc  || description,
          keywords:   keywords.split(',').map((k) => k.trim()).filter(Boolean),
        },
        assets: {
          icon:        iconUrl.trim()    || `https://picsum.photos/seed/${slug}/200/200`,
          cover:       coverUrl.trim()   || `https://picsum.photos/seed/${slug}-cover/800/450`,
          og_image:    ogUrl.trim()      || `https://picsum.photos/seed/${slug}-og/1200/630`,
          iframe_url:  iframeUrl.trim(),
          ...(pckUrl.trim() ? { pck_url: pckUrl.trim() } : {}),
        },
        stats: game?.stats ?? { plays: 0, likes: 0, rating_avg: 0, rating_count: 0 },
        updated_at: new Date().toISOString(),
      };

      if (isEdit) {
        // Cập nhật document cũ
        await updateDoc(doc(db, 'games', game.id), payload);
      } else {
        // Thêm mới → Firestore tự tạo collection 'games' nếu chưa có
        await addDoc(collection(db, 'games'), {
          ...payload,
          created_at: new Date().toISOString(),
        });
      }

      onSaved();
    } catch (err) {
      console.error(err);
      setError('Lưu thất bại. Kiểm tra kết nối Firebase.');
    } finally {
      setSaving(false);
    }
  };

  // ── Input component helper ────────────────────────────────
  const Field = ({
    label, value, onChange, placeholder = '', textarea = false,
    hint = '', required = false,
  }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; textarea?: boolean; hint?: string; required?: boolean;
  }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-3 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-3 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50"
        />
      )}
      {hint && <p className="text-zinc-600 text-[11px]">{hint}</p>}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-[#111118] border border-white/8 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 bg-[#111118] z-10">
          <h2 className="font-bold">{isEdit ? `Sửa: ${game.title}` : 'Thêm game mới'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors">
            <X size={18} className="text-zinc-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* ── Thông tin cơ bản ──────────────────────────── */}
          <Field
            label="Tên game" required value={title}
            onChange={setTitle} placeholder="VD: Puzzle Quest - Giải Đố Siêu Đỉnh"
          />

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Slug (URL) <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                placeholder="puzzle-quest"
                className="flex-1 bg-zinc-800/60 border border-white/8 rounded-xl px-3 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-violet-500/50"
              />
              {!isEdit && (
                <button
                  onClick={() => { setSlug(toSlug(title)); setSlugManual(false); }}
                  className="px-3 bg-zinc-800 hover:bg-zinc-700 border border-white/8 rounded-xl text-zinc-400 transition-colors"
                  title="Tạo tự động từ tên"
                >
                  <Wand2 size={14} />
                </button>
              )}
            </div>
            <p className="text-zinc-600 text-[11px]">hubgame.app/game/{slug || '...'}</p>
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Thể loại</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as GameStatus)}
                className="w-full bg-zinc-800/60 border border-white/8 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50"
              >
                <option value="published">✅ Đã đăng</option>
                <option value="beta">🧪 Beta</option>
                <option value="maintenance">🔧 Bảo trì</option>
              </select>
            </div>
          </div>

          <Field label="Mô tả ngắn" value={description} onChange={setDescription}
            placeholder="Mô tả game hiển thị trên trang chủ..." textarea />

          <Field label="Hướng dẫn chơi (content)" value={content} onChange={setContent}
            placeholder="Cách chơi, mẹo vặt..." textarea />

          <Field label="Tags (cách nhau bằng dấu phẩy)" value={tags} onChange={setTags}
            placeholder="game-giai-do, mien-phi, online"
            hint="Dùng để tìm kiếm và SEO" />

          {/* ── Game Technical ────────────────────────────── */}
          <div className="border-t border-white/5 pt-4 space-y-4">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Kỹ thuật</p>

            <Field label="Iframe URL (đường dẫn index.html)" required
              value={iframeUrl} onChange={setIframeUrl}
              placeholder="/games/puzzle-01/index.html"
              hint="Đường dẫn tới file Godot web export" />

            <div className="grid grid-cols-2 gap-4">
              <Field label="Phiên bản" value={version} onChange={setVersion} placeholder="1.0.0" />
              <Field label="PCK URL (Mobile)" value={pckUrl} onChange={setPckUrl}
                placeholder="https://..." hint="Tuỳ chọn" />
            </div>

            {/* Checkbox featured */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setIsFeatured(!isFeatured)}
                className={`w-10 h-5 rounded-full transition-colors relative ${isFeatured ? 'bg-violet-600' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isFeatured ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                Game nổi bật (xuất hiện đầu trang chủ)
              </span>
            </label>
          </div>

          {/* ── Assets ────────────────────────────────────── */}
          <div className="border-t border-white/5 pt-4 space-y-4">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Ảnh & Assets</p>
            <Field label="Icon URL (200×200)" value={iconUrl} onChange={setIconUrl}
              placeholder="https://..." hint="Ảnh nhỏ hiển thị trong danh sách" />
            <Field label="Cover URL (800×450)" value={coverUrl} onChange={setCoverUrl}
              placeholder="https://..." hint="Ảnh lớn trang chi tiết" />
            <Field label="OG Image URL (1200×630)" value={ogUrl} onChange={setOgUrl}
              placeholder="https://..." hint="Ảnh khi share Facebook/Zalo/Telegram" />
          </div>

          {/* ── SEO (collapsible) ─────────────────────────── */}
          <div className="border-t border-white/5 pt-4">
            <button
              onClick={() => setShowSEO(!showSEO)}
              className="flex items-center justify-between w-full text-left"
            >
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">SEO</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); autoFillSEO(); setShowSEO(true); }}
                  className="flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 px-2 py-1 bg-violet-500/10 rounded-lg"
                >
                  <Wand2 size={11} />
                  Tự điền
                </button>
                {showSEO ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
              </div>
            </button>

            {showSEO && (
              <div className="mt-4 space-y-4">
                <Field label="Meta Title" value={metaTitle} onChange={setMetaTitle}
                  placeholder="Chơi Game X Online Miễn Phí | HubGame"
                  hint="Tối ưu 50-60 ký tự" />
                <Field label="Meta Description" value={metaDesc} onChange={setMetaDesc}
                  placeholder="Mô tả 150-160 ký tự cho Google..." textarea
                  hint={`${metaDesc.length}/160 ký tự`} />
                <Field label="Keywords (cách nhau bằng dấu phẩy)" value={keywords} onChange={setKeywords}
                  placeholder="game giải đố, puzzle online..." />
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {/* ── Actions ───────────────────────────────────── */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl transition-colors text-sm"
            >
              Huỷ
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              {saving
                ? <><Loader2 size={15} className="animate-spin" /> Đang lưu...</>
                : <><Save size={15} /> {isEdit ? 'Cập nhật' : 'Thêm game'}</>
              }
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
