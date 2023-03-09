const Control = {
  enterPasteMode: '\u0005',
  reset: '\u0004',
  interrupt: '\u0003',
} as const;

const PicoUSBIds = {
  usbVendorId: 0x2E8A,
  usbProductId: 0x0005,
} as const;

const PicoBaudRate = 115200;

let running = false;

async function maybeGetPort() {
  const ports = await navigator.serial.getPorts();
  if (ports.length === 1) {
    const port = ports[0];
    const portInfo = port.getInfo();
    if (portInfo.usbVendorId === PicoUSBIds.usbVendorId
        && portInfo.usbProductId === PicoUSBIds.usbProductId
        && port.writable) {
      return port;
    }
  }
  return undefined;
}

export async function disconnectSerial() {
  (await maybeGetPort())?.close();
  const ports = await navigator.serial.getPorts();
  ports.forEach((port) => port.forget());
}

async function forceReselectPort() {
  await disconnectSerial();
  const chosen = await navigator.serial.requestPort({ filters: [PicoUSBIds] });
  await chosen.open({ baudRate: PicoBaudRate });
  return chosen;
}

async function getPort() {
  return await maybeGetPort() || forceReselectPort();
}

async function sendToDevice(content: string) {
  const port = await getPort();
  const encoder = new TextEncoder();
  const writer = port.writable.getWriter();
  await writer.write(encoder.encode(content));
  writer.releaseLock();
}

export async function stopRunning() {
  await sendToDevice(Control.interrupt);
  running = false;
}

export async function runOnDevice(code: string) {
  if (running) {
    stopRunning();
  }
  running = true;
  sendToDevice(`${Control.interrupt}${Control.reset}${Control.enterPasteMode}${code}${Control.reset}`);
}
