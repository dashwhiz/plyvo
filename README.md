# plyvo

Next.js 16 app.

## Develop

```bash
npm install
npm run dev
```

App runs at http://localhost:3000.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — eslint

## Structure

```
src/
  app/         routing, layouts, pages
  components/  shared UI components
  hooks/       shared hooks
  lib/         utilities, clients, helpers
  types/       shared TypeScript types
```

Path alias: `@/*` → `src/*`.
