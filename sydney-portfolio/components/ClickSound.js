'use client';
import { useEffect } from 'react';

// Plays a short click on every tap/click, generated with the Web Audio API (no audio file needed).
export default function ClickSound() {
  useEffect(() => {
    let ctx;
    const click = () => {
      try {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'square';
        o.frequency.setValueAtTime(900, t);
        o.frequency.exponentialRampToValueAtTime(300, t + 0.05);
        g.gain.setValueAtTime(0.08, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.07);
      } catch (e) {}
    };
    document.addEventListener('pointerdown', click);
    return () => document.removeEventListener('pointerdown', click);
  }, []);
  return null;
}
