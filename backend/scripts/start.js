const { spawn } = require('node:child_process');
const path = require('node:path');
const { retry } = require('./retry');

let activeChild;
let shutdownRequested = false;

function runNodeScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...args], {
      env: process.env,
      stdio: 'inherit',
    });

    activeChild = child;

    child.once('error', (error) => {
      if (activeChild === child) activeChild = undefined;
      reject(error);
    });

    child.once('close', (code, signal) => {
      if (activeChild === child) activeChild = undefined;
      if (signal) {
        reject(new Error(`child process terminated by ${signal}`));
      } else if (code !== 0) {
        reject(new Error(`child process exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    shutdownRequested = true;
    if (activeChild) {
      activeChild.kill(signal);
    } else {
      process.exit(0);
    }
  });
}

async function start() {
  const attempts = 6;
  const prismaCli = path.join(__dirname, '..', 'node_modules', 'prisma', 'build', 'index.js');
  const serverEntry = path.join(__dirname, '..', 'dist', 'index.js');

  try {
    await retry(() => runNodeScript(prismaCli, ['migrate', 'deploy']), {
      attempts,
      delayMs: 2000,
      shouldRetry: () => !shutdownRequested,
      onRetry(_error, { attempt, nextAttempt, waitMs }) {
        console.warn(
          `Database migrations failed on attempt ${attempt}/${attempts}; ` +
          `retrying attempt ${nextAttempt} in ${waitMs} ms.`,
        );
      },
    });
  } catch (error) {
    if (shutdownRequested) {
      process.exitCode = 0;
      return;
    }

    console.error(
      `Could not apply Prisma migrations after ${attempts} attempts. ` +
      `Check DATABASE_URL and database availability. ${error.message}`,
    );
    process.exitCode = 1;
    return;
  }

  if (shutdownRequested) {
    process.exitCode = 0;
    return;
  }

  try {
    await runNodeScript(serverEntry);
  } catch (error) {
    if (!shutdownRequested) {
      console.error(`Backend process failed: ${error.message}`);
    }
    process.exitCode = shutdownRequested ? 0 : 1;
  }
}

void start();

