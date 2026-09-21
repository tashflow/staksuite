# StakSuite

Single-file web suite: **StockStak** (inventory & POS) + **SweetStak**.

## Quick start

1. Download or clone this repo.
2. Open `index.html` in a modern browser  
   **or** serve locally (recommended for Firebase / printer bridge):

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

3. Visit `http://localhost:8080`

## Main file

| File | Description |
|------|-------------|
| `index.html` | Full StakSuite app (landing + modules) |

## Optional

| Folder | Description |
|--------|-------------|
| `escpos-bridge/` | Local network thermal printer bridge |
| `thermal-printer-setup/` | Printer driver notes & test scripts |

## Notes

- Theme (dark/light) is saved in `localStorage`.
- Company portal data uses Firebase when configured.
- For thermal IP printing, run `escpos-bridge` and set the printer IP in StockStak → Printer settings.

## License

Private / as provided by the project owner.
