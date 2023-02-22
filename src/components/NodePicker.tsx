import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { NodeInstance } from '../shared/interfaces/NodeInstance.interface';
import { NodeTypeData } from '../shared/interfaces/NodeTypes.interface';
import { nodeTypesAtom } from '../shared/recoil/atoms/nodeTypesAtom';
import DefaultNode from './DefaultNode';
import Draggable from './Draggable';

function genDummyNodeInstance(nodeTypeId: string, nodeType: NodeTypeData): NodeInstance {
  return {
    nodeTypeId,
    connections: {},
    attributes: {},
    isInputConnected: Array<number>(Object.entries(nodeType.inputs).length).fill(0),
    isOutputConnected: Array<number>(Object.entries(nodeType.outputs).length).fill(0),
  };
}

export default function NodePicker() {
  const nodeTypes = useRecoilValue(nodeTypesAtom);

  return (
    <Card className="h-100 shadow-sm py-2 px-3">
      {
        Object.entries(nodeTypes).map(([nodeTypeId, nodeType]) => (
          <Row key={nodeTypeId} className="py-3 border-bottom">
            <Col className="pt-1">
              <h5>{nodeTypeId}</h5>
              <h6 className="small">{nodeType.description}</h6>
            </Col>
            <Col xs={12} lg={5}>
              <div className="mx-auto" style={{ position: 'relative', width: 'fit-content' }}>
                <Draggable id={nodeTypeId} data={{ nodeTypeId }}>
                  <DefaultNode
                    isDummyNode
                    data={genDummyNodeInstance(nodeTypeId, nodeType)}
                  />
                </Draggable>
              </div>
            </Col>
          </Row>
        ))
      }
    </Card>
  );
}
