# Ethiopian + U.S. Calendar (free PWA)

## Run locally
Open `index.html` in your browser to preview the app. For offline service-worker functionality, use a local web server, e.g. in this folder run `python -m http.server 8000`, then visit http://localhost:8000.

## Publish for free with GitHub Pages
1. Create a free account at https://github.com and a new public repository, e.g. `ethio-calendar`.
2. Upload all files **inside this folder** to the root of the repository (not the folder itself).
3. Open repository Settings > Pages. Under Build and deployment, select **Deploy from a branch**, branch `main`, folder `/ (root)`, and Save.
4. Wait for the published link, typically `https://YOUR-USERNAME.github.io/ethio-calendar/`.
5. On iPhone, open that HTTPS URL in Safari, tap Share > Add to Home Screen > Add. On Android, use Chrome's Install app/Add to Home screen option.

GitHub Pages is free for public repositories, subject to its usage policies and limits. GitHub Pages is not intended to serve as free hosting for a commercial online business; if you later monetize the app, review the hosting terms and move to a suitable host if needed.

## Features
- Ethiopian 13-month calendar with Ethiopian leap years.
- Gregorian calendar and dual view.
- Ethiopian / U.S. dates and selected holidays.
- Amharic month labels and English labels.
- Date conversion and device-local event storage.
- Installable PWA and offline cache after first successful online visit.

## Notes
- The holiday list is illustrative, **not exhaustive**. It includes several fixed Ethiopian holidays and selected U.S. federal holidays. Movable Ethiopian holidays (e.g. Fasika), observed U.S. holiday dates, and local holiday rules are not yet implemented.
- Events are stored only in the current browser/device. They are not synced or backed up.
- This version does not include advertisements, subscriptions, or analytics. These can be considered later without changing the core calendar.
- Test date conversions and holiday rules before relying on the app for official or legal scheduling.
