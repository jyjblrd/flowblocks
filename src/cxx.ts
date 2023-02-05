import load_cxx_module from '../cxx/pkg/cxx';
import { Vertex } from './vertex';

export interface CxxBindings {
  greet(input: string): string;
  echo(vertices: Record<string, Vertex>): string;
}

export const cxx = await load_cxx_module<CxxBindings>();
