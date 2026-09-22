/**
 * StakSuite ESC/POS receipt bridge
 * Receives base64 ESC/POS from StockStak and forwards to a thermal printer.
 *
 * Setup:
 *   cd escpos-bridge
 *   npm start
 *
 * StockStak → Printer settings:
 *   Method: Raw ESC/POS API
 *   URL:    http://127.0.0.1:3333/print
 *   API key: (optional, set BRIDGE_API_KEY)
 */

const http = require("http");
const net = require("net");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 3333);
const BRIDGE_API_KEY = process.env.BRIDGE_API_KEY || "";
const PRINTER_HOST = process.env.PRINTER_HOST || "127.0.0.1";
const PRINTER_PORT = Number(process.env.PRINTER_PORT || 9100);
const SAVE_LAST = process.env.SAVE_LAST === "1";

function sendToNetworkPrinter(buffer, host, port) {
  host = host || PRINTER_HOST;
  port = Number(port) || PRINTER_PORT;
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: host, port: port }, () => {
      socket.write(buffer, (err) => {
        if (err) return reject(err);
        socket.end();
        resolve({ ok: true, via: "tcp", host: host, port: port });
      });
    });
    socket.setTimeout(8000, () => {
      socket.destroy();
      reject(new Error("Printer connection timed out"));
    });
    socket.on("error", reject);
  });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function checkAuth(req) {
  if (!BRIDGE_API_KEY) return true;
  const auth = req.headers["authorization"] || "";
  const key = req.headers["x-api-key"] || "";
  if (key && key === BRIDGE_API_KEY) return true;
  if (auth === "Bearer " + BRIDGE_API_KEY) return true;
  return false;
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Api-Key");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      ok: true,
      service: "staksuite-escpos-bridge",
      printer: PRINTER_HOST + ":" + PRINTER_PORT
    }));
    return;
  }

  if (req.method === "POST" && (req.url === "/print" || req.url === "/")) {
    if (!checkAuth(req)) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "Unauthorized" }));
      return;
    }

    try {
      const body = await parseBody(req);
      if (!body || !body.data) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "Missing data (base64 ESC/POS)" }));
        return;
      }

      const buffer = Buffer.from(String(body.data), body.format === "hex" ? "hex" : "base64");
      if (!buffer.length) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "Empty print buffer" }));
        return;
      }

      if (SAVE_LAST) {
        fs.writeFileSync(path.join(__dirname, "last-job.bin"), buffer);
      }

      const host = String(body.host || process.env.PRINTER_HOST || "127.0.0.1").trim();
      const port = Number(body.port || process.env.PRINTER_PORT || 9100);
      const result = await sendToNetworkPrinter(buffer, host, port);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, bytes: buffer.length, ...result, width: body.width || 80, host, port }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: err.message || String(err) }));
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: false, error: "Not found. POST /print" }));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("[StakSuite ESC/POS bridge] http://127.0.0.1:" + PORT + "/print");
  console.log("  Printer target: " + PRINTER_HOST + ":" + PRINTER_PORT);
  if (BRIDGE_API_KEY) console.log("  API key protection: ON");
});
