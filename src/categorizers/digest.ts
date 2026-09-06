import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import type { Categorizer } from './types.ts';
import type { SortableKey } from '../buckets.ts';
import { Buckets } from '../buckets.ts';

export class DigestCategorizer implements Categorizer {
  async rebucket(buckets: Buckets<SortableKey>) {
    const digestBuckets = new Buckets<string>();
    const files = Array.from(buckets.allFiles());
    const digests = await Promise.all(files.map(async file => {
      const hash = createHash('sha256');

      for await (const chunk of createReadStream(file)) {
        hash.update(chunk);
      }

      return hash.digest('hex');
    }));

    for (let index = 0; index < files.length; index++) {
      digestBuckets.add(digests[index]!, [files[index]!]);
    }

    return digestBuckets;
  }
}
