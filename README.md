# Cryptoplus (Prototype)

Aggregate crypto balances across exchanges in one dashboard. This prototype uses mocked connectors; replace with real API calls in `lib/connectors/*` for production.

## Quickstart

- Install deps: `npm i`
- Dev server: `npm run dev` (http://localhost:3000)
- Build: `npm run build`
- Start: `npm start`

## Deploy (Vercel)

- Run `vercel` or connect the repo in Vercel dashboard.
- Set environment variables if needed (production connectors).
- Framework preset: Next.js; Build command: `next build`; Output: `.next`.

## Structure

- `app/` Next.js App Router (UI, API route under `app/api/balances`)
- `lib/connectors/` Exchange connectors (mocked)
- `utils/aggregate.ts` Aggregation helpers
- `components/` UI components

## Notes

- Do NOT store API keys in client or git. For the prototype, keys are only sent per-request and not persisted. For production, add secure storage and secrets management.
