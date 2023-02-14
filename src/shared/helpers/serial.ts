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
  return await navigator.serial.requestPort({ filters: [PicoUSBIds] });
}

async function getPort() {
  const ports = await navigator.serial.getPorts();
  if (ports.length === 1) {
    const portInfo = ports[0].getInfo();
    if (portInfo.usbVendorId === PicoUSBIds.usbVendorId
        && portInfo.usbProductId === PicoUSBIds.usbProductId) {
      return ports[0];
    }
  }
  return forceReselectPort();
}

async function sendToDevice(content: string) {
  const port = await getPort();
  await port.open({ baudRate: PicoBaudRate });

  const encoder = new TextEncoder();
  const writer = port.writable.getWriter();
  await writer.write(encoder.encode(content));
  await writer.close();

  await port.close();
}

export async function runOnDevice(code: string) {
  await sendToDevice(`${Control.enterPasteMode}${code}${Control.exitPasteMode}`);
}

export async function stopRunning() {
  await sendToDevice(Control.interrupt);
}
