# Submission guide

This is the final-step checklist for submitting to **people@coolcliq.in**.

The assignment requires three links:
1. ✅ **Netlify deploy URL**
2. ✅ **GitHub repo URL**
3. ✅ **Public Figma link** showing the AI-designed flow

Plus the optional bonus:
4. **PostgreSQL schema** (already in `server/prisma/schema.prisma`)
5. **Node.js server** (already in `server/`)

---

## 1. The Figma flow link

The assignment says you used **Claude / GPT / etc. to design the flows, then exported to Figma**. You have two options:

### Option A — Use a flow diagram (fastest, recommended)
A flow diagram showing the user journey is what reviewers actually want to see — they want proof that you thought through the UX, not pixel-perfect mocks (which the deployed site already shows).

A FigJam flow diagram covering all 8 screens has been generated for this submission — see the link below or generate a fresh one.

### Option B — Recreate the screens as Figma frames
If you want actual frames in Figma (more time, looks more like "design work"):

1. Go to [figma.com](https://figma.com) → create a new design file → name it "CoolCliq".
2. For each screen on your deployed Netlify site:
   - Open the screen in Chrome.
   - Take a clean screenshot (use **CleanShot X** or **macOS Cmd+Shift+4**).
   - Drag the screenshot into Figma.
   - Place them on a 1440×900 canvas, label each one ("01 — Onboarding", "02 — Profile", etc.).
3. Add arrows connecting screens to show the flow.
4. **Share → "Anyone with the link can view"** → copy the link.

### Option C — Use Builder.io / Anima / Locofy
These tools convert your deployed site directly into Figma frames in one click. Search "Builder.io Figma plugin" or "Anima HTML to Figma".

**For this assignment, Option A (a flow diagram) is more than enough**. The deployed site is the actual design proof.

---

## 2. Sanity check before submitting

- [ ] Netlify URL loads and shows the showcase landing page
- [ ] All 8 screens render correctly when scrolled
- [ ] Each route (`/onboarding`, `/scan`, etc.) is reachable directly
- [ ] GitHub repo is **public** (Settings → General → Danger Zone → Change visibility)
- [ ] README on GitHub renders correctly (preview it on github.com)
- [ ] Figma link opens in incognito (proves it's actually public)
- [ ] No `.env` files committed to GitHub (run `git log --all -- .env` to check)

---

## 3. Email template

Subject:
```
Newton School Assignment Submission — CoolCliq
```

Body:
```
Hi CoolCliq team,

Submitting my completed assignment for the Newton School × CoolCliq application.

I built the full stack — frontend, database schema, and Node.js server — to give you a complete picture of how I'd approach this product.

🌐  Live demo (Netlify):  https://YOUR-SITE.netlify.app
💻  GitHub repo:          https://github.com/YOUR-USERNAME/coolcliq-newton-submission
🎨  Figma flow:           https://www.figma.com/file/YOUR-FILE-ID

A few notes on what's inside:

• Frontend — React + Vite + Tailwind. 8 fully-designed mobile screens
  (onboarding, profile, QR scanner, discover map, venue detail,
  anonymous chat, mutual reveal, admin dashboard) plus a showcase
  landing page that wraps each screen in a phone frame for
  desktop reviewers. All mobile-responsive.

• Database — full Prisma schema with 10 models covering users,
  presence, chats with mutual-reveal state, blocks, reports,
  admin audit logs, and signed QR tokens with cloning protection
  (per-venue secret + version number).

• Server — Express + Socket.IO + Prisma. Phone OTP auth,
  geo-validated check-in, real-time chat, admin moderation panel,
  CSV export, separate rate limiters for OTP/chat/general endpoints.

• Security — every check-in is server-side haversine-validated,
  table numbers are hidden until both parties opt in to reveal,
  panic exit closes presence + all chats in a single transaction,
  admin actions are audit-logged.

The README in the repo explains the full architecture, security
model, and local setup. Happy to walk through the build on a
call whenever it's convenient.

Looking forward to hearing back.

Best,
[Your name]
[Your phone]
[Your portfolio / LinkedIn]
```

---

## 4. After sending

- LinkedIn: send a short connection request to whoever's hiring at CoolCliq, mentioning that you submitted.
- Don't follow up for at least 4 working days.
- If you don't hear back in 7 days, a single polite nudge is fine — anything more comes off as pushy.

Good luck.
