export default async function runOnDevice(code: string) {
  const filters = [
    { usbVendorId: 0x2E8A, usbProductId: 0x0005 },
  ];
  const port = await navigator.serial.requestPort({ filters });
  await port.open({ baudRate: 115200 });

  const textEncoder = new TextEncoderStream();
  const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
  const writer = textEncoder.writable.getWriter();
  await writer.write(`\u0005${code}\u0004`);

  writer.close();
  await writableStreamClosed;
  await port.close();
}
