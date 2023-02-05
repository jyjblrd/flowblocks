export type Vertex = {
  kind: string,
  connections: Record<string, { id: string, output: string }>,
};
