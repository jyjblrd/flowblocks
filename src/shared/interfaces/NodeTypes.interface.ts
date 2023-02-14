export enum AttributeTypes {
  PinInNum,
  PinOutNum,
}
export type Attributes = Record<string, { type: AttributeTypes }>;

export enum ConnectionType {
  Bool,
  Number,
}

export type NodeTypeData = {
  description: string,
  attributes: Attributes,
  inputs: Record<number, { name: String, type: ConnectionType }>,
  outputs: Record<number, { name: String, type: ConnectionType }>,
  code: { init: string, update:string, isQuery: boolean }
};

export type NodeTypes = Record<string, NodeTypeData>;
