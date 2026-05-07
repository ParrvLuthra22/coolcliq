import { useState } from 'react';
import {
  LayoutDashboard, MapPin, ShieldAlert, Users, Download,
  Search, MoreHorizontal, Plus, QrCode, ArrowUpRight, TrendingUp, Activity, AlertCircle
} from 'lucide-react';

const KPIS = [
  { label: 'Active right now', value: '247', delta: '+12%', icon: Activity, accent: 'flame' },
  { label: 'DAU', value: '1,842', delta: '+5.4%', icon: TrendingUp, accent: 'neon' },
  { label: 'Chats today',     value: '386',  delta: '+18%', icon: Users,    accent: 'ice' },
  { label: 'Reveal rate',     value: '34%',  delta: '+3pp', icon: ArrowUpRight, accent: 'flame' },
];

const VENUES = [
  { name: 'Toit Brewpub',    city: 'Bangalore', active: 38, status: 'Live' },
  { name: 'The Permit Room', city: 'Bangalore', active: 24, status: 'Live' },
  { name: 'Soka',            city: 'Bangalore', active: 18, status: 'Live' },
  { name: "Bob's Bar",       city: 'Bangalore', active: 12, status: 'Live' },
  { name: 'High Ultra Lounge', city: 'Bangalore', active: 0, status: 'Paused' },
];

const REPORTS = [
  { id: 'r_8421', user: '@drift_19', reason: 'HARASSMENT', age: '4m', severity: 'high' },
  { id: 'r_8420', user: '@blank.21', reason: 'SPAM', age: '11m', severity: 'low' },
  { id: 'r_8418', user: '@neon_void', reason: 'INAPPROPRIATE_CONTENT', age: '32m', severity: 'high' },
  { id: 'r_8415', user: '@silent_x', reason: 'FAKE_PROFILE', age: '1h', severity: 'med' },
];

