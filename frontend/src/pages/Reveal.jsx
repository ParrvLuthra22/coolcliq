import PhoneFrame from '../components/PhoneFrame.jsx';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Check, X, Eye, Heart, Coffee } from 'lucide-react';

export default function Reveal({ embedded = false }) {
  const inner = <Inner />;
  if (embedded) return inner;
  return <PhoneFrame label="Mutual reveal">{inner}</PhoneFrame>;
}

function Inner() {
  const [stage, setStage] = useState('pending'); // pending | confirmed

  return (
    <div className="h-full overflow-y-auto bg-ink">
      {stage === 'pending' ? <Pending onAccept={() => setStage('confirmed')} /> : <Revealed />}
    </div>
  );
}

function Pending({ onAccept }) {
  return (
    <div className="h-full flex flex-col px-6">
      <div className="pt-6 flex items-center justify-between">
        <Link to="/chat" className="w-9 h-9 rounded-full glass flex items-center justify-center">
          <X className="w-4 h-4" />
        </Link>
        <span className="font-mono text-[10px] tracking-widest text-fog uppercase">Reveal request</span>
        <span className="w-9" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* anim circle */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-flame/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-flame to-ice flex items-center justify-center shadow-glow">
            <Eye className="w-12 h-12 text-cream" />
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold leading-tight">
          @echo.42 wants to <br/>
          <span className="text-flame italic font-light">meet</span>.
        </h1>
        <p className="mt-3 text-fog text-sm max-w-xs">
          If you accept, you'll both see each other's table numbers.
          Until then, no identity is shared.
        </p>

        {/* split cards preview */}
        <div className="mt-8 flex items-center gap-3 w-full">
          <BlurredTable label="Their table" />
          <Heart className="w-4 h-4 text-flame flex-shrink-0" />
          <BlurredTable label="Your table" hideValue />
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <button onClick={onAccept} className="w-full py-4 rounded-full bg-flame text-cream font-semibold shadow-glow flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          Accept · Reveal both tables
        </button>
        <button className="w-full py-4 rounded-full glass font-semibold text-fog">
          Not yet
        </button>
        <p className="text-center text-[10px] text-fog mt-2">Either side can decline. Either side can panic-exit at any time.</p>
      </div>
    </div>
  );
}

function Revealed() {
  return (
    <div className="h-full flex flex-col px-6">
      <div className="pt-6 flex items-center justify-between">
        <Link to="/chat" className="w-9 h-9 rounded-full glass flex items-center justify-center">
          <X className="w-4 h-4" />
        </Link>
        <span className="font-mono text-[10px] tracking-widest text-neon uppercase">Revealed</span>
        <span className="w-9" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-neon/40 rounded-full blur-3xl animate-pulse-slow" />
          <div className="relative w-32 h-32 rounded-full bg-neon flex items-center justify-center">
            <Check className="w-14 h-14 text-ink" strokeWidth={3} />
          </div>
        </div>

        <h1 className="font-display text-4xl font-bold leading-tight">
          You're both <br/>
          <span className="text-neon italic font-light">in</span>.
        </h1>
        <p className="mt-3 text-fog text-sm max-w-xs">
          Walk over and say hi. Or send the first IRL message — it's up to you.
        </p>

        <div className="mt-8 flex items-center gap-3 w-full">
          <RevealedTable label="@echo.42" table="14" accent="ice" />
          <Coffee className="w-4 h-4 text-fog flex-shrink-0" />
          <RevealedTable label="You" table="07" accent="flame" />
        </div>

        <div className="mt-6 glass rounded-2xl p-4 max-w-xs">
          <p className="text-xs text-fog">
            Your safety first: still don't feel right? Tap the panic icon in chat to instantly end the connection.
          </p>
        </div>
      </div>

      <Link to="/chat" className="mb-8">
        <button className="w-full py-4 rounded-full bg-cream text-ink font-semibold">
          Back to chat
        </button>
      </Link>
    </div>
  );
}

function BlurredTable({ label, hideValue }) {
  return (
    <div className="flex-1 glass rounded-2xl p-4 text-center">
      <p className="text-[10px] text-fog font-mono tracking-widest uppercase">{label}</p>
      <p className={`mt-1 font-display text-3xl font-bold ${hideValue ? '' : 'blur-md select-none'}`}>
        {hideValue ? '07' : '##'}
      </p>
    </div>
  );
}

function RevealedTable({ label, table, accent }) {
  const tone = accent === 'ice' ? 'border-ice/40 bg-ice/10' : 'border-flame/40 bg-flame/10';
  return (
    <div className={`flex-1 rounded-2xl p-4 text-center border ${tone}`}>
      <p className="text-[10px] font-mono tracking-widest uppercase text-fog">{label}</p>
      <p className="mt-1 font-display text-4xl font-bold">{table}</p>
      <p className="text-[10px] text-fog mt-0.5">TABLE</p>
    </div>
  );
}
