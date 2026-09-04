import type { FilePath } from './types.ts';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

export function* walk(directory: FilePath): Generator<FilePath> {
  for (const dirent of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, dirent.name);

    if (dirent.isFile()) {
      yield path;
    } else if (dirent.isDirectory()) {
      yield* walk(path);
    }
  }
}
