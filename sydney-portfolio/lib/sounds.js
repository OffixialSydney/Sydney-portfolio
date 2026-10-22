let ctx;
const audio = () => {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume(); // Safari starts audio paused
  return ctx;
};

export function playClick() {
  try {
    const c = audio(), t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(900, t);
    o.frequency.exponentialRampToValueAtTime(300, t + 0.05);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + 0.07);
  } catch (e) {}
}

export function playEnter() {
  try {
    const c = audio(), t = c.currentTime;
    [523.25, 783.99].forEach((f, i) => {
      const s = t + i * 0.09, o = c.createOscillator(), g = c.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(0.18, s + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, s + 0.35);
      o.connect(g); g.connect(c.destination);
      o.start(s); o.stop(s + 0.4);
    });
  } catch (e) {}
}
