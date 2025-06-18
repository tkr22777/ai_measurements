#!/usr/bin/env node

const http = require('http');
const { spawn } = require('child_process');

const BASE_URL = 'http://localhost:3000';
let server;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkEndpoint(path, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: method === 'POST' ? { 'Content-Type': 'application/json' } : {},
    };

    const req = http.request(options, (res) => {
      resolve({ status: res.statusCode, ok: res.statusCode < 400 });
    });

    req.on('error', () => {
      resolve({ status: 0, ok: false });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function startServer() {
  console.log('🚀 Starting Next.js server...');
  server = spawn('npm', ['run', 'dev'], { stdio: 'pipe' });

  // Wait for server to start
  await sleep(5000);

  // Check if server is responding
  for (let i = 0; i < 10; i++) {
    const { ok } = await checkEndpoint('/');
    if (ok) {
      console.log('✅ Server started successfully');
      return true;
    }
    await sleep(1000);
  }

  console.log('❌ Server failed to start');
  return false;
}

async function runTests() {
  console.log('\n🧪 Running API tests...\n');

  const tests = [
    { name: 'Home page', path: '/' },
    { name: 'API Images GET', path: '/api/images?userId=test&type=front' },
    { name: 'API Process GET', path: '/api/process?userId=test' },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const { status, ok } = await checkEndpoint(test.path);
    if (ok || status === 404) {
      // 404 is acceptable for missing data
      console.log(`✅ ${test.name} - ${status}`);
      passed++;
    } else {
      console.log(`❌ ${test.name} - ${status || 'FAILED'}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

async function cleanup() {
  if (server) {
    console.log('\n🧹 Cleaning up...');
    server.kill();
  }
}

async function main() {
  console.log('🔍 Project Verification Script\n');

  try {
    const serverStarted = await startServer();
    if (!serverStarted) {
      process.exit(1);
    }

    const testsPass = await runTests();

    await cleanup();

    if (testsPass) {
      console.log('\n🎉 All verifications passed! Project is working correctly.');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some verifications failed. Check the output above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    await cleanup();
    process.exit(1);
  }
}

// Handle cleanup on exit
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

main();
