'use client';
import { useState } from 'react';

const E = ['🦊', '🐼', '🚀', '⚡', '🎧', '🍕', '🌵', '🎲', '🔥', '🐙', '🧩', '🌈'];
const init = () => [...E, ...E].sort(() => Math.random() - 0.5).map((e, id) => ({ id, e, open: false, done: false }));

export default function Game() {
  const [c, setC] = useState(init);
  const [sel, setSel] = useState([]);
  const [moves, setMoves] = useState(0);

  const flip = (i) => {
    if (sel.length === 2 || c[i].open || c[i].done) return;
    const s = [...sel, i];
    setC(c.map((x, k) => (k === i ? { ...x, open: true } : x)));
    setSel(s);
    if (s.length === 2) {
      setMoves(moves + 1);
      const [a, b] = s;
      setTimeout(() => {
        setC((p) => p.map((x, k) => (k === a || k === b ? (p[a].e === p[b].e ? { ...x, done: true } : { ...x, open: false }) : x)));
        setSel([]);
      }, 800);
    }
  };
  const won = c.every((x) => x.done);

  return (
    <div>
      <p style={{ fontSize: 20, marginBottom: 14 }}>Moves: {moves}</p>
      <div className="grid">
        {c.map((x, i) => <button key={x.id} className="card" onClick={() => flip(i)}>{x.open || x.done ? x.e : '?'}</button>)}
      </div>
      {won && (
        <p style={{ marginTop: 18 }}>You matched every pair in {moves} moves.{' '}
          <button className="btn small" onClick={() => { setC(init()); setSel([]); setMoves(0); }}>Play again</button>
        </p>
      )}
    </div>
  );
}
