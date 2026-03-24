// src/lib/firebase.ts
// ─────────────────────────────────────────────────────────────
// Đọc config từ biến môi trường NEXT_PUBLIC_* thay vì file JSON
// File JSON cũ (firebase-applet-config.json) sẽ bị loại khỏi git
// ─────────────────────────────────────────────────────────────

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Tránh khởi tạo nhiều lần khi Next.js hot-reload
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// Dùng custom database ID nếu có (Firestore named database)
const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID;

export const db = databaseId
  ? getFirestore(app, databaseId)
  : getFirestore(app);

export const auth = getAuth(app);

export default app;
