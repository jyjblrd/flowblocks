import React from 'react';
import { NodeId } from '../shared/interfaces/Node.interface';
import DraggableBlock from './DraggableBlock';

export default function Palette() {
  return (
    <div className="Palette">
      <DraggableBlock name="Button" nodeId={NodeId.Button} />
      <DraggableBlock name="And" nodeId={NodeId.Conjunction} />
      <DraggableBlock name="LED" nodeId={NodeId.LED} />
    </div>
  );
}
