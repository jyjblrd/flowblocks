import { DndContext } from '@dnd-kit/core';
import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { RecoilRoot } from 'recoil';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RecoilRoot>
        <ReactFlowProvider>
          <DndContext>
            {children}
          </DndContext>
        </ReactFlowProvider>
      </RecoilRoot>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
        crossOrigin="anonymous"
      />
    </>
  );
}
