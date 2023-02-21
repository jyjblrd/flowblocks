import React, { useEffect, useState } from 'react';
import {
  Col, Dropdown, Form, InputGroup, Row,
} from 'react-bootstrap';
import { Node, useReactFlow } from 'reactflow';
import { NodeInstance } from '../shared/interfaces/NodeInstance.interface';

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
  const reactFlowInstance = useReactFlow();

  const [attributes, setAttributes] = useState(clickedNode?.data.attributes ?? {});
  // Update state on prop change
  useEffect(() => {
    setAttributes(clickedNode?.data.attributes ?? {});
  }, [clickedNode]);

  const deleteItem = () => {
    if (clickedNode) {
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
        if (clickedNode && node.id === clickedNode.id) {
          const newNode = node;
          newNode.data.attributes = {
            ...node.data.attributes,
            [attributeId]: target.value,
          };
          console.log(newNode.data);
          return newNode;
        }

        return node;
      }));
  };

  return (
    <Dropdown show={show} style={{ position: 'absolute', transform: `translate(${position.x}px, ${position.y}px)` }}>
      <Dropdown.Menu>
        {Object.keys(attributes).length !== 0 && (
          <>
            <Form className="px-3 pt-2 pb-1">
              <h6 style={{ paddingTop: '4px' }}>Attributes</h6>
              {Object.entries(attributes).map(([attributeId, value]) => (
                <InputGroup key={attributeId} as={Row} className="g-0">
                  <Col xs={8}>
                    <Form.Label className="mt-1">{attributeId}</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control size="sm" value={value} name={attributeId} onChange={handleInputChange} />
                  </Col>
                </InputGroup>
              ))}
            </Form>
            <Dropdown.Divider />
          </>
        )}
        <Dropdown.Item onClick={deleteItem}>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
