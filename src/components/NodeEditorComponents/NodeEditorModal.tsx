import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  useEffect, useState,
} from 'react';
import {
  Button,
  Col, Form, Modal, Row,
} from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import { AttributeTypes, ConnectionType, NodeTypeData } from '../../shared/interfaces/NodeTypes.interface';
import { nodeEditorModalAtom } from '../../shared/recoil/atoms/nodeEditorModal';
import { nodeTypesAtom } from '../../shared/recoil/atoms/nodeTypesAtom';
import AttributeListItem from './AttributeListItem';
import IOListItem from './IOListItem';
import './NodeEditorModal.scss';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';

export default function NodeEditorModal() {
  const [nodeEditorModal, setNodeEditorModal] = useRecoilState(nodeEditorModalAtom);

  const { nodeTypeId } = nodeEditorModal;
  const [nodeTypes, setNodeTypes] = useRecoilState(nodeTypesAtom);
  const [nodeType, setNodeType] = useState<NodeTypeData>({
    description: '',
    attributes: {},
    inputs: {},
    outputs: {},
    code: { init: '', update: '', isQuery: false },
  });
  const defaultNodeName = 'New Node';
  const [newNodeTypeId, setNewNodeTypeId] = useState(nodeTypeId ?? defaultNodeName);

  // Update state on nodeEditorModalAtom change
  useEffect(() => {
    setNodeType(nodeTypeId !== undefined
      ? structuredClone(nodeTypes[nodeTypeId])
      : {
        description: '',
        attributes: {},
        inputs: {},
        outputs: {},
        code: { init: '', update: '', isQuery: false },
      });
    setNewNodeTypeId(nodeTypeId ?? defaultNodeName);
  }, [nodeEditorModal]);

  const handleClose = () => setNodeEditorModal((prev) => ({ ...prev, isOpen: false }));

  const saveNode = () => {
    const newNodeTypes = { ...nodeTypes };

    if (nodeTypeId !== undefined && newNodeTypeId !== nodeTypeId) {
      delete newNodeTypes[nodeTypeId];
    }

    newNodeTypes[newNodeTypeId] = nodeType;

    setNodeTypes(newNodeTypes);
  };

  const addAttribute = () => {
    const newNodeType = {
      ...nodeType,
    };

    newNodeType.attributes[''] = { type: AttributeTypes.digitalIn };
    setNodeType(newNodeType);
  };

  const addInput = () => {
    const newNodeType = {
      ...nodeType,
    };

    const nextInputId = Object.keys(nodeType.inputs).length === 0
      ? 0
      : Math.max(
        ...Object.keys(nodeType.inputs).map((x) => parseInt(x, 10)),
      ) + 1;
    newNodeType.inputs[nextInputId] = { name: '', type: ConnectionType.Bool };

    setNodeType(newNodeType);
  };

  const addOutput = () => {
    const newNodeType = {
      ...nodeType,
    };

    const nextInputId = Object.keys(nodeType.outputs).length === 0
      ? 0
      : Math.max(
        ...Object.keys(nodeType.outputs).map((x) => parseInt(x, 10)),
      ) + 1;
    newNodeType.outputs[nextInputId] = { name: '', type: ConnectionType.Bool };

    setNodeType(newNodeType);
  };

  const handleChange = (event: any) => {
    const target = event.target as HTMLInputElement;
    const newNodeType = { ...nodeType };

    switch (target.name) {
      case 'nodeTypeId':
        setNewNodeTypeId(target.value);
        break;
      case 'description':
        newNodeType.description = target.value;
        break;
      case 'initCode':
        newNodeType.code.init = target.value;
        break;
      case 'updateCode':
        newNodeType.code.update = target.value;
        break;
      default:
        break;
    }
    setNodeType(newNodeType);
  };

  return (
    <Modal
      animation={false}
      show={nodeEditorModal.isOpen}
      onHide={handleClose}
      dialogClassName="code-modal"
    >
      <Modal.Header closeButton>
        <h4 className="m-0 pt-1" style={{ height: '30px' }}>{newNodeTypeId}</h4>
      </Modal.Header>

      <Modal.Body>
        <Row className="h-100 px-2 py-1">
          <Col xs={12} md={6} lg={5} xl={4} xxl={3} className="d-flex h-100 flex-column me-4">

            <Row>
              <Col xs={12}>
                <h5>Name</h5>
                <Form.Control name="nodeTypeId" onChange={handleChange} value={newNodeTypeId} />
              </Col>
            </Row>

            <Row className="pt-4">
              <Col xs={12}>
                <h5>Description</h5>
                <Form.Control name="description" onChange={handleChange} as="textarea" rows={3} value={nodeType.description} />
              </Col>
            </Row>

            <Row className="pt-4 flex-grow-1">
              <Col xs={12}>
                <h5>Attributes</h5>
                {
                  Object.entries(nodeType.attributes).map(([name, value]) => (
                    <AttributeListItem
                      key={name}
                      name={name}
                      type={value.type}
                    />
                  ))
                }
                <Row
                  className="gx-2"
                  style={{ cursor: 'pointer' }}
                  onClick={addAttribute}
                >
                  <Col sm="auto">
                    <FontAwesomeIcon
                      icon="plus"
                      className="text-secondary ps-2 my-auto"
                    />
                  </Col>
                  <Col>
                    <h6 className="text-secondary" style={{ paddingTop: '2.5px' }}>Add Attribute</h6>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className="pt-2 flex-grow-1">
              <Col xs={12}>
                <h5>Inputs</h5>
                {
                  Object.entries(nodeType.inputs).map(([inputId, { name, type }]) => (
                    <IOListItem
                      isInput
                      key={inputId}
                      name={name}
                      type={type}
                    />
                  ))
                }
                <Row
                  className="gx-2"
                  style={{ cursor: 'pointer' }}
                  onClick={addInput}
                >
                  <Col sm="auto">
                    <FontAwesomeIcon
                      icon="plus"
                      className="text-secondary ps-2 my-auto"
                    />
                  </Col>
                  <Col>
                    <h6 className="text-secondary" style={{ paddingTop: '2.5px' }}>Add Input</h6>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className="pt-2 flex-grow-1">
              <Col xs={12}>
                <h5>Ouputs</h5>
                {
                  Object.entries(nodeType.outputs).map(([ouputId, { name, type }]) => (
                    <IOListItem
                      key={ouputId}
                      name={name}
                      type={type}
                    />
                  ))
                }
                <Row
                  className="gx-2"
                  style={{ cursor: 'pointer' }}
                  onClick={addOutput}
                >
                  <Col sm="auto">
                    <FontAwesomeIcon
                      icon="plus"
                      className="text-secondary ps-2 my-auto"
                    />
                  </Col>
                  <Col>
                    <h6 className="text-secondary" style={{ paddingTop: '2.5px' }}>Add Output</h6>
                  </Col>
                </Row>
              </Col>
            </Row>

          </Col>

          <Col className="d-flex h-100 flex-column">

            <Row>
              <Col xs={12}>
                <h5>Init Code</h5>
                <Editor
                  value={nodeType.code.init}
                  onValueChange={(code) => { handleChange({ target: { name: 'initCode', value: code } }); }}
                  highlight={(code) => Prism.highlight(code, Prism.languages.python)}
                  padding={10}
                  insertSpaces={false}
                  className="code-editor"
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 16,
                    minHeight: '120px',
                  }}
                />
              </Col>
            </Row>

            <Row className="h-100 pt-4">
              <Col xs={12} className="d-flex flex-column">
                <h5>Code</h5>
                <Editor
                  value={nodeType.code.update}
                  onValueChange={(code) => { handleChange({ target: { name: 'updateCode', value: code } }); }}
                  highlight={(code) => Prism.highlight(code, Prism.languages.python)}
                  padding={10}
                  insertSpaces={false}
                  className="code-editor flex-grow-1"
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 16,
                  }}
                />
              </Col>
            </Row>

          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary">Cancel</Button>
        <Button variant="outline-primary" onClick={saveNode}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