export default function Admin({ embedded = false }) {
  const [tab, setTab] = useState('overview');

  return (
    <div className={`${embedded ? '' : 'min-h-screen'} bg-graphite text-cream font-body`}>
      <div className="flex">
        {/* SIDEBAR */}
        <aside className="hidden md:flex w-60 flex-col border-r border-smoke bg-ink/60 backdrop-blur min-h-[700px]">
          <div className="p-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-flame flex items-center justify-center shadow-glow">
              <div className="w-3 h-3 rounded-full bg-neon" />
            </div>
            <div>
              <div className="font-display font-bold leading-tight">CoolCliq</div>
              <div className="text-[10px] text-fog font-mono tracking-widest">ADMIN</div>
            </div>
          </div>

          <nav className="px-3 py-2 space-y-1 flex-1">
            <NavItem icon={LayoutDashboard} label="Overview" active={tab === 'overview'} onClick={() => setTab('overview')} />
            <NavItem icon={MapPin} label="Venues" badge="14" onClick={() => setTab('venues')} />
            <NavItem icon={ShieldAlert} label="Moderation" badge="4" alert onClick={() => setTab('mod')} />
            <NavItem icon={Users} label="Users" onClick={() => setTab('users')} />
          </nav>

          <div className="p-4 border-t border-smoke">
            <div className="glass rounded-2xl p-3 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-flame flex items-center justify-center font-bold">A</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Aman P.</p>
                <p className="text-[10px] text-fog">Super Admin</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 min-w-0">
          {/* TOPBAR */}
          <header className="px-6 md:px-10 py-5 border-b border-smoke flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold flex-1">Operations</h1>
            <div className="hidden md:flex items-center gap-2 px-3 py-2 glass rounded-xl">
              <Search className="w-4 h-4 text-fog" />
              <input placeholder="Search…" className="bg-transparent text-sm focus:outline-none w-48 placeholder:text-fog" />
            </div>
            <button className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-cream text-ink text-sm font-semibold">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-flame text-cream text-sm font-semibold shadow-glow">
              <Plus className="w-4 h-4" /> New venue
            </button>
          </header>

          <div className="p-6 md:p-10 space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {KPIS.map((k) => (
                <div key={k.label} className="glass rounded-2xl p-5 relative overflow-hidden">
                  <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl ${
                    k.accent === 'flame' ? 'bg-flame/20' : k.accent === 'neon' ? 'bg-neon/20' : 'bg-ice/20'
                  }`} />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-widest text-fog uppercase">{k.label}</span>
                      <k.icon className={`w-4 h-4 ${
                        k.accent === 'flame' ? 'text-flame' : k.accent === 'neon' ? 'text-neon' : 'text-ice'
                      }`} />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-display text-3xl font-bold">{k.value}</span>
                      <span className="text-xs text-neon font-medium">{k.delta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Two-column row */}
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Activity chart */}
              <div className="lg:col-span-2 glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-display text-lg font-bold">Active users · last 24h</h2>
                    <p className="text-xs text-fog">Rolling 5-minute buckets</p>
                  </div>
                  <div className="flex gap-1">
                    {['24h', '7d', '30d'].map((p, i) => (
                      <button key={p} className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        i === 0 ? 'bg-cream text-ink' : 'text-fog'
                      }`}>{p}</button>
                    ))}
                  </div>
                </div>
                <ActivityChart />
              </div>

              {/* Moderation queue summary */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-bold">Moderation queue</h2>
                  <span className="px-2 py-0.5 rounded-md bg-flame/15 text-flame text-[10px] font-mono">{REPORTS.length} OPEN</span>
                </div>
                <div className="space-y-2">
                  {REPORTS.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-carbon/60 transition">
                      <div className={`w-2 h-2 rounded-full ${
                        r.severity === 'high' ? 'bg-flame' : r.severity === 'med' ? 'bg-neon' : 'bg-fog'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{r.user}</p>
                        <p className="text-[10px] text-fog font-mono">{r.reason} · {r.age}</p>
                      </div>
                      <button className="px-2 py-1 rounded-md text-[10px] font-mono bg-smoke">REVIEW</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Venues table */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold">Venues</h2>
                  <p className="text-xs text-fog">Onboarded partner venues</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg glass text-xs font-medium">Filter</button>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-fog font-mono text-[10px] tracking-widest uppercase border-b border-smoke">
                    <th className="px-5 py-2 font-medium">Venue</th>
                    <th className="px-5 py-2 font-medium">City</th>
                    <th className="px-5 py-2 font-medium">Active</th>
                    <th className="px-5 py-2 font-medium">Status</th>
                    <th className="px-5 py-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {VENUES.map((v) => (
                    <tr key={v.name} className="border-b border-smoke/50 last:border-0 hover:bg-carbon/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-flame/15 flex items-center justify-center font-display font-bold text-flame">
                            {v.name.charAt(0)}
                          </div>
                          <span className="font-medium">{v.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-fog">{v.city}</td>
                      <td className="px-5 py-3 font-mono">{v.active}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                          v.status === 'Live' ? 'bg-neon/15 text-neon' : 'bg-smoke text-fog'
                        }`}>{v.status.toUpperCase()}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button className="w-8 h-8 rounded-lg glass flex items-center justify-center" title="QR">
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                          <button className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, badge, alert, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
        active ? 'bg-flame text-cream shadow-glow' : 'text-fog hover:bg-carbon/60 hover:text-cream'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="flex-1 text-left font-medium">{label}</span>
      {badge && (
        <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
          alert ? 'bg-flame/30 text-flame' : active ? 'bg-cream/20' : 'bg-smoke text-fog'
        }`}>{badge}</span>
      )}
    </button>
  );
}

function ActivityChart() {
  // hand-built area chart, no chart lib needed
  const points = [40, 52, 38, 65, 78, 72, 88, 96, 82, 110, 124, 138, 156, 170, 162, 180, 174, 192, 210, 198, 220, 247, 232, 220];
  const max = Math.max(...points);
  const w = 600, h = 180;
  const stepX = w / (points.length - 1);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * stepX} ${h - (p / max) * h}`).join(' ');
  const area = path + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-44">
      <defs>
        <linearGradient id="actArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FF3D71" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF3D71" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#actArea)" />
      <path d={path} stroke="#FF3D71" strokeWidth="2" fill="none" />
      {points.map((p, i) => i % 4 === 0 && (
        <circle key={i} cx={i * stepX} cy={h - (p / max) * h} r="3" fill="#0A0A0F" stroke="#FF3D71" strokeWidth="1.5" />
      ))}
    </svg>
  );
}
