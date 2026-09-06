import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import type { Categorizer } from './types.ts';
import type { FilePath } from '../types.ts';
import type { SortableKey } from '../buckets.ts';
import { Buckets } from '../buckets.ts';

const DEFAULT_CONCURRENCY = 4;

type HashFile = (file: FilePath) => Promise<string>;

async function sha256(file: FilePath): Promise<string> {
  const hash = createHash('sha256');

  for await (const chunk of createReadStream(file)) {
    hash.update(chunk);
  }

  return hash.digest('hex');
}

export class DigestCategorizer implements Categorizer {
  private concurrency: number;
  private hashFile: HashFile;

  constructor(
    concurrency = DEFAULT_CONCURRENCY,
    hashFile: HashFile = sha256,
  ) {
    if (!Number.isInteger(concurrency) || concurrency < 1) {
      throw new RangeError('Digest concurrency must be a positive integer');
    }

    this.concurrency = concurrency;
    this.hashFile = hashFile;
  }

  async rebucket(buckets: Buckets<SortableKey>) {
    const digestBuckets = new Buckets<string>();
    const files = Array.from(buckets.allFiles());
    const digests = new Array<string>(files.length);
    let nextIndex = 0;

    const worker = async () => {
      while (nextIndex < files.length) {
        const index = nextIndex++;
        digests[index] = await this.hashFile(files[index]!);
      }
    };

    const workers = Array.from(
      { length: Math.min(this.concurrency, files.length) },
      worker,
    );
    await Promise.all(workers);

    for (let index = 0; index < files.length; index++) {
      digestBuckets.add(digests[index]!, [files[index]!]);
    }

    return digestBuckets;
  }
}
