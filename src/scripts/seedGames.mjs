// scripts/seedGames.mjs
// ─────────────────────────────────────────────────────────────
// Chạy bằng: node scripts/seedGames.mjs
// KHÔNG cần tsx, KHÔNG cần compile — Node.js chạy thẳng ESM
// ─────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Đọc firebase-applet-config.json (hoặc dùng biến môi trường)
const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '../firebase-applet-config.json');
const firebaseConfig = JSON.parse(readFileSync(configPath, 'utf-8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// ── Dữ liệu seed ─────────────────────────────────────────────
const sampleGames = [
  {
    id: 'puzzle-01',
    slug: 'puzzle-quest',
    title: 'Puzzle Quest - Giải Đố Siêu Đỉnh',
    category: 'Giải đố',
    tags: ['game-van-phong', 'luyen-tri-nao', 'giai-do', 'mien-phi'],
    description: 'Thử thách trí tuệ với hàng trăm câu đố hấp dẫn. Phù hợp cho mọi lứa tuổi, chơi ngay trên trình duyệt không cần cài đặt.',
    content: 'Cách chơi:\n- Quan sát các mảnh ghép trên màn hình\n- Kéo thả để sắp xếp đúng vị trí\n- Hoàn thành trước khi hết giờ để đạt điểm cao\n\nMẹo: Bắt đầu từ các góc và cạnh ngoài trước!',
    version: '1.2.0',
    is_featured: true,
    status: 'published',
    seo: {
      meta_title: 'Chơi Puzzle Quest Online Miễn Phí - Game Giải Đố Hay Nhất 2026',
      meta_desc: 'Thử thách trí tuệ với Puzzle Quest - Game giải đố online miễn phí. Hàng trăm câu đố từ dễ đến khó, chơi ngay trên Web & Mobile không cần cài đặt.',
      keywords: ['puzzle quest', 'game giải đố', 'game online miễn phí', 'trò chơi trí tuệ'],
    },
    assets: {
      icon: 'https://picsum.photos/seed/puzzle-icon/200/200',
      cover: 'https://picsum.photos/seed/puzzle/800/450',
      og_image: 'https://picsum.photos/seed/puzzle-og/1200/630',
      iframe_url: '/games/puzzle-01/index.html',
    },
    stats: { plays: 15400, likes: 1200, rating_avg: 4.7, rating_count: 892 },
    leaderboard_id: 'leaderboard-puzzle-01',
    created_at: '2026-01-15T07:00:00Z',
    updated_at: '2026-03-20T10:00:00Z',
  },
  {
    id: 'logic-02',
    slug: 'logic-master',
    title: 'Logic Master - Bậc Thầy Tư Duy',
    category: 'Logic',
    tags: ['logic', 'tu-duy', 'luyen-nao', 'game-kho', 'mien-phi'],
    description: 'Rèn luyện tư duy logic với các bài toán thử thách. Từ cơ bản đến nâng cao — bạn sẽ lên cấp từng ngày!',
    content: 'Cách chơi:\n- Đọc kỹ quy luật được hiển thị\n- Suy luận và chọn đáp án đúng\n- Mỗi cấp độ có giới hạn số lần thử\n\nMẹo: Loại trừ các đáp án sai trước khi chọn đúng.',
    version: '2.0.1',
    is_featured: true,
    status: 'published',
    seo: {
      meta_title: 'Logic Master - Game Tư Duy Logic Online | Chơi Miễn Phí',
      meta_desc: 'Luyện tập tư duy logic với Logic Master. Hàng trăm bài toán từ dễ đến khó, phù hợp học sinh, sinh viên và dân văn phòng.',
      keywords: ['logic master', 'game logic', 'luyện tư duy', 'game trí tuệ online'],
    },
    assets: {
      icon: 'https://picsum.photos/seed/logic-icon/200/200',
      cover: 'https://picsum.photos/seed/logic/800/450',
      og_image: 'https://picsum.photos/seed/logic-og/1200/630',
      iframe_url: '/games/logic-02/index.html',
    },
    stats: { plays: 9800, likes: 870, rating_avg: 4.5, rating_count: 541 },
    leaderboard_id: 'leaderboard-logic-02',
    created_at: '2026-02-01T07:00:00Z',
    updated_at: '2026-03-18T10:00:00Z',
  },
  {
    id: 'speed-03',
    slug: 'speed-runner',
    title: 'Speed Runner - Vua Tốc Độ',
    category: 'Hành động',
    tags: ['speed', 'hanh-dong', 'phan-xa', 'arcade', 'mien-phi'],
    description: 'Kiểm tra phản xạ và tốc độ phán đoán của bạn. Né chướng ngại vật, thu thập điểm thưởng và phá kỷ lục cá nhân!',
    content: 'Cách chơi:\n- Dùng phím mũi tên hoặc WASD để di chuyển\n- Tránh chướng ngại vật màu đỏ\n- Thu thập sao vàng để tăng điểm\n\nMẹo: Luôn nhìn trước 2–3 bước để phản ứng kịp.',
    version: '1.0.5',
    is_featured: false,
    status: 'published',
    seo: {
      meta_title: 'Speed Runner - Game Tốc Độ Online | Thử Thách Phản Xạ 2026',
      meta_desc: 'Thách thức phản xạ với Speed Runner! Game arcade tốc độ cao, dễ học khó master. Phá kỷ lục bạn bè và leo bảng xếp hạng ngay hôm nay.',
      keywords: ['speed runner', 'game tốc độ', 'game arcade', 'thử thách phản xạ'],
    },
    assets: {
      icon: 'https://picsum.photos/seed/speed-icon/200/200',
      cover: 'https://picsum.photos/seed/speed/800/450',
      og_image: 'https://picsum.photos/seed/speed-og/1200/630',
      iframe_url: '/games/speed-03/index.html',
    },
    stats: { plays: 22100, likes: 1850, rating_avg: 4.8, rating_count: 1203 },
    leaderboard_id: 'leaderboard-speed-03',
    created_at: '2026-01-20T07:00:00Z',
    updated_at: '2026-03-21T10:00:00Z',
  },
];

// ── Chạy seed ─────────────────────────────────────────────────
console.log('🌱 Bắt đầu seed dữ liệu games vào Firestore...\n');

for (const game of sampleGames) {
  const { id, ...data } = game;
  await setDoc(doc(db, 'games', id), data);
  console.log(`  ✅ ${id}: ${game.title}`);
}

console.log('\n✨ Seed hoàn tất! Kiểm tra Firestore Console.');
process.exit(0);
