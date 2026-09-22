# Optional: Add a Windows Standard TCP/IP printer queue for a network thermal printer.
# Run in PowerShell AS ADMINISTRATOR.
# This creates an OS print queue (useful for browser print). ESC/POS bridge can still use raw 9100.

param(
  [Parameter(Mandatory = $true)][string]$PrinterIP,
  [string]$PrinterName = "StakSuite-Thermal",
  [int]$Port = 9100
)

$ErrorActionPreference = "Stop"
$portName = "IP_${PrinterIP}"

Write-Host "Adding TCP/IP port $portName -> ${PrinterIP}:$Port"

Add-PrinterPort -Name $portName -PrinterHostAddress $PrinterIP -PortNumber $Port -ErrorAction SilentlyContinue

# Generic / Text Only is widely available on Windows
$driver = "Generic / Text Only"
Write-Host "Installing printer '$PrinterName' with driver '$driver'"
Add-Printer -Name $PrinterName -DriverName $driver -PortName $portName -ErrorAction SilentlyContinue

Write-Host "Done. Check Settings > Printers for '$PrinterName'."
Write-Host "For StakSuite network ESC/POS, still set Printer IP=$PrinterIP Port=$Port in the app and run escpos-bridge."
