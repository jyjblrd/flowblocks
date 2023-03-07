import load_cxx_module from '../cxx/pkg/cxx';
import { NodeInstance } from './shared/interfaces/NodeInstance.interface';
import { NodeTypeData } from './shared/interfaces/NodeTypes.interface';

export interface CompileResult {
  ok(): boolean;
  code(): string;
  error(): string;
  delete(): void;
}

export interface CxxBindings {
  greet(input: string): string;
  echo(vertices: Record<string, NodeInstance>): string;
  compile(
    nodeInstances: Record<string, NodeInstance>,
    nodeTypes: Record<string, NodeTypeData>
  ): CompileResult;
}

export const cxx = load_cxx_module<CxxBindings>();
