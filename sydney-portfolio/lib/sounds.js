let ctx;
const audio = () => {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume(); // Safari starts audio paused
  return ctx;
};

// Short click on every tap/click
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

// Soft keyboard key sound for the typing animation
export function playKey() {
  try {
    const c = audio();
    if (c.state !== 'running') return; // browser has not allowed sound yet
    const t = c.currentTime;

    // crisp key-top tick (filtered noise burst)
    const len = Math.floor(c.sampleRate * 0.03);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const n = c.createBufferSource();
    n.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 1800 + Math.random() * 1200;
    const g = c.createGain();
    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    n.connect(f); f.connect(g); g.connect(c.destination);
    n.start(t);

    // low "thock" under it
    const o = c.createOscillator(), og = c.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(180 + Math.random() * 40, t);
    o.frequency.exponentialRampToValueAtTime(70, t + 0.04);
    og.gain.setValueAtTime(0.1, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    o.connect(og); og.connect(c.destination);
    o.start(t); o.stop(t + 0.06);
  } catch (e) {}
}

// "Get me in" sound: power-up sweep, digital arpeggio, closing chord (about 1.8s)
export function playEnter() {
  try {
    const c = audio(), t = c.currentTime;
    const master = c.createGain();
    master.gain.value = 0.5;
    master.connect(c.destination);

    // rising power-up sweep
    const sw = c.createOscillator(), sg = c.createGain(), sf = c.createBiquadFilter();
    sw.type = 'sawtooth';
    sw.frequency.setValueAtTime(70, t);
    sw.frequency.exponentialRampToValueAtTime(520, t + 0.55);
    sf.type = 'lowpass';
    sf.frequency.setValueAtTime(300, t);
    sf.frequency.exponentialRampToValueAtTime(3000, t + 0.55);
    sg.gain.setValueAtTime(0.0001, t);
    sg.gain.exponentialRampToValueAtTime(0.16, t + 0.15);
    sg.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    sw.connect(sf); sf.connect(sg); sg.connect(master);
    sw.start(t); sw.stop(t + 0.75);

    // fast digital arpeggio
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((fr, i) => {
      const s = t + 0.12 + i * 0.085, o = c.createOscillator(), og = c.createGain();
      o.type = 'square';
      o.frequency.value = fr;
      og.gain.setValueAtTime(0.0001, s);
      og.gain.exponentialRampToValueAtTime(0.09, s + 0.01);
      og.gain.exponentialRampToValueAtTime(0.0001, s + 0.22);
      o.connect(og); og.connect(master);
      o.start(s); o.stop(s + 0.25);
    });

    // closing chord
    [523.25, 783.99, 1046.5].forEach((fr) => {
      const s = t + 0.6, o = c.createOscillator(), og = c.createGain();
      o.type = 'sine';
      o.frequency.value = fr;
      og.gain.setValueAtTime(0.0001, s);
      og.gain.exponentialRampToValueAtTime(0.12, s + 0.04);
      og.gain.exponentialRampToValueAtTime(0.0001, s + 1.1);
      o.connect(og); og.connect(master);
      o.start(s); o.stop(s + 1.15);
    });
  } catch (e) {}
}
