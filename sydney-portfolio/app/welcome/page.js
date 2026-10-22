'use client';
import Link from 'next/link';
import { useData } from '../../lib/useData';

export default function Welcome() {
  const { profile } = useData();
  return (
    <main className="wall center">
      {profile.avatar_url ? <img className="avatar" src={profile.avatar_url} alt={profile.name || 'Sydney'} /> : <div className="avatar ph" />}
      <h1>Welcome to my Portfolio</h1>
      <Link className="btn" href="/home">Get me in</Link>
    </main>
  );
}
