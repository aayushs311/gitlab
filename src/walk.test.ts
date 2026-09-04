import assert from 'node:assert';
import { test } from 'node:test';
import { walk } from './walk.ts';
import { getFixturesPath } from './test_helpers.ts';

const fixturesPath = getFixturesPath(import.meta);

test('yields all regular files', () => {
  assert.deepStrictEqual(Array.from(walk(fixturesPath)).sort(), [
    'test_fixtures/another/empty',
    'test_fixtures/another/five.txt',
    'test_fixtures/another/four.txt',
    'test_fixtures/another/unique.txt',
    'test_fixtures/empty',
    'test_fixtures/one.txt',
    'test_fixtures/one_copy.txt',
    'test_fixtures/three.txt',
    'test_fixtures/two.txt',
  ]);
});

