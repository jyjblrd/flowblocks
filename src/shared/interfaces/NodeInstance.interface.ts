export type NodeInstance = {
  nodeTypeId: string,
  connections: Record<string, { connectedNodeId: string, connectedNodeOutputId: string }>,
  attributes: Record<string, string>,
  // Counts the number of edges connected to each input/output node
  isInputConnected: Array<number>,
  isOutputConnected: Array<number>,
  blockName: string
};
