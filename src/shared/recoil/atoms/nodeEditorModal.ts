import { atom } from 'recoil';

export const nodeEditorModalAtom = atom<{
  isOpen: boolean,
  nodeTypeId?: string
}>({
  key: 'nodeEditorModal',
  default: {
    isOpen: false,
    nodeTypeId: undefined,
  },
});

export default nodeEditorModalAtom;
