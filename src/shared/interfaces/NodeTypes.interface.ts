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
  nodeTypeId?: string,
  description: string,
  attributes: Attributes,
  inputs: Record<number, { name: String, type: ConnectionType }>,
  outputs: Record<number, { name: String, type: ConnectionType }>,
};

export type NodeTypes = Record<string, NodeTypeData>;
