const assert = require('node:assert/strict');
const test = require('node:test');
const { retry } = require('./retry');

test('retries a transient failure and returns the successful result', async () => {
  let attempts = 0;
  const waits = [];

  const result = await retry(async () => {
    attempts += 1;
    if (attempts < 3) {
      throw new Error('database temporarily unavailable');
    }
    return 'ready';
  }, {
    attempts: 3,
    delayMs: 10,
    wait: async (milliseconds) => waits.push(milliseconds),
  });

  assert.equal(result, 'ready');
  assert.equal(attempts, 3);
  assert.deepEqual(waits, [10, 20]);
});

test('throws the last error after exhausting attempts', async () => {
  const failure = new Error('database remains unavailable');
  let attempts = 0;
  const waits = [];

  await assert.rejects(retry(async () => {
    attempts += 1;
    throw failure;
  }, {
    attempts: 2,
    delayMs: 10,
    wait: async (milliseconds) => waits.push(milliseconds),
  }), (error) => error === failure);

  assert.equal(attempts, 2);
  assert.deepEqual(waits, [10]);
});

test('stops retrying when the operation is cancelled', async () => {
  const failure = new Error('startup was cancelled');
  let attempts = 0;
  const waits = [];

  await assert.rejects(retry(async () => {
    attempts += 1;
    throw failure;
  }, {
    attempts: 6,
    delayMs: 10,
    shouldRetry: () => false,
    wait: async (milliseconds) => waits.push(milliseconds),
  }), (error) => error === failure);

  assert.equal(attempts, 1);
  assert.deepEqual(waits, []);
});

