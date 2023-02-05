export enum BlockKind {
  Button,
  Conjunction,
  LED,
}

export type BlockKindData = {
  label: string,
  targets: Array<string>,
  sources: Array<string>,
};

export const blockKindData: Record<BlockKind, BlockKindData> = {
  [BlockKind.Button]: {
    label: 'Button',
    targets: [],
    sources: ['output'],
  },
  [BlockKind.Conjunction]: {
    label: 'And',
    targets: ['left', 'right'],
    sources: ['output'],
  },
  [BlockKind.LED]: {
    label: 'LED',
    targets: ['input'],
    sources: [],
  },
};
