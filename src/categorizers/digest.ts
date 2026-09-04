import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import type { Categorizer } from './types.ts';
import type { FilePath } from '../types.ts';
import type { SortableKey } from '../buckets.ts';
import { Buckets } from '../buckets.ts';

function hashFile(file: FilePath): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    const stream = createReadStream(file);

    stream.on('data', chunk => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

export class DigestCategorizer implements Categorizer {
  async rebucket(buckets: Buckets<SortableKey>) {
    const digestBuckets = new Buckets<string>();

    for (const file of buckets.allFiles()) {
      digestBuckets.add(await hashFile(file), [file]);
    }

    return digestBuckets;
  }
}
