# MITMARKET Mobile Web

React/Vite mobile web interface for the **same MITMARKET website**. This is not a native mobile application.

## Status

Phase 1 scaffold and read-only market homepage. The remaining Google Stitch screens and exact desktop category filters are **not yet implemented**. All account, wallet and trading actions are disabled until secure backend integration and explicit approval.

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

The approved Google Stitch export contains 56 screen previews. This implementation begins with the homepage and routing. No fictitious live financial activity is presented.
