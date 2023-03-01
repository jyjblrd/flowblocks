import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableProps {
  children: React.ReactNode
  id: string
  className: string
}

export default function Droppable({ children, id, className }: DroppableProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
}
