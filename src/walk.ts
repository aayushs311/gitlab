import type { FilePath } from './types.ts';
import { opendir } from 'node:fs/promises';
import { join } from 'node:path';

export async function* walk(directory: FilePath): AsyncGenerator<FilePath> {
  const entries = await opendir(directory);
  for await (const dirent of entries) {
    const path = join(directory, dirent.name);

    if (dirent.isFile()) {
      yield path;
    } else if (dirent.isDirectory()) {
      for await (const file of walk(path)) {
        yield file;
      }
    }
  }
}
