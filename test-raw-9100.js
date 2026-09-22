/**
 * Send a minimal ESC/POS test to a network thermal printer (raw 9100).
 * Usage: node test-raw-9100.js 192.168.1.50 [9100]
 */
const net = require("net");

const host = process.argv[2];
const port = Number(process.argv[3] || 9100);
if (!host) {
  console.error("Usage: node test-raw-9100.js <PRINTER_IP> [port]");
  process.exit(1);
}

const lines = [
  "\x1b\x40", // init
  "StakSuite test print\n",
  "IP " + host + ":" + port + "\n",
  new Date().toLocaleString() + "\n",
  "------------------------\n",
  "If you see this, raw 9100 works.\n\n\n",
  "\x1d\x56\x00", // cut
];
const buf = Buffer.from(lines.join(""), "binary");

const socket = net.createConnection({ host, port }, () => {
  socket.write(buf, (err) => {
    if (err) {
      console.error("Write failed:", err.message);
      process.exit(1);
    }
    socket.end();
    console.log("OK: sent", buf.length, "bytes to", host + ":" + port);
  });
});
socket.setTimeout(8000, () => {
  console.error("Timeout connecting to", host + ":" + port);
  socket.destroy();
  process.exit(1);
});
socket.on("error", (e) => {
  console.error("Connection error:", e.message);
  process.exit(1);
});
