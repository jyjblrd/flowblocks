import React, {
  FormEvent, useEffect, useState,
} from 'react';
import {
  Col, Dropdown, Form, InputGroup, Row,
} from 'react-bootstrap';
import { Node, useReactFlow } from 'reactflow';
import { NodeInstance } from '../shared/interfaces/NodeInstance.interface';
import { used } from '../shared/helpers/helperFunctions';

export default function ContextMenu(
  {
    show, position, clickedNode, hideMenu,
  }:
  {
    show: boolean,
    position: { x: number, y: number },
    clickedNode?: Node<NodeInstance>,
    hideMenu: any
  },
) {
  const reactFlowInstance = useReactFlow<NodeInstance>();

  const [attributes, setAttributes] = useState(clickedNode?.data.attributes ?? {});
  // Update state on prop change
  useEffect(() => {
    setAttributes(clickedNode?.data.attributes ?? {});
  }, [clickedNode]);

  const deleteItem = () => {
    if (clickedNode) {
      const oldPin: string = clickedNode.data.attributes['Pin number'];
      used.splice(used.indexOf(oldPin), 1);
      reactFlowInstance.deleteElements({ nodes: [clickedNode] });
      hideMenu();
    }
  };

  const handleInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const attributeId = target.name;

    setAttributes({
      ...attributes,
      [attributeId]: target.value,
    });

    reactFlowInstance.setNodes((nodes) =>

      nodes.map((node) => {
        const oldPin: string = node.data.attributes['Pin number'];

        if (clickedNode && node.id === clickedNode.id) {
          const newNode = node;
          newNode.data.attributes = {
            ...node.data.attributes,
            [attributeId]: target.value,
          };
          newNode.data = { ...newNode.data };
          // console.log(newNode.data);
          console.log(node.data.attributes['Pin number']);
          const newPin: string = newNode.data.attributes['Pin number'];
          used.push(newPin);
          used.splice(used.indexOf(oldPin), 1);
          return newNode;
        }

        return node;
      }));
  };

  const blockName = reactFlowInstance.getNode((clickedNode !== undefined) ? clickedNode.id : '')?.data.blockName ?? '';
  const blockAttributes = reactFlowInstance.getNode((clickedNode !== undefined) ? clickedNode.id : '')?.data.attributes;

  const handleBlockNameChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    reactFlowInstance.setNodes((nodes) =>
      nodes.map((node) => {
        if (clickedNode && node.id === clickedNode.id) {
          const newNode = node;
          newNode.data.blockName = target.value;
          newNode.data = { ...newNode.data };
          return newNode;
        }
        return node;
      }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Dropdown show={show} style={{ position: 'absolute', transform: `translate(${position.x}px, ${position.y}px)` }}>
      <Dropdown.Menu style={{ width: '300px' }}>
        {Object.keys(attributes).length !== 0 && (
          <>
            <Form className="px-3 pt-2 pb-1" onSubmit={handleSubmit}>
              <h6 style={{ paddingTop: '4px' }}>Attributes</h6>
              {
                (clickedNode?.data.blockName !== undefined || false) ? (
                  <InputGroup as={Row} className="g-0">
                    <Col xs={7}>
                      <Form.Label className="mt-1">Block name</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control size="sm" value={blockName} onChange={handleBlockNameChange} />
                    </Col>
                  </InputGroup>
                ) : (<div />)
              }
              {
                Object.entries(attributes).map(([attributeId]) => (
                  <InputGroup key={attributeId} as={Row} className="g-0">
                    <Col xs={7}>
                      <Form.Label className="mt-1">{attributeId}</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control size="sm" value={blockAttributes !== undefined ? blockAttributes[attributeId] : ''} name={attributeId} onChange={handleInputChange} />
                    </Col>
                  </InputGroup>
                ))
              }
            </Form>
            <Dropdown.Divider />
          </>
        )}
        <Dropdown.Item onClick={deleteItem}>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
