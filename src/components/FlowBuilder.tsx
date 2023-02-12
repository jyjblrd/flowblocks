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
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { DragEndEvent, useDndMonitor } from '@dnd-kit/core';
import { useRecoilValue } from 'recoil';
import DefaultNode from './DefaultNode';
import { NodeTypeData } from '../shared/interfaces/NodeTypes.interface';
import Droppable from './Droppable';
import { nodeTypesAtom } from '../shared/recoil/atoms/nodeTypesAtom';

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

  const nodeTypes = useRecoilValue(nodeTypesAtom);
  const reactFlowInstance = useReactFlow();
  useDndMonitor({
    onDragEnd(event: DragEndEvent) {
      if (event.active.data.current && event.over && event.over.id === 'flow-builder' && event.active.rect.current.translated) {
        const { nodeTypeId } = event.active.data.current;
        const newNodeData = { ...nodeTypes[nodeTypeId], nodeTypeId };

        const nodes = reactFlowInstance.getNodes();
        const nextNodeInstanceId = nodes.length === 0
          ? '0'
          : (Math.max(...nodes.map((node: Node) => parseInt(node.id, 10))) + 1).toString();

        const newNode: Node = {
          id: nextNodeInstanceId,
          position: reactFlowInstance.project({
            x: event.active.rect.current.translated.left - event.over.rect.left,
            y: event.active.rect.current.translated.top - event.over.rect.top,
          }),
          data: newNodeData,
          type: 'defaultNode',
        };
        reactFlowInstance.addNodes(newNode);
      }
    },
  });

  return (
    <Droppable id="flow-builder">
      <div style={{ height: '90vh' }}>
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
    </Droppable>
  );
}

export default FlowBuilder;
