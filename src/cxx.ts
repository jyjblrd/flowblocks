import load_cxx_module from '../cxx/pkg/cxx';
import { NodeInstance as Vertex } from './shared/interfaces/NodeInstance.interface';

export interface CxxBindings {
  greet(input: string): string;
  echo(vertices: Record<string, Vertex>): string;
  compile(vertices: Record<string, Vertex>): string;
}

export const cxx = await load_cxx_module<CxxBindings>();
