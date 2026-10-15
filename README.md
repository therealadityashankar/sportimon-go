# Simple Counter PWA

A clean, minimalist Progressive Web App built with Next.js.

## Features

- **PWA Ready & Installable**: Includes web manifest (`manifest.json` / `manifest.webmanifest`) and Service Worker (`sw.js`) for standalone installability and offline support.
- **Counter Core**:
  - Increment (`+`), Decrement (`-`), and Reset (`Reset`)
  - Adjustable step size (`+1`, `+5`, `+10`)
  - State persistence in `localStorage`
  - Keyboard shortcuts (`+`, `-`, `r`)
- **No Heavy Dependencies or AI Assets**: Clean vector SVG icons and lightweight vanilla CSS.
- **Network Status**: Real-time online/offline indicator.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.
4. Click **Install App** in the browser or on the page to install as a standalone PWA.
