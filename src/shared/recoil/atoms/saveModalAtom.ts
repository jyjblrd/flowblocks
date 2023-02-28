import { atom } from 'recoil';

export const saveModalAtom = atom<{ isOpen: boolean, saveChart:(name: string) => void }>({
  key: 'saveModal',
  default: { isOpen: false, saveChart: () => { } },
});

export default saveModalAtom;
