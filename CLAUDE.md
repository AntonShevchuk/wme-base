# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WME Base is the base class for Greasy Fork userscripts for Waze Map Editor. It provides event handling, settings management, and data helper methods for working with WME segments, venues, and nodes.

Source is written in TypeScript under `src/`, built with Rollup into a single IIFE at `dist/WME-Base.user.js`. GreasyFork auto-syncs from the dist output.

## Commands

- **Install:** `npm install`
- **Build:** `npm run build`
- **Watch:** `npm run watch` (rebuild on changes)
- **Test:** `npm test`
- **Test watch:** `npm run test:watch`

## Architecture

```
src/
├── meta.ts          # userscript header (comment block, not TS code)
├── globals.d.ts     # declares WME runtime globals (getWmeSdk, Settings)
├── wme-base.ts      # WMEBase class — event handlers, data helpers, logging
└── index.ts         # bootstrap: imports WMEBase, assigns to window
tests/
└── wme-base.test.ts # vitest tests for non-WME-dependent logic
```

**Build output:** `dist/WME-Base.user.js` — IIFE with userscript header prepended as banner. Version is read from `package.json` via `{{version}}` placeholder in `meta.ts`.

**Key external dependencies** (loaded via `@require` in userscript header, not bundled):
- CommonUtils.js (Settings class)
- jQuery (DOM event binding)
- WME SDK (via `getWmeSdk`)

## Coding Conventions

- TypeScript with `strict: false` — minimal type annotations, `any` for WME SDK types
- The class is exposed as a global via `Object.assign(window, { WMEBase })`
- Lock ranks are 0-indexed (0-4)
- GitHub Actions auto-builds `dist/` on push to main
