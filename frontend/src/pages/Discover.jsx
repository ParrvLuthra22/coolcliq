import PhoneFrame from '../components/PhoneFrame.jsx';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Locate, Users } from 'lucide-react';

const venues = [
  { id: 1, name: 'Toit Brewpub',     dist: '0.2 km', count: 38, m: 22, f: 14, hot: true,  top: '38%', left: '42%' },
  { id: 2, name: 'The Permit Room', dist: '0.6 km', count: 24, m: 12, f: 11, hot: true,  top: '58%', left: '64%' },
  { id: 3, name: 'Soka',             dist: '0.9 km', count: 18, m: 9,  f: 8,  hot: false, top: '28%', left: '70%' },
  { id: 4, name: "Bob's Bar",        dist: '1.4 km', count: 12, m: 7,  f: 4,  hot: false, top: '70%', left: '32%' },
];

export default function Discover({ embedded = false }) {
  const inner = <Inner />;
  if (embedded) return inner;
  return <PhoneFrame label="Discover">{inner}</PhoneFrame>;
}

function Inner() {
  return (
    <div className="h-full relative bg-graphite overflow-hidden">
      {/* MAP — stylized */}
      <div className="absolute inset-0">
        <MapBackdrop />
        {venues.map((v) => (
          <div
            key={v.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ top: v.top, left: v.left }}
          >
            <div className="relative">
              {v.hot && (
                <div className="absolute inset-0 rounded-full bg-flame/30 blur-xl animate-pulse-slow" />
              )}
              <div className={`relative px-3 py-1.5 rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-soft ${
                v.hot ? 'bg-flame text-cream' : 'bg-cream text-ink'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${v.hot ? 'bg-neon dot-active' : 'bg-flame'}`} />
                {v.count}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TOP BAR */}
      <div className="relative z-20 px-5 pt-6">
        <div className="glass rounded-2xl p-1 flex items-center">
          <div className="px-3 flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-fog" />
            <input
              placeholder="Search venues, areas…"
              className="flex-1 bg-transparent py-3 focus:outline-none text-sm placeholder:text-fog"
            />
          </div>
          <button className="w-10 h-10 rounded-xl bg-flame flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* filter chips */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {['All', 'Bars', 'Cafés', 'Lounges', 'Live music'].map((c, i) => (
            <button key={c} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap ${
              i === 0 ? 'bg-cream text-ink border-cream' : 'glass text-fog border-transparent'
            }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* RECENTER */}
      <button className="absolute right-5 top-[34%] z-20 w-11 h-11 rounded-full glass flex items-center justify-center">
        <Locate className="w-4 h-4 text-neon" />
      </button>

      {/* BOTTOM SHEET */}
      <div className="absolute bottom-0 inset-x-0 z-20 glass rounded-t-3xl pt-2.5 max-h-[55%] overflow-hidden">
        <div className="w-10 h-1 rounded-full bg-fog/30 mx-auto" />
        <div className="px-5 py-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">
            Live nearby <span className="text-flame">·</span> <span className="font-mono text-sm text-neon">{venues.reduce((s,v)=>s+v.count,0)} active</span>
          </h2>
        </div>
        <div className="px-3 pb-4 space-y-2 overflow-y-auto max-h-[280px]">
          {venues.map((v) => (
            <Link key={v.id} to="/venue" className="block">
              <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-carbon/60 transition">
                <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold ${
                  v.hot ? 'bg-flame text-cream' : 'bg-smoke text-cream'
                }`}>
                  {v.name.charAt(0)}
                  {v.hot && <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-neon text-ink text-[8px] font-mono font-bold">HOT</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{v.name}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-fog">
                    <span>{v.dist}</span>
                    <span>·</span>
                    <Users className="w-3 h-3" />
                    <span>{v.count} active</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-fog">
                  <span className="text-ice">♂ {v.m}</span>
                  <span className="text-flame">♀ {v.f}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MapBackdrop() {
  return (
    <svg viewBox="0 0 380 800" className="w-full h-full">
      <defs>
        <linearGradient id="mapBg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#13131A"/>
          <stop offset="100%" stopColor="#1C1C26"/>
        </linearGradient>
      </defs>
      <rect width="380" height="800" fill="url(#mapBg)"/>
      {/* parks */}
      <path d="M 20 150 Q 100 130 180 200 Q 100 280 20 240 Z" fill="#1f3a2a" opacity="0.5"/>
      <path d="M 220 380 Q 300 360 360 420 Q 320 500 240 470 Z" fill="#1f3a2a" opacity="0.4"/>
      {/* roads */}
      <path d="M 0 320 L 380 360" stroke="#2A2A36" strokeWidth="14" />
      <path d="M 0 320 L 380 360" stroke="#3A3A48" strokeWidth="1" strokeDasharray="6 8"/>
      <path d="M 80 0 L 120 800" stroke="#2A2A36" strokeWidth="10" />
      <path d="M 280 0 L 240 800" stroke="#2A2A36" strokeWidth="8" />
      <path d="M 0 600 L 380 580" stroke="#2A2A36" strokeWidth="10" />
      {/* water hint */}
      <circle cx="50" cy="700" r="80" fill="#1a2a44" opacity="0.5"/>
      {/* city blocks */}
      {Array.from({ length: 30 }).map((_, i) => (
        <rect key={i}
          x={(i * 73) % 360}
          y={(i * 89) % 760}
          width={20 + (i % 3) * 8}
          height={20 + (i % 4) * 6}
          fill="#1A1A24"
          rx="2"
        />
      ))}
      {/* user dot */}
      <g>
        <circle cx="190" cy="500" r="20" fill="#5CE1FF" opacity="0.15"/>
        <circle cx="190" cy="500" r="6" fill="#5CE1FF"/>
        <circle cx="190" cy="500" r="9" fill="none" stroke="#5CE1FF" strokeWidth="2" opacity="0.6"/>
      </g>
    </svg>
  );
}
