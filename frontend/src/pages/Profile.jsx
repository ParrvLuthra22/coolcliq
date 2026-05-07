import { useState } from 'react';
import { Link } from 'react-router-dom';
import PhoneFrame from '../components/PhoneFrame.jsx';
import { Camera, ChevronLeft, Sparkles } from 'lucide-react';

const HANDLE_SUGGESTIONS = ['velvet.fox', 'midnight_07', 'silver.lining', 'echo.42', 'lone.wolf'];
const GENDERS = [
  { id: 'MALE', label: 'Male' },
  { id: 'FEMALE', label: 'Female' },
  { id: 'NON_BINARY', label: 'Non-binary' },
  { id: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];

export default function Profile({ embedded = false }) {
  const inner = <Inner />;
  if (embedded) return inner;
  return <PhoneFrame label="Profile setup">{inner}</PhoneFrame>;
}

function Inner() {
  const [handle, setHandle] = useState('velvet.fox');
  const [age, setAge] = useState(24);
  const [gender, setGender] = useState('FEMALE');

  return (
    <div className="h-full flex flex-col px-6">
      <div className="pt-6 flex items-center justify-between">
        <Link to="/onboarding" className="w-9 h-9 rounded-full glass flex items-center justify-center">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <span className="font-mono text-[10px] tracking-widest text-fog">STEP 2 / 2</span>
      </div>

      <div className="mt-6">
        <h1 className="font-display text-3xl font-bold leading-tight">Build your <span className="text-neon italic font-light">alter ego</span>.</h1>
        <p className="mt-2 text-fog text-sm">No real names. No identity. Just vibes.</p>
      </div>

      {/* Photo */}
      <div className="mt-6 flex items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-flame to-ice flex items-center justify-center text-2xl font-display font-bold">
            {handle.charAt(0).toUpperCase()}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-cream text-ink flex items-center justify-center">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <p className="font-medium">Add a photo</p>
          <p className="text-xs text-fog">Optional. Stays hidden in chat.</p>
        </div>
      </div>

      {/* Handle */}
      <div className="mt-6">
        <label className="font-mono text-[10px] tracking-widest text-fog uppercase">Handle</label>
        <div className="mt-2 glass rounded-2xl px-4 py-3.5 flex items-center">
          <span className="text-fog mr-1">@</span>
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ''))}
            className="flex-1 bg-transparent focus:outline-none font-medium"
          />
          <button onClick={() => setHandle(HANDLE_SUGGESTIONS[Math.floor(Math.random() * HANDLE_SUGGESTIONS.length)])}>
            <Sparkles className="w-4 h-4 text-neon" />
          </button>
        </div>
      </div>

      {/* Age */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label className="font-mono text-[10px] tracking-widest text-fog uppercase">Age</label>
          <span className="font-display text-2xl font-bold">{age}</span>
        </div>
        <input
          type="range"
          min="18"
          max="60"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="w-full mt-2 accent-flame"
        />
      </div>

      {/* Gender */}
      <div className="mt-5">
        <label className="font-mono text-[10px] tracking-widest text-fog uppercase">Gender</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {GENDERS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGender(g.id)}
              className={`px-4 py-3 rounded-xl text-sm font-medium border transition ${
                gender === g.id
                  ? 'bg-flame text-cream border-flame'
                  : 'glass border-transparent text-fog'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      <Link to="/scan" className="mb-8">
        <button className="w-full py-4 rounded-full bg-flame text-cream font-semibold shadow-glow">
          Enter CoolCliq
        </button>
      </Link>
    </div>
  );
}
