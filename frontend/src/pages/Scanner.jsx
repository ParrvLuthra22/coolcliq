import PhoneFrame from '../components/PhoneFrame.jsx';
import { Link } from 'react-router-dom';
import { Zap, X, Image as ImageIcon } from 'lucide-react';

export default function Scanner({ embedded = false }) {
  const inner = <Inner />;
  if (embedded) return inner;
  return <PhoneFrame label="QR Scanner">{inner}</PhoneFrame>;
}

function Inner() {
  return (
    <div className="h-full relative bg-black">
      {/* simulated camera view */}
      <div className="absolute inset-0 mesh-cool opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      {/* fake table-pattern texture */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#5CE1FF" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* simulated qr code in middle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 opacity-90">
        <div className="w-full h-full bg-cream p-3 rounded-lg">
          <FakeQR />
        </div>
      </div>

      {/* TOP BAR */}
      <div className="absolute top-0 inset-x-0 px-5 pt-12 flex items-center justify-between z-20">
        <Link to="/discover" className="w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center">
          <X className="w-4 h-4" />
        </Link>
        <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur">
          <span className="font-mono text-[10px] tracking-widest text-cream uppercase">Scan venue QR</span>
        </div>
        <button className="w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center">
          <Zap className="w-4 h-4 text-neon" />
        </button>
      </div>

      {/* VIEWFINDER */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 viewfinder">
        <span></span>
        <div className="scanline" />
      </div>

      {/* CAPTION */}
      <div className="absolute top-[68%] inset-x-0 text-center px-6 z-20">
        <p className="font-display text-2xl font-bold leading-tight">
          Point at the QR <br/> on your table.
        </p>
        <p className="mt-2 text-fog text-sm">
          We'll check you in if you're inside the venue.
        </p>
      </div>

      {/* BOTTOM ACTION */}
      <div className="absolute bottom-0 inset-x-0 p-6 z-20">
        <div className="glass rounded-3xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-flame/15 border border-flame/30 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-flame" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Upload from gallery</p>
              <p className="text-xs text-fog">If your camera isn't cooperating</p>
            </div>
          </div>
        </div>
        <Link to="/discover" className="block mt-3">
          <button className="w-full py-3 rounded-full bg-cream text-ink font-semibold text-sm">
            I'm at Toit Brewpub →
          </button>
        </Link>
      </div>
    </div>
  );
}

function FakeQR() {
  // Stylized QR — purely decorative; not a real scannable code.
  const cells = [];
  const seed = [
    1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,
    1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,
    1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,
    1,0,1,1,1,0,1,0,0,0,1,0,1,1,1,0,1,
    1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1,
    1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,1,
    1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,
    0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,
    1,0,1,0,1,1,1,0,0,0,1,1,1,0,1,0,1,
    0,1,0,1,0,1,0,1,1,0,0,1,0,1,0,1,0,
    1,1,0,0,1,1,1,0,1,1,1,0,1,1,1,1,1,
    0,0,0,0,0,0,0,0,0,1,0,1,0,1,1,0,1,
    1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,
    1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,1,0,
    1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,
    1,0,1,1,1,0,1,0,0,0,1,1,1,0,0,1,1,
    1,1,1,1,1,1,1,0,1,1,0,0,1,1,1,1,1,
  ];
  return (
    <div className="grid grid-cols-[repeat(17,1fr)] gap-[1px] w-full h-full">
      {seed.map((v, i) => (
        <div key={i} className={v ? 'bg-ink' : 'bg-cream'} />
      ))}
    </div>
  );
}
