const { spawn } = require('child_process');
const path = require('path');

function spawnNodeScript(scriptPath, cwd) {
  const node = process.execPath; // path to node
  const abs = path.isAbsolute(scriptPath) ? scriptPath : path.join(cwd || process.cwd(), scriptPath);
  console.log(`Starting: ${node} ${abs} (cwd=${cwd || process.cwd()})`);
  const child = spawn(node, [abs], { cwd: cwd || process.cwd(), stdio: 'inherit' });
  child.on('error', (err) => console.error(`Failed to start ${abs}:`, err));
  return child;
}

function spawnNodeFile(filePath, cwd) {
  return spawnNodeScript(filePath, cwd);
}

function startServer() {
  // Start server using node directly (avoids nodemon/.cmd issues). If you still want nodemon,
  // you can run npm run server in another terminal or modify this to spawn the nodemon binary.
  const serverFile = path.join(__dirname, '..', 'server', 'index.js');
  return spawnNodeFile(serverFile);
}

function startClient() {
  // Try to find react-scripts start entrypoint and run it with node so we don't need to shell out to npm (which is a .cmd on Windows).
  const clientDir = path.join(__dirname, '..', 'client');
  const reactScriptsStart = path.join(clientDir, 'node_modules', 'react-scripts', 'scripts', 'start.js');

  if (require('fs').existsSync(reactScriptsStart)) {
    return spawnNodeFile(reactScriptsStart, clientDir);
  }

  // Fallback: spawn `npm start` (this may require shell on Windows). We still attempt it as a last resort.
  console.log('react-scripts start not found, falling back to `npm start` in client directory');
  const child = spawn(process.platform === 'win32' ? 'cmd.exe' : 'npm', process.platform === 'win32' ? ['/c', 'npm', 'start'] : ['start'], { cwd: clientDir, stdio: 'inherit', shell: false });
  child.on('error', (err) => console.error('Failed to start client fallback:', err));
  return child;
}

const children = [];

// start both
children.push(startServer());
children.push(startClient());

// on exit, kill children
function shutdown(code) {
  console.log('Shutting down children...');
  children.forEach((c) => {
    if (!c || c.killed) return;
    try {
      c.kill('SIGINT');
    } catch (e) {
      // ignore
    }
  });
  process.exit(code || 0);
}

process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
process.on('uncaughtException', (err) => {
  console.error('uncaughtException in start-all:', err);
  shutdown(1);
});

// if any child exits with non-zero, shut everything down
children.forEach((c) => {
  if (!c) return;
  c.on('exit', (code, signal) => {
    if (code && code !== 0) {
      console.error(`Child exited with code ${code} (signal=${signal}). Shutting down.`);
      shutdown(code);
    }
  });
});
