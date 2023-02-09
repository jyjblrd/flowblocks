export type Vertex = {
  node_id: string,
  connections: Record<string, { connected_node_id: string, connected_node_output_id: string }>,
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
