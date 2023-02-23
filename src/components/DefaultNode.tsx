import React, { useCallback } from 'react';
import {
  Connection,
  getConnectedEdges,
  Handle, NodeProps, Position, useReactFlow,
} from 'reactflow';
import { useRecoilValue } from 'recoil';
import { NodeInstance } from '../shared/interfaces/NodeInstance.interface';
import { ConnectionType } from '../shared/interfaces/NodeTypes.interface';
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
  const nodeType = useRecoilValue(nodeTypesAtom);
  return useCallback(
    (connection: Connection) => {
      if (!connection.target
        || !connection.targetHandle
        || !connection.source
        || connection.source === connection.target) return false;
      const target = getNode(connection.target);
      const edges = getConnectedEdges(target ? [target] : [], getEdges());
      const inputType=nodeType[getNode(connection.target)?.data.nodeTypeId]["inputs"][connection.targetHandle]["type"];
      const outputType=nodeType[getNode(connection.source)?.data.nodeTypeId]["inputs"][connection.sourceHandle]["type"];
      if (inputType!==outputType){return false;}
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

  const typeToColor: Record<ConnectionType, string> = {
    [ConnectionType.Bool]: 'var(--bs-blue)',
  };

  return (
    <>
      {
        Object.entries(nodeType.inputs).map(([key], index) => {
          if (isDummyNode) {
            return (
              <div
                key={key}
                className="react-flow__handle react-flow__handle-left"
                style={{ top: calcHandleTop(index, numInputs) }}
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
                  backgroundColor: data.isInputConnected[index] ? typeToColor[nodeType.inputs[index].type] : 'var(--bs-white)',
                  borderColor: typeToColor[nodeType.inputs[index].type],
                }}
                className={data.isInputConnected[index] ? 'connected' : ''}
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
        Object.entries(nodeType.outputs).map(([key], index) => {
          if (isDummyNode) {
            return (
              <div
                key={key}
                className="react-flow__handle react-flow__handle-right"
                style={{ top: calcHandleTop(index, numOutputs) }}
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
                  backgroundColor: data.isOutputConnected[index] ? typeToColor[nodeType.outputs[index].type] : 'var(--bs-white)',
                  borderColor: typeToColor[nodeType.outputs[index].type],
                }}
                className={data.isOutputConnected[index] ? 'connected' : ''}
                isValidConnection={useConnectionValidator()}
              />
            );
          }
        })
      }
    </>
  );
}
