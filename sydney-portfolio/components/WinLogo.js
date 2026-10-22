export default function WinLogo({ size = 130 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="Windows logo">
      <defs><linearGradient id="wg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#52d4ff" /><stop offset="1" stopColor="#0a6fd8" /></linearGradient></defs>
      {[[8, 8], [52, 8], [8, 52], [52, 52]].map(([x, y]) => <rect key={x + '' + y} x={x} y={y} width="40" height="40" rx="4" fill="url(#wg)" />)}
    </svg>
  );
}
