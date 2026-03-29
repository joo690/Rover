EcoRover Dashboard Configuration Update

What was added
- New page: /configuration
- Sidebar entry: Configuration
- Static GUI-based editing for major dashboard data
- Dynamic radar on Navigation page driven by configurable obstacle points
- Local browser storage override system for dashboard data

How to use
1. Open the site.
2. Go to Configuration from the sidebar.
3. Edit metrics, chart points, bins, alerts, safety data, and radar detections.
4. Click Save changes.
5. Keep Static data mode enabled to force the site to use your GUI values.
6. Turn Static data mode off if you want to go back to live Firebase data.

Important note
- The uploaded project contains a Windows node_modules tree, so Linux build verification with Vite was blocked by a missing Rollup optional native dependency.
- TypeScript validation passed successfully with:
  node node_modules/typescript/bin/tsc --noEmit -p tsconfig.app.json
- On your machine, if Vite build/run fails, delete node_modules and run npm install again.
