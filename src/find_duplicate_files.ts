import type { Categorizer } from './categorizers/index.ts';
import type { FilePath } from './types.ts';
import { Buckets } from './buckets.ts';
import { walk } from './walk.ts';

export function findDuplicateFiles(directory: FilePath, categorizers: Categorizer[]) {
  let buckets = new Buckets();

  buckets.add('initial', walk(directory));

  for (const categorizer of categorizers) {
    buckets = categorizer.rebucket(buckets).removeNonDuplicates();
  }

  return buckets;
}
