'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const T = {
  profile: { single: true, f: ['name', 'role', 'email', 'phone', 'experience', 'skills', 'avatar_url', 'resume_url'] },
  social_links: { single: true, f: ['github', 'linkedin', 'twitter'] },
  projects: { f: ['name', 'type', 'tech_stack', 'logo_url', 'link', 'sort_order'] },
  experience: { f: ['period', 'title', 'bullets', 'sort_order'] },
  impact: { f: ['title', 'role', 'description', 'sort_order'] },
  education: { f: ['year', 'school', 'qualification', 'sort_order'] },
};
const BIG = ['bullets', 'description', 'skills'];
const HINT = { skills: 'separate with commas', bullets: 'one point per line', sort_order: 'lower numbers show first', resume_url: 'Google Drive link' };
const show = (k, v) => (Array.isArray(v) ? v.join(k === 'skills' ? ', ' : '\n') : v ?? '');
const toDb = (k, v) => (k === 'skills' ? v.split(',').map((s) => s.trim()).filter(Boolean) : k === 'bullets' ? v.split('\n').map((s) => s.trim()).filter(Boolean) : k === 'sort_order' ? Number(v) || 0 : v);

export default function Admin() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user || null); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null));
    return () => data.subscription.unsubscribe();
  }, []);
  if (!ready) return null;
  return <div className="adm">{user ? <Panel /> : <Login />}</div>;
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErr(error.message);
  };
  return (
    <form onSubmit={submit}>
      <h2>Admin login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn small">Log in</button>
      {err && <p className="err">{err}</p>}
    </form>
  );
}

function Panel() {
  const [tab, setTab] = useState('profile');
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');
  const cfg = T[tab];
  const toForm = (r) => ({ id: r.id, ...Object.fromEntries(cfg.f.map((k) => [k, show(k, r[k])])) });

  const load = async () => {
    const { data } = await supabase.from(tab).select('*').order(cfg.single ? 'id' : 'sort_order');
    setRows(data || []);
    setForm(cfg.single ? (data?.[0] ? toForm(data[0]) : {}) : null);
  };
  useEffect(() => { setMsg(''); load(); }, [tab]);

  const save = async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(cfg.f.map((k) => [k, toDb(k, String(form[k] ?? ''))]));
    const { error } = form.id ? await supabase.from(tab).update(payload).eq('id', form.id) : await supabase.from(tab).insert(payload);
    setMsg(error ? error.message : 'Saved');
    load();
  };
  const del = async (id) => { if (confirm('Delete this entry?')) { await supabase.from(tab).delete().eq('id', id); load(); } };
  const up = async (k, file) => {
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('assets').upload(path, file);
    if (error) return setMsg(error.message);
    setForm((f) => ({ ...f, [k]: supabase.storage.from('assets').getPublicUrl(path).data.publicUrl }));
  };

  return (
    <>
      <div className="tabsrow">
        {Object.keys(T).map((t) => <button key={t} className={t === tab ? 'on' : ''} onClick={() => setTab(t)}>{t.replace('_', ' ')}</button>)}
        <button onClick={() => supabase.auth.signOut()}>Log out</button>
      </div>

      {!cfg.single && !form && (
        <>
          <button className="btn small" onClick={() => setForm({})}>Add new</button>
          {rows.map((r) => (
            <div key={r.id} className="row">
              <span>{r.name || r.title || r.school}</span>
              <span><button onClick={() => setForm(toForm(r))}>Edit</button> <button onClick={() => del(r.id)}>Delete</button></span>
            </div>
          ))}
        </>
      )}

      {form && (
        <form onSubmit={save}>
          {cfg.f.map((k) => (
            <label key={k}>{k.replace(/_/g, ' ')} {HINT[k] && <small>({HINT[k]})</small>}
              {BIG.includes(k)
                ? <textarea rows={4} value={form[k] ?? ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                : <input value={form[k] ?? ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />}
              {['avatar_url', 'logo_url'].includes(k) && <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && up(k, e.target.files[0])} />}
            </label>
          ))}
          <button className="btn small">Save</button>
          {!cfg.single && <button type="button" onClick={() => setForm(null)}>Cancel</button>}
        </form>
      )}
      {msg && <p className="mute">{msg}</p>}
    </>
  );
}
