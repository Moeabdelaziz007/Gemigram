import test from 'node:test';
import assert from 'node:assert';
import { cn } from '../lib/utils';

test('cn() utility function', async (t) => {
  await t.test('combines basic strings', () => {
    assert.strictEqual(cn('foo', 'bar'), 'foo bar');
  });

  await t.test('resolves tailwind class conflicts', () => {
    assert.strictEqual(cn('p-4', 'p-8'), 'p-8');
  });

  await t.test('handles conditional object classes', () => {
    assert.strictEqual(cn('foo', { bar: true, baz: false }), 'foo bar');
  });

  await t.test('handles arrays of classes', () => {
    assert.strictEqual(cn(['foo', 'bar'], ['baz', { qux: true }]), 'foo bar baz qux');
  });

  await t.test('ignores falsy values', () => {
    assert.strictEqual(cn('foo', null, undefined, false, '', 'bar'), 'foo bar');
  });

  await t.test('handles complex tailwind merge scenario', () => {
    assert.strictEqual(
      cn('px-2 py-1 bg-red-500 hover:bg-red-600', 'px-4 bg-blue-500'),
      'py-1 hover:bg-red-600 px-4 bg-blue-500'
    );
  });
});
