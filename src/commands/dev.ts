import { build } from './build';

export function dev(name: string, options?: any) {
  build(name, true);
}
