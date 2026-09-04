import { SizeCategorizer } from './size.ts';
import { FirstBytesCategorizer } from './first_bytes.ts';
import { DigestCategorizer } from './digest.ts';

export type { Categorizer } from './types.ts';
export default [
  new SizeCategorizer(),
  new FirstBytesCategorizer(16),
  new DigestCategorizer(),
];
