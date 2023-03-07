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
  return (100 / (numHandles + 1)) * (index + 1);
}

const useConnectionValidator = () => {
  const { getNode, getEdges } = useReactFlow();

  const nodeType = useRecoilValue(nodeTypesAtom);
  return useCallback(
    (connection: Connection) => {
      // console.log(connection);
      /* console.log(!connection.target
        || !connection.targetHandle
        || !connection.source
        || connection.source === connection.target); */
      if (!connection.target
        || !connection.targetHandle
        || !connection.source
        || !connection.sourceHandle
        || connection.source === connection.target) return false;
      const target = getNode(connection.target);
      const edges = getConnectedEdges(target ? [target] : [], getEdges());
      const inputType = nodeType[getNode(connection.target)?.data.nodeTypeId]
        .inputs[parseInt(connection.targetHandle, 10)].type;
      const outputType = nodeType[getNode(connection.source)?.data.nodeTypeId]
        .outputs[parseInt(connection.sourceHandle, 10)].type;

      if (inputType !== outputType) { return false; }
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
    [ConnectionType.Number]: 'var(--bs-orange)',
  };

  return (
    <div
      className="node-wrapper"
      style={{
        height: `${Math.max(numInputs, numOutputs) * 30 + 40}px`, minHeight: '80px', padding: '10px 0 10px 0',
      }}
    >
      <div
        className="node text-center h-100 px-2"
      >
        <h5
          style={{
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {data.blockName !== undefined ? data.blockName : data.nodeTypeId}

        </h5>

      </div>
      {
        Object.entries(nodeType.inputs).map(([key, value], index) => {
          const res = [
            <span
              key={1}
              className="small handle-label left"
              style={{
                top: `calc(${calcHandleTop(index, numInputs)}% - 11px)`,
                borderColor: typeToColor[nodeType.inputs[index].type],
              }}
            >
              {value.name}
            </span>,
          ];

          if (isDummyNode) {
            res.push(
              <div
                key={2}
                className="react-flow__handle react-flow__handle-left"
                style={{
                  top: `${calcHandleTop(index, numInputs)}%`,
                  backgroundColor: 'var(--bs-white)',
                  borderColor: typeToColor[nodeType.inputs[index].type],
                }}
              />,
            );
          } else {
            res.push(
              <Handle
                key={3}
                type="target"
                position={Position.Left}
                id={key}
                style={{
                  top: `${calcHandleTop(index, numInputs)}%`,
                  backgroundColor: data.isInputConnected[index] ? typeToColor[nodeType.inputs[index].type] : 'var(--bs-white)',
                  borderColor: typeToColor[nodeType.inputs[index].type],
                }}
                className={data.isInputConnected[index] ? 'connected' : ''}
                isValidConnection={useConnectionValidator()}
              />,
            );
          }

          return <div key={key}>{res}</div>;
        })
      }
      {
        Object.entries(nodeType.outputs).map(([key, value], index) => {
          const res = [
            <span
              key={1}
              className="small handle-label right"
              style={{
                top: `calc(${calcHandleTop(index, numOutputs)}% - 11px)`,
                borderColor: typeToColor[nodeType.outputs[index].type],
              }}
            >
              {value.name}
            </span>,
          ];

          if (isDummyNode) {
            res.push(
              <div
                key={2}
                className="react-flow__handle react-flow__handle-right"
                style={{
                  top: `${calcHandleTop(index, numOutputs)}%`,
                  backgroundColor: 'var(--bs-white)',
                  borderColor: typeToColor[nodeType.outputs[index].type],
                }}
              />,
            );
          } else {
            res.push(
              <Handle
                key={3}
                type="source"
                position={Position.Right}
                id={key}
                style={{
                  top: `${calcHandleTop(index, numOutputs)}%`,
                  backgroundColor: data.isOutputConnected[index] ? typeToColor[nodeType.outputs[index].type] : 'var(--bs-white)',
                  borderColor: typeToColor[nodeType.outputs[index].type],
                }}
                className={data.isOutputConnected[index] ? 'connected' : ''}
                isValidConnection={useConnectionValidator()}
              />,
            );
          }

          return (
            <div key={key}>
              {res}
            </div>
          );
        })
      }
    </div>
  );
}
