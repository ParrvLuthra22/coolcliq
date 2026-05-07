import { Link } from 'react-router-dom';
import PhoneFrame from '../components/PhoneFrame.jsx';
import OnboardingScreen from './Onboarding.jsx';
import ProfileScreen from './Profile.jsx';
import ScannerScreen from './Scanner.jsx';
import DiscoverScreen from './Discover.jsx';
import VenueScreen from './VenueDetail.jsx';
import ChatScreen from './Chat.jsx';
import RevealScreen from './Reveal.jsx';
import AdminPanel from './Admin.jsx';
import { ArrowRight, Github, Figma, ExternalLink } from 'lucide-react';

const screens = [
  { label: '01 · Onboarding', title: 'Phone OTP + 18+ gate', desc: 'Lightweight signup. Phone number, 6-digit code, age gate, T&Cs.', Comp: OnboardingScreen },
  { label: '02 · Profile setup', title: 'Anonymous handle', desc: 'Pick a handle. No real name required. Optional photo & bio.', Comp: ProfileScreen },
  { label: '03 · QR Scanner', title: 'Check in at venue', desc: 'Scan the QR code at any partner venue. Geo-validated server-side.', Comp: ScannerScreen },
  { label: '04 · Discover map', title: 'Live nearby venues', desc: 'Google Maps view with live counts and gender breakdown per venue.', Comp: DiscoverScreen },
  { label: '05 · Venue detail', title: "Who's here right now", desc: 'Active people list. Filter by gender. Tap to start an anonymous chat.', Comp: VenueScreen },
  { label: '06 · Anonymous chat', title: 'Real-time, identity-hidden', desc: 'Socket.IO chat. No table number until both parties agree to reveal.', Comp: ChatScreen },
  { label: '07 · Mutual reveal', title: 'Tap-to-reveal flow', desc: 'Both sides accept → table numbers exchanged. Either can decline.', Comp: RevealScreen },
  { label: '08 · Admin dashboard', title: 'Operations panel', desc: 'Venue management, QR generation, moderation queue, live metrics.', Comp: AdminPanel, fullWidth: true },
];

export default function Showcase() {
  return (
    <div className="min-h-screen bg-ink text-cream overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-[85vh] mesh-flame flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-flame/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-ice/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-neon dot-active" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-fog">Phase 1 · Bangalore Pilot</span>
          </div>

          <h1 className="font-display font-bold text-[clamp(3rem,9vw,7.5rem)] leading-[0.9] tracking-tight">
            Meet who's <br />
            <span className="italic font-light text-flame">actually</span> here.
          </h1>

          <p className="mt-8 text-lg md:text-xl text-fog max-w-2xl mx-auto leading-relaxed">
            CoolCliq turns every bar, café, and lounge into a live social map.
            Scan the QR. See who's around. Chat anonymously. Reveal when you're ready.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <a href="#screens" className="group inline-flex items-center gap-2 px-7 py-3.5 bg-cream text-ink rounded-full font-semibold hover:bg-neon transition-colors">
              View all screens
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link to="/onboarding" className="inline-flex items-center gap-2 px-7 py-3.5 glass rounded-full font-semibold hover:border-neon/40 transition">
              Try the flow
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <Stat n="< 30s" l="QR to chat" />
            <Stat n="90 min" l="Auto-expire" />
            <Stat n="100%" l="Anonymous by default" />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-fog uppercase animate-float">
          Scroll ↓
        </div>
      </section>

      {/* PRINCIPLES STRIP */}
      <section className="border-y border-smoke py-8 bg-graphite">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <Principle k="Anonymous" v="No name. No table. No identity until both agree." />
          <Principle k="Geo-locked" v="Server validates you're inside the venue radius." />
          <Principle k="Time-bound" v="Presence expires after 90 minutes. Always." />
          <Principle k="Panic-exit" v="One tap kills your presence and every active chat." />
        </div>
      </section>

      {/* SCREENS */}
      <section id="screens" className="py-24 px-6">
        <div className="max-w-6xl mx-auto mb-16 text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-flame uppercase">The build</p>
          <h2 className="mt-3 font-display text-5xl md:text-6xl font-bold">Every screen, end-to-end.</h2>
          <p className="mt-4 text-fog max-w-2xl mx-auto">Eight production-ready React screens covering the full user + admin flow. Each one is mobile-responsive and live.</p>
        </div>

        <div className="space-y-32 max-w-7xl mx-auto">
          {screens.map((s, i) => (
            <ScreenBlock key={s.label} {...s} index={i} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-smoke bg-graphite py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-wrap gap-3 md:justify-end">
              <FooterLink icon={<Github className="w-4 h-4" />} label="GitHub" href="https://github.com/ParrvLuthra22/coolcliq.git" />
              <FooterLink icon={<Figma className="w-4 h-4" />} label="Figma" href="https://www.figma.com/board/cbNQxGwtnFkEIY7l6xFx5G/CoolCliq-%E2%80%94-User---Admin-Flow?node-id=0-1&t=09rA30h4dc7Lw9et-1" />
              <FooterLink icon={<ExternalLink className="w-4 h-4" />} label="Live demo" href="https://elegant-croissant-911523.netlify.app/" />
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-smoke flex flex-wrap items-center justify-between gap-3 text-xs text-fog font-mono">
            <span>© 2025 COOLCLIQ · ASSIGNMENT SUBMISSION</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ n, l }) {
  return (
    <div className="text-center">
      <div className="font-display text-3xl md:text-4xl font-bold text-cream">{n}</div>
      <div className="mt-1 font-mono text-[10px] tracking-[0.2em] uppercase text-fog">{l}</div>
    </div>
  );
}

function Principle({ k, v }) {
  return (
    <div>
      <div className="font-display text-base font-semibold text-cream">{k}</div>
      <div className="text-fog text-xs mt-1">{v}</div>
    </div>
  );
}

function FooterLink({ icon, label, href }) {
  return (
    <a href={href} className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm hover:border-neon/40 transition">
      {icon}{label}
    </a>
  );
}

function ScreenBlock({ label, title, desc, Comp, index, fullWidth }) {
  const flip = index % 2 === 1;
  return (
    <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${flip ? 'lg:[direction:rtl]' : ''}`}>
      <div className="lg:[direction:ltr]">
        <p className="font-mono text-xs tracking-[0.3em] text-neon uppercase">{label}</p>
        <h3 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-tight">{title}</h3>
        <p className="mt-4 text-fog text-lg leading-relaxed max-w-md">{desc}</p>
      </div>
      <div className="lg:[direction:ltr]">
        {fullWidth ? (
          <div className="rounded-3xl overflow-hidden glass shadow-soft">
            <Comp embedded />
          </div>
        ) : (
          <PhoneFrame>
            <Comp embedded />
          </PhoneFrame>
        )}
      </div>
    </div>
  );
}
