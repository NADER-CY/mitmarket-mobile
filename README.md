# MITMARKET Mobile Web

React/Vite/TypeScript mobile web interface for MITMARKET, maintained separately from the desktop repository [NADER-CY/mitmarket](https://github.com/NADER-CY/mitmarket).

## Current implementation

- 52 approved Stitch HTML screens rendered through React, plus four artwork references retained in `public/design/`.
- Templates are bundled during build, avoiding an HTML download on each route change.
- MITMARKET palette, Inter typography, horizontal category navigation, back navigation and a rounded desktop phone preview with working internal scroll.
- Homepage category grids display up to 12 markets from distinct events/topics; dedicated market feeds show up to 24.
- Eight homepage spotlight slides and three to five slides on market/category pages, with real historical probability charts where available.
- Public Polymarket Gamma catalog plus a shared CLOB market WebSocket with heartbeat, reconnection, subscription cleanup and batched quote updates for connected cards and sliders.
- Market cards open `/market/:id`: live probabilities, history, YES/NO selection, market/limit inputs and estimated shares/payout.

## Important scope

This remains a frontend preview. Authentication, real account balances, wallet operations and order execution are **not connected**. Some original reference sections still contain illustrative data. Reviewing an order does not submit a transaction.

## Build

```bash
npm ci
npm run check
npm run build
```

`npm run dev` starts Vite. `scripts/compile-templates.mjs` regenerates `src/designTemplates.json` from the preserved HTML references before checks/builds; the generated file is intentionally ignored. Output is `dist/`.

## Server installation

See [server/README_FA.md](server/README_FA.md). For the supplied installer, place the built `dist/` directory next to `install-mobile.sh`, then run it with a separate mobile subdomain. Existing desktop routing is not changed. Configure HTTPS before production use.

## Validation of this update

Production build passed; all 52 reference routes were checked for rendering. Explore category expansion/navigation, card-to-trade navigation, back navigation, slider counts/fixed heights, scrolling and live WebSocket message reception were checked in the browser. This is not a full audit of every button or authenticated workflow.
