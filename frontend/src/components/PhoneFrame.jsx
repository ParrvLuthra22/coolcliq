import { useEffect, useState } from 'react';

/**
 * Renders a phone-shaped chrome around the children on desktop;
 * on mobile (≤ 480px) it goes full-bleed.
 */
export default function PhoneFrame({ children, label }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 480);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return <div className="min-h-screen bg-ink text-cream">{children}</div>;
  }

  return (
    <div className="min-h-screen mesh-flame flex flex-col items-center justify-center py-10 px-6 relative overflow-hidden">
      {/* atmospheric blur orbs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-flame/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-ice/20 rounded-full blur-3xl pointer-events-none" />

      {label && (
        <div className="mb-6 text-center relative z-10">
          <p className="font-mono text-[10px] tracking-[0.3em] text-fog uppercase">{label}</p>
        </div>
      )}

      {/* Phone */}
      <div className="relative z-10">
        <div className="relative w-[380px] h-[800px] rounded-[48px] bg-black p-[10px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)]">
          {/* Screen */}
          <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-ink grain">
            {/* Status bar */}
            <div className="absolute top-0 inset-x-0 z-40 flex items-center justify-between px-7 pt-3 text-[11px] font-medium text-cream/90">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <SignalIcon />
                <WifiIcon />
                <BatteryIcon />
              </div>
            </div>
            {/* Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[100px] h-[26px] bg-black rounded-full z-50" />

            {/* Content */}
            <div className="relative w-full h-full pt-8 pb-1 overflow-hidden">
              {children}
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-cream/80 rounded-full z-50" />
          </div>
        </div>
      </div>

      <p className="mt-6 text-fog text-xs font-mono tracking-widest text-center">
        SCROLL ↓ TO VIEW ALL SCREENS
      </p>
    </div>
  );
}

function SignalIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
      <rect x="0" y="7" width="2" height="3" rx="0.3" fill="currentColor"/>
      <rect x="4" y="5" width="2" height="5" rx="0.3" fill="currentColor"/>
      <rect x="8" y="3" width="2" height="7" rx="0.3" fill="currentColor"/>
      <rect x="12" y="0" width="2" height="10" rx="0.3" fill="currentColor"/>
    </svg>
  );
}
function WifiIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 16 12" fill="currentColor">
      <path d="M8 3a8 8 0 0 1 5.66 2.34l-1.41 1.42A6 6 0 0 0 8 5a6 6 0 0 0-4.24 1.76L2.34 5.34A8 8 0 0 1 8 3zm0 4a4 4 0 0 1 2.83 1.17l-1.42 1.42A2 2 0 0 0 8 9a2 2 0 0 0-1.41.59L5.17 8.17A4 4 0 0 1 8 7zm0 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
    </svg>
  );
}
function BatteryIcon() {
  return (
    <svg width="22" height="10" viewBox="0 0 24 12" fill="none">
      <rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke="currentColor" strokeOpacity="0.4"/>
      <rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor"/>
      <rect x="22" y="3.5" width="2" height="5" rx="1" fill="currentColor" fillOpacity="0.4"/>
    </svg>
  );
}
