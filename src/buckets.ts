import type { FilePath } from './types.ts';
export type SortableKey = string | number;

export class Buckets<T extends SortableKey> {
  private buckets = new Map<T, FilePath[]>;

  add(key: T, files: Iterable<FilePath>) {
    const bucket = this.buckets.get(key);

    if (bucket) {
      bucket.push(...files);
    } else {
      this.buckets.set(key, Array.from(files));
    }
  }

  removeNonDuplicates(): this {
    for (const [name, files] of this.buckets) {
      if (files.length <= 1) {
        this.buckets.delete(name);
      }
    }

    return this;
  }

  get size() {
    return this.buckets.size;
  }

  *allFiles(): Iterable<FilePath> {
    for (const files of this.buckets.values()) {
      yield* files;
    }
  }

  [Symbol.iterator]() {
    return this.buckets.entries();
  }

  sorted(): FilePath[][] {
    const sorted: FilePath[][] = [];
    const sortedKeys = Array.from(this.buckets.keys()).sort();

    for (const key of sortedKeys) {
      const files = this.buckets.get(key)!;
      sorted.push(files.sort());
    }

    return sorted;
  }

  toString(): string {
    return this.sorted()
      .map(files => files.join('\n'))
      .join('\n\n');
  }
}
