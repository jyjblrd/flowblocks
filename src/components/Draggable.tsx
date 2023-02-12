import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface DraggableProps {
  children: React.ReactNode
  id: string
  data: any
}

export default function Draggable({ children, id, data }: DraggableProps) {
  const {
    attributes, listeners, setNodeRef, transform, isDragging,
  } = useDraggable({
    id,
    data,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        zIndex: isDragging ? 100 : 'auto',
        position: 'relative',
        cursor: 'grab',
      }}
      {...listeners} // eslint-disable-line react/jsx-props-no-spreading
      {...attributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      {children}
    </div>
  );
}
