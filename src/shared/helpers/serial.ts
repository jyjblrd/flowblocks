const Control = {
  enterPasteMode: '\u0005',
  exitPasteMode: '\u0004',
  interrupt: '\u0003',
} as const;

const PicoUSBIds = {
  usbVendorId: 0x2E8A,
  usbProductId: 0x0005,
} as const;

const PicoBaudRate = 115200;

export async function forceReselectPort() {
  const ports = await navigator.serial.getPorts();
  ports.forEach((port) => port.forget());
  const chosen = await navigator.serial.requestPort({ filters: [PicoUSBIds] });
  await chosen.open({ baudRate: PicoBaudRate });
  return chosen;
}

async function getPort() {
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
  return forceReselectPort();
}

async function sendToDevice(content: string) {
  const port = await getPort();
  const encoder = new TextEncoder();
  const writer = port.writable.getWriter();
  await writer.write(encoder.encode(content));
  writer.releaseLock();
}

export async function runOnDevice(code: string) {
  await sendToDevice(`${Control.enterPasteMode}${code}${Control.exitPasteMode}`);
}

export async function stopRunning() {
  await sendToDevice(Control.interrupt);
}
