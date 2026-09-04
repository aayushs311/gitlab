import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export function getFixturesPath(meta: ImportMeta): string {
  return relative(
    process.cwd(),
    join(dirname(fileURLToPath(meta.url)), '..', 'test_fixtures'),
  );
}
