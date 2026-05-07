import PhoneFrame from '../components/PhoneFrame.jsx';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, MapPin, Clock, AlertOctagon, MessageCircle } from 'lucide-react';

const PEOPLE = [
  { id: 'u1', handle: 'velvet.fox',  age: 26, gender: 'FEMALE',     emoji: '🦊', accent: 'flame', bio: 'Mood: bossa nova + an old fashioned.' },
  { id: 'u2', handle: 'echo.42',      age: 28, gender: 'MALE',       emoji: '🌀', accent: 'ice',   bio: 'Here for the IPA, staying for the chat.' },
  { id: 'u3', handle: 'silver.dust',  age: 24, gender: 'FEMALE',     emoji: '🌙', accent: 'flame', bio: 'New in town. Recommend me places.' },
  { id: 'u4', handle: 'lone.wolf',    age: 31, gender: 'MALE',       emoji: '🐺', accent: 'ice',   bio: 'Reading at the bar. Open to interruption.' },
  { id: 'u5', handle: 'midnight_07',  age: 27, gender: 'NON_BINARY', emoji: '🌌', accent: 'neon',  bio: 'Vinyl, vermouth, vague poetry.' },
  { id: 'u6', handle: 'rhea.k',       age: 25, gender: 'FEMALE',     emoji: '✨', accent: 'flame', bio: 'Friday off the leash.' },
];

const filters = [
  { id: 'ALL', label: 'Everyone' },
  { id: 'FEMALE', label: 'Women' },
  { id: 'MALE', label: 'Men' },
  { id: 'NON_BINARY', label: 'Non-binary' },
];

export default function VenueDetail({ embedded = false }) {
  const inner = <Inner />;
  if (embedded) return inner;
  return <PhoneFrame label="Venue detail">{inner}</PhoneFrame>;
}

function Inner() {
  const [filter, setFilter] = useState('ALL');
  const visible = PEOPLE.filter((p) => filter === 'ALL' || p.gender === filter);

  return (
    <div className="h-full overflow-y-auto bg-ink">
      {/* HERO */}
      <div className="relative h-44 mesh-flame">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink" />
        <Link to="/discover" className="absolute top-6 left-5 w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <button className="absolute top-6 right-5 w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center">
          <AlertOctagon className="w-4 h-4 text-flame" />
        </button>

        <div className="absolute bottom-3 left-5 right-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neon dot-active" />
            <span className="font-mono text-[10px] tracking-widest text-neon uppercase">Live · 38 active</span>
          </div>
          <h1 className="font-display text-3xl font-bold">Toit Brewpub</h1>
          <div className="flex items-center gap-3 mt-1 text-xs text-fog">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>Indiranagar</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>Open till 1 AM</span>
          </div>
        </div>
      </div>

      {/* PRESENCE BAR */}
      <div className="px-5 -mt-2">
        <div className="glass rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-neon/15 border border-neon/30 flex items-center justify-center">
            <span className="text-lg">⚡</span>
          </div>
          <div className="flex-1">
            <p className="text-xs text-fog">You're checked in · Table</p>
            <p className="font-display text-lg font-bold leading-tight">07 <span className="text-fog text-xs font-body font-normal">· hidden until reveal</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-fog">Expires in</p>
            <p className="font-mono font-semibold text-neon">87:42</p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="px-5 mt-5">
        <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition ${
                filter === f.id
                  ? 'bg-cream text-ink border-cream'
                  : 'glass text-fog border-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* PEOPLE GRID */}
      <div className="px-5 mt-4 pb-6">
        <h2 className="font-display text-base font-semibold mb-2">
          {visible.length} people here right now
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {visible.map((p) => (
            <div key={p.id} className="glass rounded-2xl p-3 relative group">
              <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${
                p.accent === 'flame' ? 'bg-flame' : p.accent === 'ice' ? 'bg-ice' : 'bg-neon'
              }`} />
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-2 ${
                p.accent === 'flame' ? 'bg-flame/20' : p.accent === 'ice' ? 'bg-ice/20' : 'bg-neon/20'
              }`}>
                {p.emoji}
              </div>
              <p className="font-display font-bold leading-tight truncate">@{p.handle}</p>
              <p className="text-[11px] text-fog mt-0.5">
                {p.age} · {p.gender === 'FEMALE' ? 'Woman' : p.gender === 'MALE' ? 'Man' : 'NB'}
              </p>
              <p className="mt-1.5 text-[11px] text-fog leading-snug line-clamp-2">"{p.bio}"</p>
              <Link to="/chat" className="mt-2 block">
                <button className="w-full py-1.5 rounded-full bg-flame text-cream text-[11px] font-semibold flex items-center justify-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  Say hi
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
