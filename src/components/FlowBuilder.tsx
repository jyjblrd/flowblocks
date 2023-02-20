/* eslint-disable @typescript-eslint/no-shadow */
import React, {
  useState, useCallback, useRef,
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
import { Card } from 'react-bootstrap';
import DefaultNode from './DefaultNode';
import { NodeTypeData } from '../shared/interfaces/NodeTypes.interface';
import Droppable from './Droppable';
import { nodeTypesAtom } from '../shared/recoil/atoms/nodeTypesAtom';
import ContextMenu from './ContextMenu';
import { NodeInstance } from '../shared/interfaces/NodeInstance.interface';
import { attributeGenerator } from '../shared/helpers/helperFunctions';

const initialNodes: Node<NodeTypeData>[] = [];
const initialEdges: Edge[] = [];

const reactflowNodeTypes = { defaultNode: DefaultNode };

function FlowBuilder() {
  const nodeTypes = useRecoilValue(nodeTypesAtom);
  const reactFlowInstance = useReactFlow();

  /*
    Making the reactflow component interactive
  */
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

  /*
    Context menu handling
  */
  const selfRef = useRef<HTMLDivElement>();

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [contextMenuNode, setContextMenuNode] = useState<Node>();

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setShowContextMenu(true);
    setContextMenuPos({
      x: event.pageX - (selfRef.current?.offsetLeft ?? 0),
      y: event.pageY - (selfRef.current?.offsetTop ?? 0),
    });
    setContextMenuNode(node);
  }, []);

  const hideContextMenu = useCallback(() => {
    setShowContextMenu(false);
  }, []);

  const onNodeDragStart = useCallback(() => {
    hideContextMenu();
  }, []);

  const handleClickOutside = useCallback(() => {
    hideContextMenu();
  }, []);

  /*
    Handle dragging new node onto flowbuilder
  */
  const [userDragging, setUserDragging] = useState(false);

  useDndMonitor({
    onDragEnd(event: DragEndEvent) {
      if (event.over?.id === 'flow-builder') {
        /*
          Generate new node
        */
        const nodeTypeId = event.active.data.current?.nodeTypeId;
        const nodeInstance: NodeInstance = {
          nodeTypeId,
          connections: {},
          attributes: {},
        };
        // Populate node attributes
        Object.entries(nodeTypes[nodeTypeId].attributes)
          .forEach(([attributeId, { type }]) => {
            nodeInstance.attributes[attributeId] = attributeGenerator(type);
          });

        const nodes = reactFlowInstance.getNodes();
        const nextNodeInstanceId = nodes.length === 0
          ? '0'
          : (Math.max(...nodes.map((node: Node) => parseInt(node.id, 10))) + 1).toString();

        const newNode: Node<NodeInstance> = {
          id: nextNodeInstanceId,
          position: reactFlowInstance.project({
            x: (event.active.rect.current.translated?.left ?? 0) - event.over.rect.left,
            y: (event.active.rect.current.translated?.top ?? 0) - event.over.rect.top,
          }),
          data: nodeInstance,
          type: 'defaultNode',
        };
        reactFlowInstance.addNodes(newNode);
      }
      setUserDragging(false);
    },
    onDragStart() {
      setUserDragging(true);
      setShowContextMenu(false);
    },
  });

  return (
    <div ref={selfRef as React.RefObject<HTMLDivElement>}>
      <Droppable id="flow-builder">
        <Card className="shadow-sm" style={{ height: '90vh' }}>
          {userDragging && (
          <div
            style={{
              position: 'absolute', zIndex: 10, backgroundColor: 'rgba(0, 0, 0, 0.05)', borderRadius: 'inherit',
            }}
            className="d-flex align-items-center w-100 h-100"
          >
            <h1 className="flex-fill text-center fw-light">Drop Here</h1>
          </div>
          )}
          <ReactFlow
            nodeTypes={reactflowNodeTypes}
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeContextMenu={onNodeContextMenu}
            onNodeDragStart={onNodeDragStart}
            onPaneClick={handleClickOutside}
          >
            <Background />
            <Controls />
          </ReactFlow>
          <ContextMenu
            show={showContextMenu}
            position={contextMenuPos}
            clickedNode={contextMenuNode}
            hideMenu={hideContextMenu}
          />
        </Card>
      </Droppable>
    </div>
  );
}

export default FlowBuilder;
