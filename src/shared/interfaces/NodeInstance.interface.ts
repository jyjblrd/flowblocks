export type NodeInstance = {
  node_id: string,
  connections: Record<string, { connected_node_id: string, connected_node_output_id: string }>,
};
