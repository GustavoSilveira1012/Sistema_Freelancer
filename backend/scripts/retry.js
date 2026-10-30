const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function retry(operation, options = {}) {
  const {
    attempts = 6,
    delayMs = 2000,
    wait = sleep,
    onRetry = () => {},
    shouldRetry = () => true,
  } = options;

  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new RangeError('attempts must be a positive integer');
  }

  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new RangeError('delayMs must be a non-negative number');
  }

  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;

      if (attempt === attempts || !shouldRetry(error, attempt)) {
        break;
      }

      const nextDelayMs = delayMs * 2 ** (attempt - 1);
      onRetry(error, { attempt, nextAttempt: attempt + 1, waitMs: nextDelayMs });
      await wait(nextDelayMs);
    }
  }

  throw lastError;
}

module.exports = { retry };

