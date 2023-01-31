import load_cxx_module from '../cxx/pkg/cxx';

export interface CxxBindings {
  greet(input: string): string;
}

export const cxx = await load_cxx_module<CxxBindings>();
