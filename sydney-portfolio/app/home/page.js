'use client';
import { useState } from 'react';
import { FaFolder, FaGithub, FaFilePdf, FaGamepad, FaWindows, FaLinkedin, FaTwitterSquare, FaUsers, FaChartLine, FaGraduationCap } from 'react-icons/fa';
import { useData } from '../../lib/useData';
import Game from '../../components/Game';
import Widgets from '../../components/Widgets';

const go = (u) => u && window.open(u, '_blank', 'noopener');
const NONE = <p className="mute">Nothing here yet. Add entries from /admin.</p>;
const TITLES = { projects: 'Personal Projects', experience: 'Experience', impact: 'Impact', education: 'Education' };

function Win({ title, onClose, children }) {
  return (
    <section className="win">
      <button className="x" onClick={onClose} aria-label="Close">✕</button>
      {title && <><h2>{title}</h2><hr /></>}
      {children}
    </section>
  );
}

export default function Home() {
  const { profile, links, projects, experience, impact, education } = useData();
  const [win, setWin] = useState(null);
  const [start, setStart] = useState(false);
  const [about, setAbout] = useState(false);
  const open = (w) => { setWin(w); setStart(false); };
  const name = profile.name || 'Sydney';

  let body = null;
  if (win === 'projects') body = projects.length ? projects.map((p) => (
    <button key={p.id} className="pcard" onClick={() => go(p.link)}>
      {p.logo_url ? <img className="logo" src={p.logo_url} alt="" /> : <span className="logo ph" />}
      <span><b>{p.name}</b><br /><span className="sub">{p.type}</span><br /><small>{p.tech_stack}</small></span>
    </button>
  )) : NONE;
  if (win === 'experience') body = experience.length ? experience.map((e) => (
    <div key={e.id} className="entry"><h3>{e.period}</h3><h4>{e.title}</h4><p>{(e.bullets || []).map((b, i) => <span key={i}>{i + 1}. {b}<br /></span>)}</p></div>
  )) : NONE;
  if (win === 'impact') body = impact.length ? impact.map((m, i) => (
    <div key={m.id} className="entry"><h3>{i + 1}. {m.title}</h3><h4>{m.role}</h4><p>{m.description}</p></div>
  )) : NONE;
  if (win === 'education') body = education.length ? education.map((e) => (
    <div key={e.id} className="entry"><h3>{e.year} - {e.school}</h3><p>{e.qualification}</p></div>
  )) : NONE;

  return (
    <main className="wall desk">
      <div className="icons">
        <button className="item" onClick={() => open('projects')}><FaFolder color="#f5c84c" />Projects</button>
        <button className="item" onClick={() => go(links.github)}><FaGithub color="#ffffff" />Github</button>
        <button className="item" onClick={() => go(profile.resume_url)}><FaFilePdf color="#c8382f" />Resume</button>
        <button className="item" onClick={() => open('game')}><FaGamepad color="#4cc36a" />Game</button>
      </div>

      {start && (
        <div className="start">
          <div className="tabs">
            <button onClick={() => open('projects')} aria-label="Projects"><FaFolder color="#f5c84c" /></button>
            <button onClick={() => go(profile.resume_url)} aria-label="Resume"><FaFilePdf color="#c8382f" /></button>
            <button onClick={() => open('impact')} aria-label="Impact"><FaUsers color="#4a7df0" /></button>
            <button onClick={() => open('experience')} aria-label="Experience"><FaChartLine color="#4cc36a" /></button>
            <button onClick={() => open('education')} aria-label="Education"><FaGraduationCap color="#9aa0ad" /></button>
          </div>
          {about && (
            <table className="about"><tbody>
              <tr><td>Name:</td><td>{name}</td></tr>
              <tr><td>Email:</td><td>{profile.email}</td></tr>
              <tr><td>Phone Number:</td><td>{profile.phone}</td></tr>
              <tr><td>Experience:</td><td>{profile.experience}</td></tr>
              <tr><td>Skills:</td><td>{(profile.skills || []).join(', ')}</td></tr>
            </tbody></table>
          )}
          <button className="who" onClick={() => setAbout(!about)}>
            {profile.avatar_url ? <img src={profile.avatar_url} alt="" /> : <span className="logo ph" />}
            <span><b>{name}</b><br /><small>{profile.role}</small></span>
            <span className="chev">{about ? '⌄' : '⌃'}</span>
          </button>
        </div>
      )}

      {win && win !== 'game' && <Win title={TITLES[win]} onClose={() => setWin(null)}>{body}</Win>}
      {win === 'game' && <Win onClose={() => setWin(null)}><Game /></Win>}

      <nav className="bar">
        <button className={start ? 'on' : ''} onClick={() => setStart(!start)} aria-label="Start"><FaWindows color="#4a7df0" /></button>
        <button onClick={() => open('projects')} aria-label="Projects"><FaFolder color="#f5c84c" /></button>
        <button onClick={() => go(links.github)} aria-label="GitHub"><FaGithub color="#9aa0ad" /></button>
        <button onClick={() => go(links.linkedin)} aria-label="LinkedIn"><FaLinkedin color="#2563c4" /></button>
        <button onClick={() => go(links.twitter)} aria-label="Twitter"><FaTwitterSquare color="#3ba4e8" /></button>
      </nav>

      <Widgets />
    </main>
  );
}
