/* eslint-disable @typescript-eslint/no-shadow */
import React, {
  useState, useCallback,
} from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Edge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import DefaultNode from './DefaultNode';
import { NodeTypeData } from '../shared/interfaces/NodeTypes.interface';

const initialNodes: Node<NodeTypeData>[] = [];
const initialEdges: Edge[] = [];

const reactflowNodeTypes = { defaultNode: DefaultNode };

function FlowBuilder() {
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
        nodeTypes={reactflowNodeTypes}
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default FlowBuilder;
