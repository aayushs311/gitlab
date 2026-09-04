import assert from 'node:assert';
import { test, describe } from 'node:test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import type { FilePath } from '../types.ts';
import { Buckets } from '../buckets.ts';
import { join, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { DigestCategorizer } from './digest.ts';

function makeFiles(
  directory: FilePath,
  tempFiles: { [name: FilePath]: string },
) {
  const filepaths: FilePath[] = [];

  for (const [name, content] of Object.entries(tempFiles)) {
    const filepath = join(directory, name);
    filepaths.push(filepath);
    writeFileSync(filepath, content);
  }

  const buckets = new Buckets();
  buckets.add('initial', filepaths);

  return buckets;
}

describe('DigestCategorizer', () => {
  test('hashes files correctly', () => {
    const directory = mkdtempSync(`${tmpdir()}${sep}`);
    const categorizer = new DigestCategorizer();

    assert.deepStrictEqual(Array.from(categorizer.rebucket(makeFiles(directory, {
      empty: '',
      another_empty: '',
      a: 'a',
      another_a: 'a',
      b: 'b',
    }))), [
      ['e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        [join(directory, 'empty'), join(directory, 'another_empty')]],
      ['ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
        [join(directory, 'a'), join(directory, 'another_a')]],
      ['3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
        [join(directory, 'b')]],
    ]);
  });
});
