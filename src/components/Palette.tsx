import React from 'react';
import { BlockKind } from '../blocks';
import DraggableBlock from './DraggableBlock';

export default function Palette() {
  return (
    <div className="Palette">
      <DraggableBlock label="Button" kind={BlockKind.Button} />
      <DraggableBlock label="And" kind={BlockKind.Conjunction} />
      <DraggableBlock label="LED" kind={BlockKind.LED} />
    </div>
  );
}
