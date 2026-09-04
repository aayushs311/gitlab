import { openSync, closeSync, readSync } from 'node:fs';
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

function getFirstNBytes(n: number, file: FilePath): Uint8Array {
  let fd;
  const bytes = new Uint8Array(n);

  try {
    fd = openSync(file, 'r');
    readSync(fd, bytes, 0, n, null);
  } finally {
    if (fd !== undefined) {
      closeSync(fd);
    }
  }

  return bytes;
}

export class FirstBytesCategorizer implements Categorizer {
  constructor(private numBytes: number) {}

  rebucket(buckets: Buckets<SortableKey>) {
    const firstBytesBuckets = new Buckets<string>();

    for (const file of buckets.allFiles()) {
      const hex = bytesToHex(getFirstNBytes(this.numBytes, file));
      firstBytesBuckets.add(hex, [file]);
    }

    return firstBytesBuckets;
  }
}
