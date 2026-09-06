import { open } from 'node:fs/promises';
import type { Categorizer } from './types.ts';
import type { FilePath } from '../types.ts';
import type { SortableKey } from '../buckets.ts';
import { Buckets } from '../buckets.ts';

function toHex(uint8: number): string {
  return uint8.toString(16).padStart(2, '0');
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(toHex).join('');
}

async function getFirstNBytes(n: number, file: FilePath): Promise<Uint8Array> {
  const handle = await open(file, 'r');
  const bytes = new Uint8Array(n);

  try {
    await handle.read(bytes, 0, n, 0);
  } finally {
    await handle.close();
  }

  return bytes;
}

export class FirstBytesCategorizer implements Categorizer {
  constructor(private numBytes: number) {}

  async rebucket(buckets: Buckets<SortableKey>) {
    const firstBytesBuckets = new Buckets<string>();
    const files = Array.from(buckets.allFiles());
    const firstBytes = await Promise.all(
      files.map(file => getFirstNBytes(this.numBytes, file)),
    );

    for (let index = 0; index < files.length; index++) {
      firstBytesBuckets.add(bytesToHex(firstBytes[index]!), [files[index]!]);
    }

    return firstBytesBuckets;
  }
}
