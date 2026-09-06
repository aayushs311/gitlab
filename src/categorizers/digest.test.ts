import assert from 'node:assert';
import { test, describe } from 'node:test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import type { FilePath } from '../types.ts';
import { Buckets } from '../buckets.ts';
import { join, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { DigestCategorizer } from './digest.ts';

function deferred(): {
  promise: Promise<void>;
  resolve: () => void;
} {
  let resolve!: () => void;
  const promise = new Promise<void>(done => {
    resolve = done;
  });

  return { promise, resolve };
}

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
  test('hashes files correctly', async () => {
    const directory = mkdtempSync(`${tmpdir()}${sep}`);
    const categorizer = new DigestCategorizer();

    assert.deepStrictEqual(Array.from(await categorizer.rebucket(makeFiles(directory, {
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

  test('limits concurrent hashes and preserves input order', async () => {
    const buckets = new Buckets<string>();
    const files = ['first', 'second', 'third', 'fourth', 'fifth'];
    buckets.add('initial', files);

    const gates = files.map(() => deferred());
    const started: string[] = [];
    let active = 0;
    let maxActive = 0;
    const categorizer = new DigestCategorizer(2, async file => {
      const index = files.indexOf(file);
      started.push(file);
      active++;
      maxActive = Math.max(maxActive, active);
      await gates[index]!.promise;
      active--;
      return index % 2 === 0 ? 'even' : 'odd';
    });

    const resultPromise = categorizer.rebucket(buckets);
    await new Promise<void>(resolve => setImmediate(resolve));
    assert.deepStrictEqual(started, ['first', 'second']);

    gates[1]!.resolve();
    await new Promise<void>(resolve => setImmediate(resolve));
    assert.deepStrictEqual(started, ['first', 'second', 'third']);

    gates[0]!.resolve();
    gates[2]!.resolve();
    await new Promise<void>(resolve => setImmediate(resolve));
    gates[3]!.resolve();
    gates[4]!.resolve();

    assert.deepStrictEqual(Array.from(await resultPromise), [
      ['even', ['first', 'third', 'fifth']],
      ['odd', ['second', 'fourth']],
    ]);
    assert.strictEqual(maxActive, 2);
  });

  test('rejects invalid concurrency limits', () => {
    assert.throws(
      () => new DigestCategorizer(0),
      /Digest concurrency must be a positive integer/,
    );
  });
});
