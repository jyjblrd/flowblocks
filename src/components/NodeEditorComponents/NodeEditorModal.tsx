import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  useEffect, useState,
} from 'react';
import {
  Button,
  Card,
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
  const [activeAttribute, setActiveAttribute] = useState<string | undefined>(undefined);

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
    setActiveAttribute(undefined);
  }, [nodeEditorModal]);

  const handleClose = () => setNodeEditorModal((prev) => ({ ...prev, isOpen: false }));

  const saveNode = () => {
    const newNodeTypes = { ...nodeTypes };
    if (nodeTypeId !== undefined && newNodeTypeId !== nodeTypeId) {
      delete newNodeTypes[nodeTypeId];
    }
    let nameRequired = false;
    let nameExists = false;
    const { attributes } = nodeType;
    // check if a name is needed. It is only needed if it is a circuit omponent and no name exists
    for (const attribute in attributes) {
      const { type } = attributes[attribute];
      if (type == 6) { nameExists = true; }
      if (type == 0 || type == 1 || type == 2 || type == 3) { nameRequired = true; }
    }
    // add name
    if (nameRequired && !nameExists) {
      nodeType.attributes.name = { type: 6 };
    }
    // nodeType
    newNodeTypes[newNodeTypeId] = nodeType;

    setNodeTypes(newNodeTypes);

    handleClose();
  };

  const addAttribute = () => {
    const newNodeType = {
      ...nodeType,
    };

    newNodeType.attributes[''] = { type: AttributeTypes.DigitalIn };
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

    if (nextInputId !== 0 && newNodeType.outputs[nextInputId - 1].name === '') return;

    newNodeType.outputs[nextInputId] = { name: '', type: ConnectionType.Bool };

    setNodeType(newNodeType);
  };

  const deleteAttribute = (name: string) => {
    const newNodeType = {
      ...nodeType,
    };

    delete newNodeType.attributes[name];
    setNodeType(newNodeType);
  };

  const deleteInput = (id: string) => {
    const newNodeType = {
      ...nodeType,
    };

    delete newNodeType.inputs[parseInt(id, 10)];
    setNodeType(newNodeType);
  };

  const deleteOutput = (id: string) => {
    const newNodeType = {
      ...nodeType,
    };

    delete newNodeType.outputs[parseInt(id, 10)];
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
      case 'attributeName': {
        const newKey = target.value;
        const oldKey = target.dataset.attributeName!;
        delete Object
          .assign(newNodeType.attributes, { [newKey]: newNodeType.attributes[oldKey] })[oldKey];
        setActiveAttribute(newKey);
        break;
      }
      case 'attributeType':
        newNodeType.attributes[target.dataset.attributeName!].type = AttributeTypes[target.value];
        break;
      case 'ioName': {
        if (target.dataset.ioIsInput === 'true') {
          newNodeType.inputs[target.dataset.ioId].name = target.value;
        } else {
          newNodeType.outputs[target.dataset.ioId].name = target.value;
        }
        break;
      }
      case 'ioType':
        if (target.dataset.ioIsInput === 'true') {
          newNodeType.inputs[target.dataset.ioId].type = ConnectionType[target.value];
        } else {
          newNodeType.outputs[target.dataset.ioId].type = ConnectionType[target.value];
        }
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
        <Row className="px-2 py-1 gx-1 h-100">
          <Col xs={12} md={5} lg={5} xl={4} xxl={3} className="me-4">

            <Row>
              <Col xs={12}>
                <Card className="shadow p-3">
                  <h5>Name & Description</h5>
                  <Form.Control name="nodeTypeId" onChange={handleChange} value={newNodeTypeId} placeholder="Name" />
                  <Form.Control name="description" className="mt-2" size="sm" onChange={handleChange} as="textarea" rows={2} value={nodeType.description} placeholder="Description" />
                </Card>
              </Col>
            </Row>

            <Row className="pt-3">
              <Col xs={12}>
                <Card className="shadow p-3 pe-1">
                  <h5>Attributes</h5>
                  <div style={{ overflowY: 'scroll', overflowX: 'hidden', minHeight: '120px' }}>
                    {
                        Object.entries(nodeType.attributes).map(([name, value]) => (
                          <AttributeListItem
                            key={name}
                            name={name}
                            type={value.type}
                            deleteItem={deleteAttribute}
                            onChange={handleChange}
                            isActive={name === activeAttribute} // super hacky im so sorry
                          />
                        ))
                      }
                    <Row
                      className="gx-2"
                      style={{ cursor: 'pointer' }}
                      onClick={addAttribute}
                    >
                      <Col xs="auto">
                        <FontAwesomeIcon
                          icon="plus"
                          className="text-secondary ps-2 my-auto"
                          size="sm"
                        />
                      </Col>
                      <Col>
                        <h6 className="text-secondary small" style={{ paddingTop: '3.5px' }}>Add Attribute</h6>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row className="pt-3">
              <Col xs={12}>
                <Card className="shadow p-3 pe-1">
                  <h5>Inputs</h5>
                  <div style={{ overflowY: 'scroll', overflowX: 'hidden', minHeight: '120px' }}>
                    {
                        Object.entries(nodeType.inputs).map(([inputId, { name, type }]) => (
                          <IOListItem
                            isInput
                            key={inputId}
                            name={name}
                            type={type}
                            id={inputId}
                            deleteItem={deleteInput}
                            onChange={handleChange}
                          />
                        ))
                      }
                    <Row
                      className="gx-2"
                      style={{ cursor: 'pointer' }}
                      onClick={addInput}
                    >
                      <Col xs="auto">
                        <FontAwesomeIcon
                          icon="plus"
                          className="text-secondary ps-2 my-auto"
                          size="sm"
                        />
                      </Col>
                      <Col>
                        <h6 className="text-secondary small" style={{ paddingTop: '3.5px' }}>Add Input</h6>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row className="pt-3">
              <Col xs={12}>
                <Card className="shadow p-3 pe-1">
                  <h5>Ouputs</h5>
                  <div style={{ overflowY: 'scroll', overflowX: 'hidden', minHeight: '120px' }}>
                    {
                        Object.entries(nodeType.outputs).map(([ouputId, { name, type }]) => (
                          <IOListItem
                            key={ouputId}
                            name={name}
                            type={type}
                            id={ouputId}
                            deleteItem={deleteOutput}
                            onChange={handleChange}
                          />
                        ))
                      }
                    <Row
                      className="gx-2"
                      style={{ cursor: 'pointer' }}
                      onClick={addOutput}
                    >
                      <Col xs="auto">
                        <FontAwesomeIcon
                          icon="plus"
                          className="text-secondary ps-2 my-auto"
                          size="sm"
                        />
                      </Col>
                      <Col>
                        <h6 className="text-secondary small" style={{ paddingTop: '3.5px' }}>Add Output</h6>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            </Row>

          </Col>

          <Col className="d-flex flex-column pt-3 pt-md-0">

            <Row>
              <Col xs={12}>
                <Card className="shadow p-3">
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
                </Card>
              </Col>
            </Row>

            <Row className="h-100 pt-4">
              <Col xs={12} className="d-flex flex-column">
                <Card className="shadow p-3 flex-grow-1">
                  <h5>Code</h5>
                  <Editor
                    value={nodeType.code.update}
                    onValueChange={(code) => { handleChange({ target: { name: 'updateCode', value: code } }); }}
                    highlight={(code) => Prism.highlight(code, Prism.languages.python)}
                    padding={10}
                    insertSpaces={false}
                    className="code-editor h-100"
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 16,
                    }}
                  />
                </Card>
              </Col>
            </Row>

          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="outline-primary" onClick={saveNode}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
