'use client';
import { useEffect } from 'react';
import { playClick } from '../lib/sounds';

// Plays a short click on every tap/click, generated with the Web Audio API (no audio file needed).
export default function ClickSound() {
  useEffect(() => {
    document.addEventListener('pointerdown', playClick);
    return () => document.removeEventListener('pointerdown', playClick);
  }, []);
  return null;
}
