# MITMARKET Mobile Web

React/Vite mobile web interface for the **same MITMARKET website**. This is not a native mobile application.

## Status

**Visual reference coverage: 56/56.** The original Stitch export is available via `/screens` and `/design/:slug` (52 source HTML screens plus four reference artworks). React routes in `/screen/:slug` contain early functional shells for markets, trading, accounts, wallets, settings, authentication and support. They are not yet production-ready, and the original Stitch HTML is a reference in a sandboxed iframe, not a fully converted React component.

The homepage displays public Polymarket market catalog data and read-only price history. Exact desktop category selectors/priorities, authenticated account APIs, execution, balance retrieval and secure wallet flows remain unintegrated. Account, wallet and trading actions are disabled until server-side integration and explicit approval. Stitch previews may contain illustrative sample balances or activity; these are **not** real user data.

## Development

```bash
npm install
npm run dev
npm run build
```

## Integration contract

- Desktop remains at [`NADER-CY/mitmarket`](https://github.com/NADER-CY/mitmarket), untouched by this repository.
- Mobile uses the same market data sources and must ultimately reuse desktop category filtering, order, and card priorities.
- The mobile design follows the approved Google Stitch reference, with the desktop MITMARKET palette.
- Deployment of the mobile route onto the common domain will be coordinated separately; this repository does not change DNS or production routing.

## Reference

The original approved Google Stitch files are preserved under `public/design/`. `/design/:slug` is the pixel-oriented reference view, while `/screen/:slug` is the corresponding React route intended for API integration. Review and sign-off should use the integrated mobile web deployment after the React/API conversion is completed.
