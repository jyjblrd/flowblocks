export type Attribute = Record<string, string>;

export enum ConnectionType {
  Bool,
  Number,
}

export type NodeTypeData = {
  description: string,
  attributes: Array<Attribute>,
  inputs: Record<number, { name: String, type: ConnectionType }>,
  outputs: Record<number, { name: String, type: ConnectionType }>,
};