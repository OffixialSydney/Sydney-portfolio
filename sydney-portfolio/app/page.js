'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WinLogo from '../components/WinLogo';

const QUOTES = [
  'A bug is just a feature that has not been documented yet.',
  "It works on my machine. Let's ship my machine.",
  'Semicolons are tiny. Missing ones are not.',
  'First, solve the problem. Then, write the code.',
  'Debugging is being the detective in a crime movie where you are also the culprit.',
  'Good code is its own best documentation.',
  'Weeks of coding can save you hours of planning.',
  "There are 10 kinds of people: those who read binary and those who don't.",
  'Talk is cheap. Push the commit.',
  'Coffee in, code out.',
  'Every expert was once a beginner who kept going.',
  'Ctrl + S is a love language.',
  'Make it work, make it right, make it fast.',
  'The best error message is the one that never shows up.',
  'Real programmers count from zero.',
  'Delete code today, debug less tomorrow.',
  'Stay curious. Keep building.',
  'Simplicity is the soul of clean code.',
  'Your future self will read this code. Be kind.',
  'A thousand deployments begin with one commit.',
  "Don't comment bad code, rewrite it.",
  'Learn it, build it, break it, fix it, repeat.',
  'Fear not the red text. It is only trying to help.',
  'Small steps every day beat big plans someday.',
  'One more refactor never hurt anyone. (It did.)',
  'On the keyboard of life, always keep one finger on Escape.',
  'There is no place like 127.0.0.1.',
  'Roses are #FF0000, violets are #0000FF, my CSS is broken, and so am I.',
];

export default function Intro() {
  const router = useRouter();
  const [text, setText] = useState('');

  useEffect(() => {
    let dead = false;
    // one random quote per visit, then straight to the welcome page
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      for (let i = 1; i <= quote.length; i++) {
        if (dead) return;
        setText(quote.slice(0, i));
        await wait(45);
      }
      await wait(1500);
      if (!dead) router.push('/welcome');
    })();
    return () => { dead = true; };
  }, [router]);

  return (
    <main className="intro center">
      <WinLogo />
      <p className="type">{text}<span className="cur" /></p>
    </main>
  );
}
