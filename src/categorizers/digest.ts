import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import type { Categorizer } from './types.ts';
import type { SortableKey } from '../buckets.ts';
import { Buckets } from '../buckets.ts';

export class DigestCategorizer implements Categorizer {
  rebucket(buckets: Buckets<SortableKey>) {
    const digestBuckets = new Buckets<string>();

    for (const file of buckets.allFiles()) {
      const hash = createHash('sha256');
      hash.update(readFileSync(file));
      digestBuckets.add(hash.digest('hex'), [file]);
    }

    return digestBuckets;
  }
}
