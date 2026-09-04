import assert from 'node:assert';
import { test, describe } from 'node:test';
import { join } from 'node:path';
import type { FilePath } from './types.ts';
import { findDuplicateFiles } from './find_duplicate_files.ts';
import categorizers from './categorizers/index.ts';
import { getFixturesPath } from './test_helpers.ts';

const fixturesPath = getFixturesPath(import.meta);

function addFixturesPath(duplicates: FilePath[][]): FilePath[][] {
  return duplicates.map(files => files.map(file => join(fixturesPath, file)));
}

describe('findDuplicateFiles', () => {
  test('detects the correct duplicate files', () => {
    const result = findDuplicateFiles(fixturesPath, categorizers);

    assert.deepStrictEqual(result.sorted(), addFixturesPath([
      [
        'one.txt',
        'one_copy.txt',
      ],
      [
        'another/four.txt',
        'three.txt',
      ],
      [
        'another/empty',
        'empty',
      ]
    ]));
  });
});
