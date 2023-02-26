import { atom } from 'recoil';

export const loadModalAtom = atom<{ isOpen: boolean, loadChart: (name: string) => void, knownNames: string}>({
  key: 'loadModal',
  default: { isOpen: false, loadChart: () => { }, knownNames: "" },
});

export default loadModalAtom;
