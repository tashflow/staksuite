# StakSuite ESC/POS bridge

Local HTTP bridge: **StockStak → this server → thermal printer** (network port 9100).

## Run

```bash
cd escpos-bridge
npm start
```

With a network printer IP:

```bash
PRINTER_HOST=192.168.1.50 PRINTER_PORT=9100 npm start
```

Optional:

```bash
PORT=3333
BRIDGE_API_KEY=my-secret
SAVE_LAST=1
```

## StockStak settings

**POS → Printer settings → Receipt printer API**

| Field | Value |
|--------|--------|
| Print method | **Raw ESC/POS API** |
| API / Bridge URL | `http://127.0.0.1:3333/print` |
| API key | same as `BRIDGE_API_KEY` if set |

Then click **Test printer API** or complete a checkout.

## Request body

```json
{
  "type": "escpos",
  "format": "base64",
  "data": "<base64 bytes>",
  "width": 80
}
```

## USB-only printers

This bridge targets **network raw 9100**. For pure USB, share the printer on LAN, use PrintNode, or a vendor ePOS tool.
