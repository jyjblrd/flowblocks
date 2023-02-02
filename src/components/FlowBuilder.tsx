/* eslint-disable @typescript-eslint/no-shadow */
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
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  DndContext, DragEndEvent, useDroppable,
} from '@dnd-kit/core';
import BlockNode, { BlockNodeData } from './BlockNode';
import Palette from './Palette';
import { BlockKind, blockKindData } from '../blocks';
import Droppable from './Droppable';

const initialNodes: Node<BlockNodeData>[] = [];
const initialEdges: Edge[] = [];
const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'smoothstep',
};

function FlowBuilder() {
  const { setNodeRef } = useDroppable({
    id: 'flow-builder',
  });

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

  const { project } = useReactFlow();

  function handleDragEnd(event: DragEndEvent) {
    if (event.active.data.current && event.over && event.over.id === 'flow-builder' && event.active.rect.current.translated) {
      const newID = Math.random().toString();

      const newNodeData = blockKindData[event.active.data.current.kind as BlockKind];

      const newNode = {
        type: 'block',
        id: newID,
        position: project({
          x: event.active.rect.current.translated.left,
          y: event.active.rect.current.translated.top,
        }),
        data: newNodeData,
      };
      setNodes((nodes) => nodes.concat([newNode]));
    }
  }

  return (
    <DndContext
      onDragEnd={(event) => handleDragEnd(event)}
    >
      <Droppable label="flow-builder" />
      <div ref={setNodeRef} style={{ height: '100%' }}>
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
      </div>
      <Palette />
    </DndContext>
  );
}

export default FlowBuilder;
