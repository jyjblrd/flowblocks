import { atom } from 'recoil';

export const codeModalAtom = atom<{ isOpen: boolean, code: string }>({
  key: 'codeModal',
  default: { isOpen: false, code: '' },
});

export default codeModalAtom;
