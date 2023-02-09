/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { NodeId } from '../shared/interfaces/Node.interface';

export default function DraggableBlock({ name, nodeId }: { name: string, nodeId: NodeId }) {
  const {
    attributes, listeners, setNodeRef, transform,
  } = useDraggable({
    id: name.toString(),
    data: { nodeId },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button type="button" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {name}
    </button>
  );
}
