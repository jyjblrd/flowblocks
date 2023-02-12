import React from 'react';
import { useRecoilValue } from 'recoil';
import { nodeTypesAtom } from '../shared/recoil/atoms/nodeTypesAtom';
import DefaultNode from './DefaultNode';
import Draggable from './Draggable';

export default function NodePicker() {
  const nodeTypes = useRecoilValue(nodeTypesAtom);

  return (
    <div>
      {
        Object.entries(nodeTypes).map(([nodeTypeId, nodeType]) => (
          <div key={nodeTypeId} style={{ position: 'relative', width: 'fit-content' }}>
            <Draggable id={nodeTypeId} data={{ nodeTypeId }}>
              <DefaultNode
                isDummyNode
                data={{ ...nodeType, nodeTypeId }}
              />
            </Draggable>
          </div>
        ))
      }
    </div>
  );
}
