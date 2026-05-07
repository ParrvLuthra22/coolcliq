# CoolCliq — Frontend

React + Vite + Tailwind. 8 mobile screens + a showcase landing page that wraps each screen in a phone frame for desktop reviewers.

## Stack
- **React 18** with React Router 6
- **Vite 5** for dev + build
- **Tailwind CSS 3** with custom theme tokens (flame, neon, ice, ink, graphite, etc.)
- **lucide-react** for icons
- **Google Fonts**: Space Grotesk (display), Inter Tight (body), JetBrains Mono

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview  # preview the production build
```

## Routes
| Path           | Screen                                  |
| -------------- | --------------------------------------- |
| `/`            | Showcase landing — every screen in one scroll |
| `/onboarding`  | Phone OTP flow                          |
| `/profile`     | Handle picker + age + gender            |
| `/scan`        | QR scanner with animated viewfinder     |
| `/discover`    | Live nearby venues map + bottom sheet   |
| `/venue`       | Active people at a venue                |
| `/chat`        | Anonymous real-time chat                |
| `/reveal`      | Mutual table-number reveal              |
| `/admin`       | Desktop ops dashboard                   |

## Design tokens
Defined in `tailwind.config.js`:

```
ink       #0A0A0F   page background
graphite  #13131A   surface
carbon    #1C1C26   elevated surface
fog       #9A9AAB   secondary text
cream     #F5F4EE   primary text
flame     #FF3D71   primary accent (magenta)
neon      #C8FF5C   accent (electric lime)
ice       #5CE1FF   cool accent
```

Custom utilities in `index.css`: `.glass`, `.grain`, `.mesh-flame`, `.mesh-cool`, `.viewfinder`, `.scanline`, `.dot-active`, `.typing-dot`.

## Connecting to the backend (optional)

Once the backend is deployed, set the API base URL in your env:
```
VITE_API_URL=https://your-server.railway.app
```
Then in your fetch calls use `import.meta.env.VITE_API_URL`. The current screens use mock data — see the routes in `server/src/routes/` for the real endpoints to wire up.

## Deploy
See `../docs/DEPLOYMENT.md`. The `netlify.toml` here handles the SPA redirect rule so React Router doesn't 404 on refresh.
