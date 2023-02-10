import load_cxx_module from '../cxx/pkg/cxx';
import { NodeInstance } from './shared/interfaces/NodeInstance.interface';

export interface CxxBindings {
  greet(input: string): string;
  echo(vertices: Record<string, NodeInstance>): string;
  compile(vertices: Record<string, NodeInstance>): string;
}

export const cxx = await load_cxx_module<CxxBindings>();
