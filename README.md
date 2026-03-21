# Mini-Game Portal (Next.js)

A high-performance, SEO-optimized mini-game portal built with Next.js (App Router), Tailwind CSS v4, and Zustand. Designed to host and play Godot 4 web exports.

## 📂 Project Structure

```text
.
├── public/                  # Static assets (Godot game files, images, icons)
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── game/            
│   │   │   └── [slug]/      
│   │   │       └── page.tsx # Game Details Page (SEO optimized, metadata)
│   │   ├── play/            
│   │   │   └── [slug]/      
│   │   │       └── page.tsx # Game Play Page (Loads the actual game iframe/canvas)
│   │   ├── globals.css      # Global CSS & Tailwind imports
│   │   ├── layout.tsx       # Root HTML layout
│   │   └── page.tsx         # Home Page (Game grid)
│   ├── components/          # Reusable React components
│   │   └── GameCard.tsx     # Card component for game listings
│   ├── lib/                 # Utility functions and static data
│   │   └── games.ts         # Game database/list
│   └── stores/              # Global state management
│       └── useGameStore.ts  # Zustand store for high scores, etc.
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules (configured for Next.js)
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies and scripts
├── postcss.config.mjs       # PostCSS config (Tailwind CSS v4)
└── tsconfig.json            # TypeScript configuration
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand
- **Animations:** Motion (Framer Motion)
- **Icons:** Lucide React
