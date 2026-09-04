import assert from 'node:assert';
import { test, describe, beforeEach } from 'node:test';
import { Buckets } from './buckets.ts';

function trimLines(text: string) {
  return text.trim().split('\n').map(line => line.trim()).join('\n');
}

describe('Buckets', () => {
  let buckets: Buckets<string>;

  beforeEach(() => {
    buckets = new Buckets();
  });

  test('size', () => {
    assert.strictEqual(buckets.size, 0);

    buckets.add('b', ['0']);

    assert.strictEqual(buckets.size, 1);

    buckets.add('a', ['2', '3', '1']);

    assert.strictEqual(buckets.size, 2);
  });

  test('allFiles()', () => {
    assert.deepStrictEqual(Array.from(buckets.allFiles()), []);

    buckets.add('b', ['1']);
    buckets.add('a', ['3', '4', '2']);

    assert.deepStrictEqual(Array.from(buckets.allFiles()), ['1', '3', '4', '2']);
  });

  test('sorted()', () => {
    assert.deepStrictEqual(buckets.sorted(), []);

    buckets.add('b', ['1']);
    buckets.add('a', ['3', '4', '2']);

    assert.deepStrictEqual(buckets.sorted(), [['2', '3', '4'], ['1']]);
  });

  test('toString()', () => {
    assert.strictEqual(buckets.toString(), '');

    buckets.add('b', ['one']);

    assert.strictEqual(buckets.toString(), 'one');

    buckets.add('a', ['two', 'three', 'four']);
    buckets.add('d', ['five']);
    buckets.add('c', ['six', 'seven']);

    assert.strictEqual(buckets.toString(), trimLines(`
      four
      three
      two

      one

      seven
      six

      five
    `));
  });

  test('removeNonDuplicates', () => {
    buckets.add('a', ['1']);
    buckets.add('b', ['2']);
    buckets.add('c', ['3', '4']);
    buckets.add('d', []);
    buckets.add('b', ['5']);

    assert.deepStrictEqual(Array.from(buckets), [
      ['a', ['1']],
      ['b', ['2', '5']],
      ['c', ['3', '4']],
      ['d', []],
    ]);

    buckets.removeNonDuplicates();

    assert.deepStrictEqual(Array.from(buckets), [
      ['b', ['2', '5']],
      ['c', ['3', '4']],
    ]);
  });
});
