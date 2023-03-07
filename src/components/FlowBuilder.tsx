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
  EdgeChange,
  NodeChange,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { DragEndEvent, useDndMonitor } from '@dnd-kit/core';
import { useRecoilValue } from 'recoil';
import { Card } from 'react-bootstrap';
import DefaultNode from './DefaultNode';
import Droppable from './Droppable';
import { nodeTypesAtom } from '../shared/recoil/atoms/nodeTypesAtom';
import ContextMenu from './ContextMenu';
import { NodeInstance } from '../shared/interfaces/NodeInstance.interface';
import { blockNameGenerator, attributeGenerator } from '../shared/helpers/helperFunctions';

const initialNodes: Node<NodeInstance>[] = [];
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
    (nodeChanges: NodeChange[]) => setNodes((nds) => applyNodeChanges(nodeChanges, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (edgeChanges: EdgeChange[]) => setEdges((eds) => {
      const removedEdgeIDs: Set<string> = new Set<string>();
      edgeChanges.forEach((edgeChange) => {
        if (edgeChange.type === 'remove') {
          removedEdgeIDs.add(edgeChange.id);
        }
        // I don't think it's necessary to deal with the reset type.
      });
      // These take a node id, then a handle index,
      // and return the number of times it has been decremented.
      const removedInputs: Record<string, Record<string, number>> = {};
      const removedOutputs: Record<string, Record<string, number>> = {};
      edges.forEach((edge) => {
        if (removedEdgeIDs.has(edge.id) && edge.sourceHandle && edge.targetHandle) {
          if (!(edge.source in removedOutputs)) removedOutputs[edge.source] = {};
          if (!(edge.target in removedInputs)) removedInputs[edge.target] = {};
          if (!(edge.sourceHandle in removedOutputs[edge.source])) {
            removedOutputs[edge.source][edge.sourceHandle] = 0;
          }
          if (!(edge.targetHandle in removedInputs[edge.target])) {
            removedInputs[edge.target][edge.targetHandle] = 0;
          }
          removedOutputs[edge.source][edge.sourceHandle] += 1;
          removedInputs[edge.target][edge.targetHandle] += 1;
        }
      });

      setNodes((nodes) => {
        const newNodes = nodes.map((node) => {
          if (node.id in removedInputs || node.id in removedOutputs) {
            const newNode = node;
            newNode.data = { ...node.data };
            if (node.id in removedInputs) {
              Object.entries(removedInputs[node.id]).forEach(([input, num]) => {
                newNode.data.isInputConnected[+input] -= num;
              });
            }
            if (node.id in removedOutputs) {
              Object.entries(removedOutputs[node.id]).forEach(([output, num]) => {
                newNode.data.isOutputConnected[+output] -= num;
              });
            }
            return newNode;
          } else return node;
        });
        return newNodes;
      });

      return applyEdgeChanges(edgeChanges, eds);
    }),
    [edges, setNodes],
  );

  const onConnect = useCallback((connection: Connection) => setEdges((eds) => {
    const source = nodes.find((node) => node.id === connection.source);
    const target = nodes.find((node) => node.id === connection.target);
    if (source && target) {
      setNodes((nodes) => nodes.map((node) => {
        if (node.id === source.id && connection.sourceHandle) {
          // We duplicate the node data in order to notify ReactFlow about the change.
          const newNode = node;
          newNode.data = { ...node.data };
          newNode.data.isOutputConnected[+connection.sourceHandle] += 1;
          return newNode;
        } else if (node.id === target.id && connection.targetHandle) {
          const newNode = node;
          newNode.data = { ...node.data };
          newNode.data.isInputConnected[+connection.targetHandle] += 1;
          return newNode;
        } else {
          return node;
        }
      }));
    }

    return addEdge(connection, eds);
  }), [nodes, setNodes]);

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

  const handlePaneMove = useCallback(() => {
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
        const nodeType = nodeTypes[nodeTypeId];
        const nodeInstance: NodeInstance = {
          nodeTypeId,
          connections: {},
          attributes: {},
          isInputConnected: Array<number>(Object.entries(nodeType.inputs).length).fill(0),
          isOutputConnected: Array<number>(Object.entries(nodeType.outputs).length).fill(0),
        };
        // Populate node attributes
        Object.entries(nodeType.attributes)
          .forEach(([attributeId, { type }]) => {
            nodeInstance.attributes[attributeId] = attributeGenerator(type);
            nodeInstance.blockName = blockNameGenerator(nodeTypeId);
          });
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
        setNodes((nodes) => nodes.concat(newNode));
      }
      setUserDragging(false);
    },
    onDragStart() {
      setUserDragging(true);
      setShowContextMenu(false);
    },
  });

  return (
    <div ref={selfRef as React.RefObject<HTMLDivElement>} className="h-100">
      <Droppable id="flow-builder" className="h-100">
        <Card className="shadow-sm h-100">
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
            onMoveStart={handlePaneMove}
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
