import assert from 'node:assert';
import { test } from 'node:test';
import { join } from 'node:path';
import { walk } from './walk.ts';
import { getFixturesPath } from './test_helpers.ts';

const fixturesPath = getFixturesPath(import.meta);

test('yields all regular files', async () => {
  const files: string[] = [];
  for await (const file of walk(fixturesPath)) files.push(file);

  assert.deepStrictEqual(files.sort(), [
    'test_fixtures/another/empty',
    'test_fixtures/another/five.txt',
    'test_fixtures/another/four.txt',
    'test_fixtures/another/unique.txt',
    'test_fixtures/empty',
    'test_fixtures/one.txt',
    'test_fixtures/one_copy.txt',
    'test_fixtures/three.txt',
    'test_fixtures/two.txt',
  ].map(path => join(...path.split('/'))));
});

