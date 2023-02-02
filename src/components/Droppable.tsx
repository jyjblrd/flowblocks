import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function Droppable({ label }: { label: string }) {
  const { setNodeRef } = useDroppable({
    id: label,
  });

  return (
    <div ref={setNodeRef} style={{ width: '100vw', height: '100vh', position: 'absolute' }} />
  );
}
