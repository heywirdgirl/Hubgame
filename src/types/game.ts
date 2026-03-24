// ============================================================
// Kiểu dữ liệu Game đầy đủ — khớp với Firestore Document
// ============================================================

export interface GameSEO {
  meta_title: string;       // <title> tag tối ưu SEO
  meta_desc: string;        // <meta name="description">
  keywords: string[];       // <meta name="keywords">
}

export interface GameAssets {
  icon: string;             // Ảnh nhỏ cho danh sách (thumbnail)
  cover: string;            // Ảnh lớn cho trang chi tiết
  og_image: string;         // Ảnh share Facebook/Zalo/Telegram
  iframe_url: string;       // Đường dẫn index.html Godot
  pck_url?: string;         // File .pck cho Mobile (tuỳ chọn)
}

export interface GameStats {
  plays: number;            // Tổng lượt chơi
  likes: number;            // Số lượt thích
  rating_avg: number;       // Điểm đánh giá trung bình (0–5)
  rating_count: number;     // Số người đã đánh giá
}

export type GameStatus = 'published' | 'beta' | 'maintenance';

export interface Game {
  id: string;               // Document ID trong Firestore
  slug: string;             // URL slug, VD: "sudoku-co-dien"
  title: string;            // Tên hiển thị
  category: string;         // Thể loại: "Giải đố", "Logic"...
  tags: string[];           // Tags từ khoá
  description: string;      // Mô tả ngắn
  content: string;          // Hướng dẫn / bài viết (Markdown)
  version: string;          // Phiên bản game, VD: "1.0.2"
  is_featured: boolean;     // Game nổi bật?
  status: GameStatus;       // Trạng thái
  seo: GameSEO;
  assets: GameAssets;
  stats: GameStats;
  leaderboard_id?: string;  // Liên kết bảng xếp hạng
  created_at: string;       // ISO timestamp
  updated_at: string;
}

// Kiểu rút gọn dùng cho danh sách (trang chủ)
export type GameSummary = Pick<
  Game,
  'id' | 'slug' | 'title' | 'category' | 'tags' |
  'description' | 'is_featured' | 'status' | 'assets' | 'stats'
>;
