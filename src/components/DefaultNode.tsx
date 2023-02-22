import React, { useCallback } from 'react';
import {
  Connection,
  getConnectedEdges,
  Handle, NodeProps, Position, useReactFlow,
} from 'reactflow';
import { useRecoilValue } from 'recoil';
import { typeToColour } from '../shared/helpers/helperFunctions';
import { NodeInstance } from '../shared/interfaces/NodeInstance.interface';
import { nodeTypesAtom } from '../shared/recoil/atoms/nodeTypesAtom';
import './DefaultNode.scss';

interface DummyNodeProps {
  data: NodeInstance;
}

function calcHandleTop(index: number, numHandles: number) {
  return `${(100 / (numHandles + 1)) * (index + 1)}%`;
}

const useConnectionValidator = () => {
  const { getNode, getEdges } = useReactFlow();

  return useCallback(
    (connection: Connection) => {
      if (!connection.target
        || !connection.targetHandle
        || !connection.source
        || connection.source === connection.target) return false;
      const target = getNode(connection.target);
      const edges = getConnectedEdges(target ? [target] : [], getEdges());
      return edges.every((edge) =>
        !(edge.target === connection.target
          && edge.targetHandle === connection.targetHandle));
    },
    [getNode, getEdges],
  );
};

export default function DefaultNode(
  {
    data,
    isDummyNode = false,
  }: (NodeProps<NodeInstance> | DummyNodeProps) & { isDummyNode?: boolean },
) {
  const nodeType = useRecoilValue(nodeTypesAtom)[data.nodeTypeId];
  const numInputs = Object.entries(nodeType.inputs).length;
  const numOutputs = Object.entries(nodeType.outputs).length;

  return (
    <>
      {
        Object.entries(nodeType.inputs).map(([key, { type }], index) => {
          if (isDummyNode) {
            return (
              <div
                key={key}
                className="react-flow__handle react-flow__handle-left"
                style={{
                  top: calcHandleTop(index, numInputs),
                  backgroundColor: typeToColour(type),
                }}
              />
            );
          } else {
            return (
              <Handle
                type="target"
                position={Position.Left}
                id={key}
                key={key}
                style={{
                  top: calcHandleTop(index, numInputs),
                  backgroundColor: typeToColour(type),
                }}
                isValidConnection={useConnectionValidator()}
              />
            );
          }
        })
      }
      <div
        className="node"
      >
        <h5 className="m-0">{data.nodeTypeId}</h5>
      </div>
      {
        Object.entries(nodeType.outputs).map(([key, { type }], index) => {
          if (isDummyNode) {
            return (
              <div
                key={key}
                className="react-flow__handle react-flow__handle-right"
                style={{
                  top: calcHandleTop(index, numOutputs),
                  backgroundColor: typeToColour(type),
                }}
              />
            );
          } else {
            return (
              <Handle
                type="source"
                position={Position.Right}
                id={key}
                key={key}
                style={{
                  top: calcHandleTop(index, numOutputs),
                  backgroundColor: typeToColour(type),
                }}
                // on={(params) => console.log('handle ondelete',params)}
                isValidConnection={useConnectionValidator()}
              />
            );
          }
        })
      }
    </>
  );
}
