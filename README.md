# CoolCliq

> Scan the QR. See who's at your venue. Chat anonymously. Reveal when you're ready.

A QR-based venue presence and anonymous chat platform — built end-to-end as a Newton School × CoolCliq assignment submission.

🔗 **Live demo:** [CoolCliq](https://coolcliq.netlify.app/)
🔗 **Figma flow:** [Figma](https://www.figma.com/board/cbNQxGwtnFkEIY7l6xFx5G/CoolCliq-%E2%80%94-User---Admin-Flow?node-id=0-1&t=09rA30h4dc7Lw9et-1)
🔗 **GitHub:** [Repository](https://github.com/ParrvLuthra22/coolcliq)

---

## What's inside

| Layer       | Stack                                                      |
| ----------- | ---------------------------------------------------------- |
| Frontend    | React 18 · Vite · Tailwind CSS · React Router · Lucide     |
| Backend     | Node.js · Express · Socket.IO · Prisma · Zod               |
| Database    | PostgreSQL (Supabase)                                      |
| Auth        | Phone OTP (JWT, 30-day sessions)                           |
| Real-time   | Socket.IO (chat, typing, reveal events)                    |
| Hosting     | Netlify (frontend) · Railway/Render/Fly (backend)          |

## Repo layout

```
coolcliq/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── pages/     # 8 screens + showcase landing
│   │   ├── components/PhoneFrame.jsx
│   │   └── index.css
│   └── netlify.toml
├── server/            # Express + Prisma + Socket.IO
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src/
│       ├── routes/    # auth, venues, presence, chats, reports, admin
│       ├── sockets/chat.js
│       └── middleware/, utils/
└── docs/
    └── DEPLOYMENT.md
```

## Core flows

1. **Onboard** → phone OTP, 18+ gate, anonymous handle picker.
2. **Discover** → live map of nearby venues with active counts and gender breakdown.
3. **Check in** → scan a venue QR. Server verifies the QR signature **and** that you're inside the venue's geo-radius.
4. **Browse the room** → see anonymous handles of everyone currently active at the venue.
5. **Chat anonymously** → identity, photos, and table numbers are all hidden.
6. **Mutual reveal** → both sides tap accept → table numbers exchanged → you can walk over IRL.
7. **Panic exit** → one tap kills your presence + closes every active chat.
8. **Admin** → live KPIs, venue management, QR generation/rotation, moderation queue, user actions, CSV export.

## Security model — quick summary

- **QR cloning protection** — each venue has a `qrSecret` and a `qrVersion` integer. QR tokens are JWTs signed with the secret and tagged with the version. Rotating the version invalidates every printed QR for that venue without touching the secret.
- **Geo-validation** — every `/check-in` runs a server-side haversine check against the venue's `geoRadiusMeters`. Cannot be bypassed client-side.
- **Time-bound presence** — every check-in expires automatically after 90 minutes.
- **Table privacy** — both table numbers are stored on the chat row from creation, but the API response strips the other party's table until `revealStatus === 'CONFIRMED'`.
- **Block enforcement** — `/chats/start` checks the `Block` table before allowing a thread.
- **Rate limits** — OTP requests, message sends, and general API calls all have separate limiters.
- **Audit log** — every admin moderation action writes to `AuditLog`.

## Local setup

### 1. Database
Create a free Postgres database on [Supabase](https://supabase.com) → grab the connection string.

### 2. Server
```bash
cd server
cp .env.example .env       # paste your DATABASE_URL + JWT_SECRET
npm install
npx prisma migrate dev     # creates tables
npm run seed               # admin@coolcliq.in / admin123 + 4 demo venues
npm run dev                # http://localhost:4000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev                # http://localhost:5173
```

Open `http://localhost:5173` to see the showcase landing. Each screen is also reachable directly: `/onboarding`, `/profile`, `/scan`, `/discover`, `/venue`, `/chat`, `/reveal`, `/admin`.

## Deployment

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for the full step-by-step (Netlify + Supabase + Railway).

## What I'd do next

Phase 2 ideas, not in this submission:
- WhatsApp/Twilio integration for production OTP
- Push notifications via FCM for new chats and reveal requests
- Per-table QRs (each table gets its own JWT — table number is encoded in the token)
- Image moderation on profile photos (Hive / AWS Rekognition)
- Venue-side tablet UI for managers to see live activity
- Daily metrics rollup table for admin charts (instead of querying raw `Chat` / `Presence`)

---

Built with care. Questions: open an issue or reach out via the email submission.
