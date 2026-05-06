# Build & deploy

Static export → static host. Phase 1 is **GitHub Pages project page** (`dashwhiz.github.io/plyvo`). Phase 2 swaps in a custom domain — same workflow, only `PLYVO_BASE_PATH` changes.

## next.config.ts

```ts
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoBase = process.env.PLYVO_BASE_PATH ?? ""; // e.g. "/plyvo" for GH Pages under repo path

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isProd ? repoBase : "",
  assetPrefix: isProd ? repoBase : undefined,
  trailingSlash: true, // GH Pages serves /pool/abc/ as /pool/abc/index.html
};

export default nextConfig;
```

`PLYVO_BASE_PATH` is set per-host:

| Phase                                           | Value         |
| ----------------------------------------------- | ------------- |
| Phase 1 — GH Pages project site (`/plyvo`)      | `/plyvo`      |
| Phase 2 — custom domain on GH Pages (`CNAME`)   | unset (root)  |
| (Optional) Cloudflare Pages / Vercel mirror     | unset         |

When the custom domain lands, add a `public/CNAME` file containing the domain and unset the env var in CI. No code changes required.

## Build

```
npm run build         # creates ./out
```

Static files land in `out/`. Serve any way you like.

## GitHub Pages

Two viable workflows:

1. **Project Pages** (`username.github.io/plyvo`):
   - Set `PLYVO_BASE_PATH=/plyvo` in CI.
   - Push `out/` to `gh-pages` branch (`peaceiris/actions-gh-pages` or similar).
2. **Custom domain / Pages on root**: leave base path empty.

Add `out/.nojekyll` (or configure the action) so files starting with `_` (Next emits `_next/`) are not stripped by Jekyll.

## CI sketch

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: PLYVO_BASE_PATH=/plyvo npm run build
      - run: touch out/.nojekyll
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

## Constraints from static export

- No API routes that need request introspection.
- No middleware.
- `next/image` works only with `unoptimized: true` or a custom loader. We use `unoptimized: true`.
- All routes must be static — no dynamic params Next can't enumerate at build time. Pool IDs are user-generated at runtime; we model `/pool/[id]` as a client-side route (the page is built once, the `[id]` segment is resolved in the browser via `useParams`).

## Pre-deploy checks

- `npm run lint`
- `npm run build` exits cleanly
- Smoke-test `npx serve out` on a phone-sized viewport
- Verify base path correctness by clicking around the deployed site
