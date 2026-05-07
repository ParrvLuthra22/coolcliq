# CoolCliq — Server

Express + Socket.IO + Prisma backend.

## Stack
- **Express 4** — REST API
- **Socket.IO 4** — real-time chat, typing, reveal events
- **Prisma 5** — type-safe ORM for PostgreSQL
- **Zod** — request validation
- **JWT** (`jsonwebtoken`) — user + admin sessions, signed QR tokens
- **bcrypt** — OTP hashing + admin passwords
- **helmet, cors, morgan** — standard hardening + logging
- **express-rate-limit** — separate limiters for OTP, chat, and general endpoints

## Run

```bash
cp .env.example .env             # fill DATABASE_URL + JWT_SECRET
npm install
npx prisma generate
npx prisma migrate dev           # creates tables
npm run seed                     # admin + 4 Bangalore venues
npm run dev                      # http://localhost:4000
```

Health check: `curl http://localhost:4000/api/health`

## Endpoints (REST)

### Auth
- `POST /api/auth/otp/request`            `{ phone }` → sends OTP (returns `devCode` in dev mode)
- `POST /api/auth/otp/verify`             `{ phone, code, handle?, age?, gender? }` → JWT
- `GET  /api/auth/me`                     auth → current user
- `DELETE /api/auth/me`                   auth → soft-delete account

### Venues
- `GET  /api/venues/nearby?lat&lng&radius`  auth → list with active counts + demographics
- `GET  /api/venues/:id`                    auth → venue + active users (table numbers hidden)

### Presence
- `POST /api/presence/check-in`           `{ qrToken, lat, lng }` → verifies QR + geo, assigns table
- `GET  /api/presence/me`                 auth → current presence
- `POST /api/presence/check-out`          auth
- `POST /api/presence/panic`              auth → ends presence + closes all active chats

### Chats
- `POST /api/chats/start`                 `{ recipientId, venueId }` → creates chat
- `GET  /api/chats`                       auth → list (sanitized — other party's table hidden)
- `GET  /api/chats/:id/messages`          auth → message history
- `POST /api/chats/:id/reveal/request`    request mutual reveal
- `POST /api/chats/:id/reveal/respond`    `{ accept }` → accept/decline
- `POST /api/chats/:id/end`               close the chat
- `POST /api/chats/block`                 `{ userId }` → block

### Reports
- `POST /api/reports`                     `{ reportedId, chatId?, reason, details? }`

### Admin
- `POST /api/admin/login`                 `{ email, password }` → admin JWT
- `GET  /api/admin/stats`                 → KPIs (active, DAU, reveal rate, etc.)
- `POST /api/admin/venues`                create venue
- `GET  /api/admin/venues`                list
- `POST /api/admin/venues/:id/qr`         generate printable QR JWT
- `POST /api/admin/venues/:id/rotate-qr`  invalidate all printed QRs
- `GET  /api/admin/reports?status=`       moderation queue
- `POST /api/admin/reports/:id/resolve`   `{ actionTaken, dismiss? }`
- `GET  /api/admin/users?q=`              search users
- `POST /api/admin/users/:id/action`      `{ action }`  SUSPEND | BAN | RESTORE
- `GET  /api/admin/export/users.csv`      CSV download

## Socket.IO events (`/`)

Auth: pass `auth: { token: <userJWT> }` in the handshake.

| Event                      | Direction | Payload                          |
| -------------------------- | --------- | -------------------------------- |
| `chat:join`                | C → S     | `{ chatId }` → joins room        |
| `chat:message`             | C → S     | `{ chatId, content }` → broadcasts |
| `chat:message`             | S → C     | the saved message                |
| `chat:typing`              | both      | `{ chatId, isTyping }`           |
| `chat:reveal-request`      | both      | `{ chatId }`                     |

## Database

10 models, 8 enums. See `prisma/schema.prisma`. Highlights:
- `Presence` — single hot path index `(venueId, status, expiresAt)` for "who's active here"
- `Chat` — composite unique on `(initiatorId, recipientId, venueId)` to prevent duplicates
- `AuditLog` — every admin moderation action recorded
- `OtpCode` — bcrypt-hashed codes only, never plaintext

## Production checklist

- [ ] Real OTP provider (Twilio / MSG91 / Firebase) — replace the dev OTP echo in `routes/auth.js`
- [ ] Set `NODE_ENV=production`
- [ ] Set strong `JWT_SECRET` (≥ 64 random bytes)
- [ ] Set `CLIENT_ORIGIN` to your Netlify URL
- [ ] Run `prisma migrate deploy` on the production DB (not `migrate dev`)
- [ ] Set up a cron / scheduled job to mark expired presences as `EXPIRED` (currently filtered by `expiresAt` at query time, which is fine but doesn't free index space)

## Login (after seed)
Admin: `admin@coolcliq.in` / `admin123` — change immediately on first deploy.
