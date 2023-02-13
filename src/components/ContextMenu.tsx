import React from 'react';
import { Dropdown } from 'react-bootstrap';

export default function ContextMenu(
  { show, position }: { show: boolean, position: { x: number, y:number } },
) {
  return (
    <Dropdown show={show} style={{ position: 'absolute', transform: `translate(${position.x}px, ${position.y}px)` }}>
      <Dropdown.Menu>
        <Dropdown.Item>View Attributes</Dropdown.Item>
        <Dropdown.Item>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
