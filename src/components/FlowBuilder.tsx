import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Edge,
  Node,
  DefaultEdgeOptions,
} from 'reactflow';
import 'reactflow/dist/style.css';
import BlockNode, { BlockNodeData } from './BlockNode';
import Palette from './Palette';

const initialNodes: Node<BlockNodeData>[] = [
  {
    id: '1',
    data: { label: 'Hello', sources: [], targets: ['a'] },
    position: { x: 100, y: 200 },
    type: 'block',
  },
  {
    id: '2',
    data: { label: 'World', sources: ['a', 'b'], targets: ['c'] },
    position: { x: 300, y: 200 },
    type: 'block',
  },
];

const initialEdges: Edge[] = [];
const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'smoothstep',
};

function FlowBuilder() {
  const nodeTypes = useMemo(() => ({ block: BlockNode }), []);

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultEdgeOptions={defaultEdgeOptions}
        defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
      >
        <Background />
        <Controls />
      </ReactFlow>
      <Palette setNodes={setNodes} />
    </div>
  );
}

export default FlowBuilder;
