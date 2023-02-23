import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { NodeInstance } from '../shared/interfaces/NodeInstance.interface';
import { NodeTypeData } from '../shared/interfaces/NodeTypes.interface';
import { nodeEditorModalAtom } from '../shared/recoil/atoms/nodeEditorModal';
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
  const setNodeEditorModal = useSetRecoilState(nodeEditorModalAtom);

  const createNewNode = () => {
    setNodeEditorModal({
      isOpen: true,
      nodeTypeId: undefined,
    });
  };

  const editNode = (nodeTypeId: string) => {
    setNodeEditorModal({
      isOpen: true,
      nodeTypeId,
    });
  };

  return (
    <Card className="h-100 shadow-sm py-2 px-3">
      {
        Object.entries(nodeTypes).map(([nodeTypeId, nodeType]) => (
          <Row key={nodeTypeId} className="py-3 border-bottom gx-0">
            <Col className="py-3">
              <h5>{nodeTypeId}</h5>
              <h6 className="small">{nodeType.description}</h6>
            </Col>
            <Col xs={12} lg={5} className="my-auto mx-2">
              <div className="mx-auto" style={{ position: 'relative', width: 'fit-content' }}>
                <Draggable id={nodeTypeId} data={{ nodeTypeId }}>
                  <DefaultNode
                    isDummyNode
                    data={genDummyNodeInstance(nodeTypeId, nodeType)}
                  />
                </Draggable>
              </div>
            </Col>
            <Col sm="auto">
              <FontAwesomeIcon
                icon="sliders"
                size="sm"
                style={{ cursor: 'pointer' }}
                onClick={() => { editNode(nodeTypeId); }}
              />
            </Col>
          </Row>
        ))
      }
      <Row
        className="pt-4"
        style={{ cursor: 'pointer' }}
        onClick={createNewNode}
      >
        <Col sm="auto">
          <FontAwesomeIcon
            icon="plus"
            size="xl"
            className="text-secondary ps-2"
          />
        </Col>
        <Col>
          <h5 className="text-secondary">Create New Node</h5>
        </Col>
      </Row>
    </Card>
  );
}
