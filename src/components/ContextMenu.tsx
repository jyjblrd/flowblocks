import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Node, useReactFlow } from 'reactflow';

export default function ContextMenu(
  { show, position, node }: { show: boolean, position: { x: number, y:number }, node?: Node },
) {
  const reactFlowInstance = useReactFlow();

  const deleteItem = () => {
    if (node) {
      reactFlowInstance.deleteElements({ nodes: [node] });
    }
  };

  return (
    <Dropdown show={show} style={{ position: 'absolute', transform: `translate(${position.x}px, ${position.y}px)` }}>
      <Dropdown.Menu>
        <Dropdown.Item>View Attributes</Dropdown.Item>
        <Dropdown.Item onClick={deleteItem}>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
