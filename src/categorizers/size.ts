import { stat } from 'node:fs/promises';
import type { Categorizer } from './types.ts';
import type { SortableKey } from '../buckets.ts';
import { Buckets } from '../buckets.ts';

export class SizeCategorizer implements Categorizer {
  async rebucket(buckets: Buckets<SortableKey>) {
    const sizeBuckets = new Buckets<number>();
    const files = Array.from(buckets.allFiles());
    const sizes = await Promise.all(files.map(async file => (await stat(file)).size));

    for (let index = 0; index < files.length; index++) {
      sizeBuckets.add(sizes[index]!, [files[index]!]);
    }

    return sizeBuckets;
  }
}
