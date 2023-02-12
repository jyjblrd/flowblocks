import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface DraggableProps {
  children: React.ReactNode
  id: string
  data: any
}

export default function Draggable({ children, id, data }: DraggableProps) {
  const {
    attributes, listeners, setNodeRef, transform,
  } = useDraggable({
    id,
    data,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}
