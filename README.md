# Pocket Ledger

A small, offline-first personal finance app. It has no account, server, analytics, or paid service. Transactions, people, accounts, and reminders stay in the browser on this device using IndexedDB, with a localStorage fallback.

## Run locally

Service workers require a secure origin. For offline/PWA behavior, serve this folder from localhost:

1. Open a terminal in this `outputs` folder.
2. Run `python -m http.server 8000` (or use any static file server).
3. Visit `http://localhost:8000`.

Opening `index.html` directly also shows the app, but service-worker installation is unavailable from a `file://` URL.

## Try it on a phone

Put the folder on a computer reachable from the phone and serve it over HTTPS (or use localhost on the phone). Open the URL in the phone browser, then choose **Add to Home Screen** / **Install app** from the browser menu. A simple LAN HTTP server may display the page, but browsers generally require HTTPS for installation and offline caching.

The service worker caches the app shell after its first successful load. App data is local to the browser profile, so clearing site data removes it. Choose Auto, Light, or Dark in Settings. Auto follows the device color preference.

## Included screens

Dashboard, Entry, Outstanding (person balances, history, quick actions, settlement, and sharing), Investment history, Reminders, Reports, and Settings are implemented. Settings includes accounts, editable categories and investment kinds, language, theme, PIN lock, backup and restore, and storage information. Reports includes summary, category, monthly trend, account, person, and investment views with CSV export, print/PDF, and share/copy actions.

## Reminder notifications and backups

Pocket Ledger checks pending reminders when the app opens, returns to the foreground, and while it remains open. It can show browser notifications when permission is granted. Fully background notifications while a PWA is closed are not guaranteed without a server or operating-system scheduling support. Use **Add to phone calendar** to download an `.ics` event with an alert; the calendar import is the reliable backup for system reminders.

Use **More → Settings → Backup and Restore** to export a JSON backup. It includes accounts (including opening balances), people, reminders, categories, investment kinds, settings, and every transaction, including transfers and investment records. PIN hashes are not included. Import supports replacing current data (a safety backup is downloaded first) or merging while skipping duplicate IDs. Pocket Ledger displays a reminder when no backup has been made in the last 30 days. Keep the downloaded file somewhere safe; app data is otherwise stored only in the current browser profile.

The optional four-digit PIN is salted and hashed with SHA-256 in this browser and is not a substitute for device encryption. Five incorrect attempts trigger a 30-second delay. On supported browsers, **Request persistent storage** asks the browser not to evict the app's local data automatically; it cannot protect data if the user clears browser storage or loses the device.

Reports can be filtered by period, account, transaction type, category, person, and whether Udhar should be included. CSV export is generated locally. Print / Save PDF opens the browser's print dialog, and Share uses the device share sheet when available or copies report text.

## Sample outstanding test cases

Run these as manual checks from the Entry screen. Start with a fresh browser profile or remove the earlier transactions first.

| Step | Entry | Expected outstanding for Rahul |
| --- | --- | --- |
| 1 | Debit → Udhar Given → ₹2,000 → add Rahul → Save | You will receive ₹2,000 |
| 2 | Credit → Udhar Received Back → ₹500 → Rahul → Save | You will receive ₹1,500 |
| 3 | Credit → Udhar Received Back → ₹1,500 → Rahul → Save | Settled (₹0) |

Udhar transactions are included in the month credit/debit summary. A repayment greater than the current outstanding prompts before saving and can be overridden.

## Files

- `index.html` — Entry screen structure
- `css/style.css` — Responsive light/dark styling
- `js/app.js` — Form behavior, validation, summaries, and recent entries
- `js/db.js` — IndexedDB storage with a localStorage fallback
- `js/translations.js` — English UI strings in one object for future translations
- `manifest.json`, `service-worker.js`, `assets/icon.svg` — Install and offline support
