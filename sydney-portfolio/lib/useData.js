'use client';
import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export function useData() {
  const [d, setD] = useState({ profile: {}, links: {}, projects: [], experience: [], impact: [], education: [] });
  useEffect(() => {
    (async () => {
      const list = (t) => supabase.from(t).select('*').order('sort_order', { ascending: true });
      const [p, l, pr, ex, im, ed] = await Promise.all([
        supabase.from('profile').select('*').limit(1),
        supabase.from('social_links').select('*').limit(1),
        list('projects'), list('experience'), list('impact'), list('education'),
      ]);
      setD({
        profile: p.data?.[0] || {}, links: l.data?.[0] || {},
        projects: pr.data || [], experience: ex.data || [], impact: im.data || [], education: ed.data || [],
      });
    })();
  }, []);
  return d;
}
