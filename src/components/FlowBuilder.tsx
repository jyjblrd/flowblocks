/* eslint-disable @typescript-eslint/no-shadow */
import React, {
  useState, useCallback, useMemo, useRef,
} from 'react';
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
  DndContext, DragEndEvent,
} from '@dnd-kit/core';
import Modal from 'react-modal';
import BlockNode from './BlockNode';
import Palette from './Palette';
import { NodeId, nodeTypes, NodeTypeData } from '../shared/interfaces/Node.interface';
import Droppable from './Droppable';
import Toolbar from './Toolbar';

const initialNodes: Node<NodeTypeData>[] = [];
const initialEdges: Edge[] = [];
const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'smoothstep',
};

function FlowBuilder() {
  const reactFlowRef = useRef<HTMLDivElement>(null);
  const nodeTypesA = useMemo(() => ({ block: BlockNode }), []);

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

  const [nextID, setNextID] = useState(0);

  function handleDragEnd(event: DragEndEvent) {
    if (event.active.data.current && event.over && event.over.id === 'flow-builder' && event.active.rect.current.translated) {
      const nodeId: NodeId = event.active.data.current.nodeId as NodeId;
      const newNodeData = nodeTypes[nodeId];

      const newNode: Node = {
        type: 'block',
        id: nextID.toString(),
        position: project({
          x: event.active.rect.current.translated.left - (reactFlowRef.current?.offsetLeft ?? 0),
          y: event.active.rect.current.translated.top - (reactFlowRef.current?.offsetTop ?? 0),
        }),
        data: newNodeData,
      };
      setNextID((id) => id + 1);
      setNodes((nodes) => nodes.concat([newNode]));
    }
  }

  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [modalText, setModalText] = React.useState('');

  return (
    <DndContext
      onDragEnd={(event: DragEndEvent) => handleDragEnd(event)}
    >
      <div style={{ height: '100%' }}>
        <Droppable label="flow-builder" />
        <ReactFlow
          ref={reactFlowRef}
          nodeTypes={nodeTypesA}
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
      <Toolbar
        nodes={nodes}
        edges={edges}
        setModalIsOpen={setModalIsOpen}
        setModalText={setModalText}
      />
      <Modal
        className="exportModal"
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <div style={{ display: 'flex', justifyContent: 'right', gap: '16px' }}>
          <button type="button" onClick={async () => { await navigator.clipboard.writeText(modalText); }}>Copy</button>
          <button type="button" onClick={() => { setModalIsOpen(false); }}>Close</button>
        </div>
        <textarea id="export-modal" value={modalText} style={{ width: '100%', height: '100%' }} readOnly />
      </Modal>
    </DndContext>
  );
}

export default FlowBuilder;
