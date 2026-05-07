import { useEffect, useState } from 'react';
import PhoneFrame from '../components/PhoneFrame.jsx';
import { ChevronLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Onboarding({ embedded = false }) {
  const inner = <Inner />;
  if (embedded) return inner;
  return <PhoneFrame label="Onboarding">{inner}</PhoneFrame>;
}

function Inner() {
  const [step, setStep] = useState('phone'); // phone | otp
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (step !== 'otp' || seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, seconds]);

  const updateCode = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...code]; next[i] = v;
    setCode(next);
    if (v && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  return (
    <div className="h-full flex flex-col px-6">
      {step === 'phone' ? (
        <>
          {/* brand mark */}
          <div className="pt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-display font-bold text-lg tracking-tight">CoolCliq</span>
            </div>
            <span className="font-mono text-[10px] text-fog tracking-widest">v1.0</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h1 className="font-display text-[42px] leading-[1] font-bold tracking-tight">
              What's your <br />
              <span className="text-flame italic font-light">number</span>?
            </h1>
            <p className="mt-3 text-fog text-sm">We'll send you a 6-digit code. No spam, ever.</p>

            <div className="mt-8 glass rounded-2xl p-1 flex items-stretch">
              <div className="flex items-center px-4 border-r border-smoke">
                <span className="text-2xl">🇮🇳</span>
                <span className="ml-2 font-medium">+91</span>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="98765 43210"
                className="flex-1 bg-transparent px-4 py-4 text-lg font-medium tracking-wider focus:outline-none placeholder:text-ash"
              />
            </div>

            <div className="mt-5 flex items-start gap-3 text-xs text-fog">
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0 text-neon" />
              <p>
                By continuing, you confirm you're <span className="text-cream font-semibold">18+</span> and agree to our{' '}
                <span className="text-cream underline decoration-flame underline-offset-2">Terms</span> and{' '}
                <span className="text-cream underline decoration-flame underline-offset-2">Privacy Policy</span>.
              </p>
            </div>
          </div>

          <button
            disabled={phone.length !== 10}
            onClick={() => { setStep('otp'); setSeconds(45); }}
            className="mb-8 py-4 rounded-full bg-flame text-cream font-semibold disabled:opacity-30 disabled:cursor-not-allowed shadow-glow transition"
          >
            Send code
          </button>
        </>
      ) : (
        <>
          <div className="pt-6">
            <button onClick={() => setStep('phone')} className="w-9 h-9 rounded-full glass flex items-center justify-center">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h1 className="font-display text-[42px] leading-[1] font-bold tracking-tight">
              Enter the <br />
              <span className="text-neon italic font-light">code</span>.
            </h1>
            <p className="mt-3 text-fog text-sm">
              Sent to <span className="text-cream">+91 {phone}</span>{' '}
              <button onClick={() => setStep('phone')} className="text-flame underline ml-1">change</button>
            </p>

            <div className="mt-10 grid grid-cols-6 gap-2">
              {code.map((c, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  value={c}
                  maxLength={1}
                  onChange={(e) => updateCode(i, e.target.value)}
                  className="aspect-square text-center text-2xl font-display font-bold rounded-2xl glass focus:outline-none focus:border-neon/50 focus:bg-carbon"
                />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between text-xs">
              <span className="text-fog">Didn't get it?</span>
              {seconds > 0 ? (
                <span className="font-mono text-fog">Resend in {seconds}s</span>
              ) : (
                <button className="text-neon font-semibold">Resend code</button>
              )}
            </div>
          </div>

          <Link to="/profile" className="mb-8">
            <button
              disabled={code.some((c) => !c)}
              className="w-full py-4 rounded-full bg-flame text-cream font-semibold disabled:opacity-30 shadow-glow"
            >
              Verify & continue
            </button>
          </Link>
        </>
      )}
    </div>
  );
}

function Logo() {
  return (
    <div className="w-7 h-7 rounded-lg bg-flame flex items-center justify-center shadow-glow">
      <div className="w-3 h-3 rounded-full bg-neon" />
    </div>
  );
}
