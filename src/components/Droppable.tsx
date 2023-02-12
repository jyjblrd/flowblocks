import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableProps {
  children: React.ReactNode
  id: string
}

export default function Droppable({ children, id }: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
