# CryptoPulse

CryptoPulse is a lightweight, responsive cryptocurrency price tracker built with React, Vite and TailwindCSS. It uses the CoinGecko public API to show live market data, inline sparklines, per-coin charts and a persistent watchlist.

Demo: local development (no backend required)

Features (implemented)
- Searchable list of cryptocurrencies (name or symbol)
- Sort by Price / Market Cap / 24h Change
- Inline sparkline for quick glance (from CoinGecko markets `sparkline_in_7d`)
- Per-coin chart modal (24h / 7d / 30d) using `recharts`
- Watchlist with persistent storage (`localStorage`) and a dedicated Watchlist page
- Auto-refreshing data (market: 10s, watchlist: 15s)
- Loading and error states, retry for chart loads
- Clean, dark-ish Tailwind UI, responsive for mobile and desktop

Planned / optional enhancements
- Notifications / price alerts
- Import/export watchlist, portfolio calculator
- News feed, trending cards, server-side caching / proxy

Tech Stack
- React (functional components + hooks)
- Vite (dev tooling)
- TailwindCSS (styling)
- Axios (HTTP requests)
- Recharts (charts)
- CoinGecko public API (no API key required)

Project structure (important files)

- `index.html` — app entry
- `vite.config.js` — Vite configuration
- `src/main.jsx` — React entry
- `src/App.jsx` — app root (view & watchlist state)
- `src/pages/Home.jsx` — market list
- `src/pages/Watchlist.jsx` — watchlist page
- `src/components/Header.jsx` — header & navigation
- `src/components/SearchSortBar.jsx` — search & sort controls
- `src/components/CryptoTable.jsx` — table wrapper
- `src/components/CryptoRow.jsx` — coin row + inline sparkline + chart trigger
- `src/components/CoinChartModal.jsx` — per-coin chart modal (recharts)
- `api/crypto.js` — API helpers (markets, charts, caching)
- `assets/logo.svg` — simple app logo

Installation & running (PowerShell)

1. Install dependencies

```powershell
cd C:\Users\Admin\Downloads\CryptoPulse
npm install
```

2. Start development server

```powershell
npm run dev
```

3. Open the URL shown by Vite (usually `http://localhost:5173`)

Build for production

```powershell
npm run build
npm run preview
```

Notes & developer tips

- Rate limits & CORS: CoinGecko is a public API with rate limits. During development you may hit 429 (Too Many Requests) if the client makes many concurrent calls. To reduce requests the app:
	- Uses the markets endpoint with `sparkline=true` so inline sparklines are returned with the markets response.
	- Caches per-coin chart responses in memory during the session.

- Dev proxy: if you see CORS errors in the browser during development you can add a dev proxy in `vite.config.js` to forward requests to CoinGecko. For production, consider adding a server-side proxy (serverless function or small API) to control rate limits and CORS headers.

- Local persistence: the watchlist is stored in `localStorage` under the key `cp_watchlist`.

- Chart retry: chart modal shows a retry button and clears the cached entry on retry.

Testing & linting

This project doesn't include tests or linters by default. For a production project consider adding:
- ESLint + Prettier
- Unit tests with Jest or Vitest and React Testing Library
- A simple CI workflow (GitHub Actions) to run tests and builds

Contributing

1. Fork the repository and create a feature branch
2. Implement your changes and add tests where applicable
3. Open a pull request with a clear description of your changes

Deployment

The app is a static frontend and can be deployed to Vercel, Netlify, or any static host. If you rely on CoinGecko in production, prefer using a lightweight server-side proxy to avoid exposing many clients directly to the API and to add caching.

License

MIT — feel free to use and modify.

Questions / Next steps

- Want me to add import/export + clear-watchlist actions (easy)?
- Want a Vite dev proxy configured automatically (dev-only)?
- Want a small serverless proxy example for production?

If you tell me which option you prefer I can implement it and update the README with deployment instructions.
