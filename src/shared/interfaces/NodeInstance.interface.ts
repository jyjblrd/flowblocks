export type NodeInstance = {
  nodeTypeId: string,
  connections: Record<string, { connectedNodeId: string, connectedNodeOutputId: string }>,
  attributes: Record<string, string>
};
