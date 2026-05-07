import { useState } from 'react';
import { Link } from 'react-router-dom';
import PhoneFrame from '../components/PhoneFrame.jsx';
import { ChevronLeft, MoreHorizontal, Send, Eye, AlertOctagon, Sparkles } from 'lucide-react';

const initial = [
  { id: 1, from: 'them', text: 'okay your handle is a vibe.', time: '9:42 PM' },
  { id: 2, from: 'me',   text: 'thanks. yours sounds like a cocktail.', time: '9:42 PM' },
  { id: 3, from: 'them', text: 'fair. what are you drinking?', time: '9:43 PM' },
  { id: 4, from: 'me',   text: 'old fashioned. classic me.', time: '9:43 PM' },
  { id: 5, from: 'them', text: 'a person of taste 🥃', time: '9:44 PM' },
];

export default function Chat({ embedded = false }) {
  const inner = <Inner />;
  if (embedded) return inner;
  return <PhoneFrame label="Anonymous chat">{inner}</PhoneFrame>;
}

function Inner() {
  const [messages, setMessages] = useState(initial);
  const [draft, setDraft] = useState('');

  const send = () => {
    if (!draft.trim()) return;
    setMessages([...messages, { id: Date.now(), from: 'me', text: draft, time: 'now' }]);
    setDraft('');
  };

  return (
    <div className="h-full flex flex-col bg-ink relative">
      {/* HEADER */}
      <div className="px-4 py-3 border-b border-smoke flex items-center gap-3 bg-graphite/80 backdrop-blur">
        <Link to="/venue" className="w-9 h-9 rounded-full glass flex items-center justify-center">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-display font-bold truncate">@echo.42</p>
            <span className="px-1.5 py-0.5 rounded-md bg-neon/15 border border-neon/30 text-[9px] font-mono text-neon">ANON</span>
          </div>
          <p className="text-[10px] text-fog flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-neon dot-active" />
            at Toit Brewpub · table hidden
          </p>
        </div>
        <button className="w-9 h-9 rounded-full glass flex items-center justify-center">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* ANONYMITY BANNER */}
      <div className="mx-4 mt-3 p-3 rounded-2xl bg-neon/10 border border-neon/30 flex items-start gap-2">
        <Sparkles className="w-3.5 h-3.5 text-neon flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-neon leading-snug">
          You're chatting anonymously. Names, photos, and table numbers stay hidden until you both agree to reveal.
        </p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-snug ${
              m.from === 'me'
                ? 'bg-flame text-cream rounded-br-md'
                : 'glass text-cream rounded-bl-md'
            }`}>
              {m.text}
              <span className={`block text-[9px] mt-1 ${m.from === 'me' ? 'text-cream/60' : 'text-fog'}`}>{m.time}</span>
            </div>
          </div>
        ))}
        {/* typing */}
        <div className="flex justify-start">
          <div className="glass px-4 py-3 rounded-2xl rounded-bl-md">
            <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
          </div>
        </div>
      </div>

      {/* REVEAL CTA */}
      <Link to="/reveal" className="mx-4 mb-3 block">
        <div className="rounded-2xl p-3 bg-gradient-to-r from-flame/20 to-ice/20 border border-flame/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cream text-ink flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Ready to meet?</p>
            <p className="text-[11px] text-fog">Both tap accept → table numbers revealed.</p>
          </div>
          <button className="px-3 py-1.5 rounded-full bg-cream text-ink text-xs font-bold">
            Reveal
          </button>
        </div>
      </Link>

      {/* COMPOSER */}
      <div className="border-t border-smoke px-3 py-3 flex items-end gap-2 bg-graphite/80">
        <button className="w-10 h-10 rounded-2xl glass flex items-center justify-center flex-shrink-0">
          <AlertOctagon className="w-4 h-4 text-flame" />
        </button>
        <div className="flex-1 glass rounded-2xl px-3.5 py-2.5 flex items-end">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }}}
            rows={1}
            placeholder="Type a message…"
            className="flex-1 bg-transparent resize-none focus:outline-none text-sm placeholder:text-fog max-h-20"
          />
        </div>
        <button onClick={send} className="w-10 h-10 rounded-2xl bg-flame flex items-center justify-center flex-shrink-0 shadow-glow">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
