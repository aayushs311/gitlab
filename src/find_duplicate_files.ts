import type { Categorizer } from './categorizers/index.ts';
import type { FilePath } from './types.ts';
import { Buckets, type SortableKey } from './buckets.ts';
import { walk } from './walk.ts';

export async function findDuplicateFiles(directory: FilePath, categorizers: Categorizer[]): Promise<Buckets<SortableKey>> {
  let buckets = new Buckets();
  const files: FilePath[] = [];

  for await (const file of walk(directory)) {
    files.push(file);
  }
  buckets.add('initial', files);

  for (const categorizer of categorizers) {
    buckets = (await categorizer.rebucket(buckets)).removeNonDuplicates();
  }

  return buckets;
}
