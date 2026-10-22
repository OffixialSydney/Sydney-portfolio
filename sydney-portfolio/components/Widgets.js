'use client';
import { useEffect, useState } from 'react';
import { FaSun, FaCloudSun, FaCloud, FaCloudRain, FaSmog, FaSnowflake, FaBolt } from 'react-icons/fa';

// Weather location: change these two numbers to your city (find them on latlong.net).
const LAT = 4.8156;
const LON = 7.0498;

const kind = (c) =>
  c === 0 ? ['Clear', FaSun, '#f5c84c']
  : c <= 2 ? ['Partly cloudy', FaCloudSun, '#f5c84c']
  : c === 3 ? ['Cloudy', FaCloud, '#4a7df0']
  : c <= 48 ? ['Fog', FaSmog, '#9aa0ad']
  : c <= 67 ? ['Rain', FaCloudRain, '#4a7df0']
  : c <= 77 ? ['Snow', FaSnowflake, '#bfe3ff']
  : c <= 82 ? ['Showers', FaCloudRain, '#4a7df0']
  : c <= 86 ? ['Snow showers', FaSnowflake, '#bfe3ff']
  : ['Thunderstorm', FaBolt, '#f5c84c'];

function Weather() {
  const [w, setW] = useState(null);
  useEffect(() => {
    let dead = false;
    const load = async () => {
      try {
        const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code`);
        const j = await r.json();
        if (!dead && j.current) setW({ t: j.current.temperature_2m, c: j.current.weather_code });
      } catch (e) {}
    };
    load();
    const id = setInterval(load, 15 * 60 * 1000); // refresh every 15 minutes
    return () => { dead = true; clearInterval(id); };
  }, []);
  if (!w) return null;
  const [label, Icon, color] = kind(w.c);
  return (
    <div className="wx">
      <Icon color={color} />
      <span><b>{Math.round(w.t)}°C</b><br />{label}</span>
    </div>
  );
}

function Clock() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;
  return (
    <div className="clock">
      <span>{now.toLocaleTimeString('en-US')}</span>
      <span>{now.toLocaleDateString('en-US')}</span>
    </div>
  );
}

export default function Widgets() {
  return <><Weather /><Clock /></>;
}
