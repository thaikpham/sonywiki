import React from 'react';
import { Tv, Camera, Headphones, Gamepad2 } from 'lucide-react';

export const SONY_CATEGORIES = [
  { id: 'tv', name: 'TV & Soundbar', icon: <Tv size={24} />, color: 'bg-zinc-900', products: 24, notionUrl: 'https://notion.so/sony/bravia', backgroundImage: 'bravia.avif' },
  { id: 'di', name: 'Digital Imaging', icon: <Camera size={24} />, color: 'bg-zinc-800', products: 42, notionUrl: 'https://notion.so/sony/alpha', backgroundImage: 'alpha1.avif' },
  { id: 'audio', name: 'Audio & Gear', icon: <Headphones size={24} />, color: 'bg-zinc-700', products: 30, notionUrl: 'https://notion.so/sony/audio', backgroundImage: 'wh.avif' },
  { id: 'ps5', name: 'PlayStation 5', icon: <Gamepad2 size={24} />, color: 'bg-zinc-950', products: 12, notionUrl: 'https://notion.so/sony/ps5', backgroundImage: 'main/ps5.avif' },
];

export const BADGES = [
  { id: 'pioneer', name: 'Sony Pioneer', icon: '🚀', color: 'bg-blue-500' },
  { id: 'master', name: 'Master Trainer', icon: '🎓', color: 'bg-amber-500' },
  { id: 'reviewer', name: 'Top Reviewer', icon: '🎥', color: 'bg-red-500' },
  { id: 'weekly_top', name: 'Top 5 Weekly', icon: '🏆', color: 'bg-purple-500' },
];
