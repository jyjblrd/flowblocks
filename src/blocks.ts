export enum BlockKind {
  Button,
  Conjunction,
  LED,
}

export type BlockKindData = {
  label: string,
  sources: Array<string>,
  targets: Array<string>,
};

export const blockKindData: Record<BlockKind, BlockKindData> = {
  [BlockKind.Button]: {
    label: 'Button',
    sources: [],
    targets: ['output'],
  },
  [BlockKind.Conjunction]: {
    label: 'And',
    sources: ['left', 'right'],
    targets: ['output'],
  },
  [BlockKind.LED]: {
    label: 'LED',
    sources: ['input'],
    targets: [],
  },
};
