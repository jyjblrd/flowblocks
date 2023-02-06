export type Vertex = {
  kind: string,
  predecessors: Record<string, { id: string, output: string }>,
};

export function labelToVertexKind(label: string) {
  switch (label) {
    case 'Button':
      return 'DigitalPinInPullDown';
    case 'And':
      return 'Conjunction';
    case 'LED':
      return 'DigitalPinOut';
    default:
      return '';
  }
}
