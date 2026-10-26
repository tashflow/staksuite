# Stak Suite

Single-file web app: **StockStak** (inventory & POS) + **SweetStak** (pastry orders).

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser (Chrome, Edge, Firefox, Safari).
3. Or serve with any static server:

```bash
npx --yes serve .
# or: python3 -m http.server 8080
```

Then visit the URL shown (e.g. `http://localhost:3000`).

## Apps

| Module | Purpose |
|--------|---------|
| **StockStak** | Branch inventory, POS, transfers, attendance, permissions |
| **SweetStak** | Supervisor/chef orders, cake menu, chef inventory |

## Notes

- Data is stored in the browser (`localStorage`). Use the same browser/device to keep data.
- Optional Firebase/cloud features work when configured inside the app.
- Works offline for local features after the first load.

## License

Use and modify for your business as needed.


## Cross-device sync

Requires Firebase to be configured and online on each device:

1. Open the **same company portal** on each device.
2. Supervisor/branch accounts sync via cloud (`users_stockstak_*`).
3. Company logo syncs via `company_profile_stock_*`.
4. Inventory/POS data uses live Firestore sync when enabled.

Local-only / offline devices will not share data until they connect and open the portal again.
