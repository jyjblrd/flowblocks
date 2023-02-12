import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { nodeTypesAtom } from '../shared/recoil/atoms/nodeTypesAtom';
import DefaultNode from './DefaultNode';
import Draggable from './Draggable';

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
            <Col xs={5}>
              <div className="mx-auto" style={{ position: 'relative', width: 'fit-content' }}>
                <Draggable id={nodeTypeId} data={{ nodeTypeId }}>
                  <DefaultNode
                    isDummyNode
                    data={{ ...nodeType, nodeTypeId }}
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
