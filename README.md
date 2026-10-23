# ChartCraft Studio
Browser-based chart generator: enter numbers, get charts, statistics and PNG/JPG/PDF exports. No backend, database or API keys. Libraries are bundled in `js/vendor/` so it works offline.

## Run
1. Extract `ChartCraft-Studio.zip`.
2. Open the folder in VS Code, right-click `index.html`, choose **Open with Live Server**. (Opening index.html directly also works.)

## Use
- Pick a chart type, edit the table (add rows/series, rename headers). Everything updates instantly. Undo/redo with the ↶ ↷ buttons.
- **Paste or import**: paste cells from Excel/Sheets, or import a CSV (a header row is detected automatically). Examples are in `samples/`.
- **Design** panel: titles, axes, palette, per-segment colors, theme, number format, legend, labels, etc.
- **Export**: PNG (1-4x, transparent option), JPG (quality), PDF (A4/A3/Letter/custom, orientation, optional title/date/statistics/table, several charts via "Add to PDF report"). Preview shown in the dialog. Also CSV, config JSON, print and copy-to-clipboard.
- **Projects** auto-save to this browser's LocalStorage and do not move between devices; use *Export JSON / Import JSON*.

## Tests
`node tests/calculations.test.js` (Node 18+) tests the calculation and CSV parsing logic.

## Troubleshooting
- Blank page: check the browser console; make sure `js/vendor/` files exist.
- Clipboard copy needs HTTPS or localhost and browser permission.
- Percentages show "unavailable" when values are negative or total is zero (by design).
- Reset data: clear the site's LocalStorage in browser dev tools.

## Notes
Structure differs slightly from the brief: settings and project management live in `app.js`/`storage.js` rather than separate files.
