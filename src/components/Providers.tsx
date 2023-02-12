import { DndContext } from '@dnd-kit/core';
import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { RecoilRoot } from 'recoil';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <ReactFlowProvider>
        <DndContext>
          {children}
        </DndContext>
      </ReactFlowProvider>
    </RecoilRoot>
  );
}
