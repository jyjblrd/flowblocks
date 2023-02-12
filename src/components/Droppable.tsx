import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableProps {
  children: React.ReactNode
  id: string
}

export default function Droppable({ children, id }: DroppableProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  );
}
