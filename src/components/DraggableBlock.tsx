/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { BlockKind } from '../blocks';

export default function DraggableBlock({ label, kind }: { label: string, kind: BlockKind }) {
  const {
    attributes, listeners, setNodeRef, transform,
  } = useDraggable({
    id: label.toString(),
    data: { kind },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button type="button" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {label}
    </button>
  );
}
