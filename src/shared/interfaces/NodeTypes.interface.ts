export enum AttributeTypes {
  // Warning: C++ code needs to be updated if these are altered
  DigitalIn,
  DigitalOut,
  AnalogIn,
  AnalogOut,
  Bool,
  Number,
  BlockName, // pls remove

}
export type Attributes = Record<string, { type: AttributeTypes }>;

export enum ConnectionType {
  // Warning: C++ code needs to be updated if these are altered
  Bool,
  Number,
}

export type NodeTypeData = {
  group?: NodeGroups,
  description: string,
  attributes: Attributes,
  inputs: Record<number, { name: string, type: ConnectionType }>,
  outputs: Record<number, { name: string, type: ConnectionType }>,
  code: { init: string, update: string, isQuery: boolean }
};

export type NodeTypes = Record<string, NodeTypeData>;

export enum NodeGroups {
  Input,
  Output,
  Logic,
  Numerical,
  Comparison,
  ControlFlow,
  Other,
}
