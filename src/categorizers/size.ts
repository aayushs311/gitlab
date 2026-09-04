import { statSync } from 'node:fs';
import type { Categorizer } from './types.ts';
import type { SortableKey } from '../buckets.ts';
import { Buckets } from '../buckets.ts';

export class SizeCategorizer implements Categorizer {
  rebucket(buckets: Buckets<SortableKey>) {
    const sizeBuckets = new Buckets<number>();

    for (const file of buckets.allFiles()) {
      const { size } = statSync(file);
      sizeBuckets.add(size, [file]);
    }

    return sizeBuckets;
  }
}
