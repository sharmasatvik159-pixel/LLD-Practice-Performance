'use strict';

const assert = require('assert');
const { spawn } = require('child_process');
const http = require('http');

console.log('========================================');
console.log('RUNNING LLD PRACTICE PLATFORM TEST SUITE');
console.log('========================================\n');

// 1. Unit Tests
const unitTests = [
  'src/domain/testAttempt.js',
  'src/domain/testEvaluation.js',
  'src/domain/testFeedback.js',
  'src/domain/testProblem.js',
  'src/domain/testRubric.js',
  'src/domain/testSubmission.js',
  'src/evaluators/testAIEvaluator.js',
  'src/evaluators/testRuleBasedEvaluator.js',
  'src/services/testEvaluationService.js',
  'src/services/testPracticeService.js'
];

function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [scriptPath], { stdio: 'pipe' });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', d => stdout += d);
    proc.stderr.on('data', d => stderr += d);
    proc.on('close', code => {
      if (code === 0) resolve({ scriptPath, stdout });
      else reject(new Error(`Failed: ${scriptPath}\n${stderr}\n${stdout}`));
    });
  });
}

// HTTP Helper
function httpRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('--- 1. Executing Domain & Service Unit Tests ---');
  for (const test of unitTests) {
    try {
      await runScript(test);
      console.log(`  ✓ PASSED: ${test}`);
    } catch (err) {
      console.error(`  ✗ FAILED: ${test}`, err.message);
      process.exit(1);
    }
  }

  console.log('\n--- 2. Executing End-to-End API Integration Tests ---');

  // Test Health
  const healthRes = await httpRequest('/api/health');
  assert.strictEqual(healthRes.status, 200);
  assert.strictEqual(healthRes.body.success, true);
  console.log('  ✓ GET /api/health passed');

  // Test Problems Listing (All 4 problems)
  const problemsRes = await httpRequest('/api/problems');
  assert.strictEqual(problemsRes.status, 200);
  assert.strictEqual(problemsRes.body.data.length, 4);
  const problemIds = problemsRes.body.data.map(p => p.id);
  const expectedProblems = ['parking-lot', 'vending-machine', 'elevator-system', 'library-management'];
  assert.deepStrictEqual(problemIds.sort(), expectedProblems.sort());
  console.log('  ✓ GET /api/problems returned 4 problems (parking-lot, vending-machine, elevator-system, library-management)');

  // Test Get Each Problem
  for (const pid of expectedProblems) {
    const single = await httpRequest(`/api/problems/${pid}`);
    assert.strictEqual(single.status, 200);
    assert.strictEqual(single.body.data.id, pid);
    assert(single.body.data.requirements.length > 0);
  }
  console.log('  ✓ GET /api/problems/:id verified for all 4 problems');

  // Test Flow for Problem 1: parking-lot with RULE_BASED evaluator
  const p1Start = await httpRequest('/api/practice/problems/parking-lot/attempts', 'POST', { userId: 'e2e-user' });
  assert.strictEqual(p1Start.status, 201);
  const p1AttemptId = p1Start.body.data.id;
  assert.strictEqual(p1Start.body.data.status, 'DRAFT');

  const p1Submit = await httpRequest(`/api/practice/attempts/${p1AttemptId}/submission`, 'POST', {
    evaluatorType: 'RULE_BASED',
    requirements: 'Multiple vehicle types, spots, capacity',
    assumptions: 'Fixed layout, flat rate',
    classes: 'ParkingLot, Spot, Vehicle',
    responsibilities: 'ParkingLot manages floors and tickets',
    relationships: 'ParkingLot has Spots',
    designDecisions: 'Strategy pattern for allocation',
    edgeCases: 'Full lot, invalid tickets'
  });
  assert.strictEqual(p1Submit.status, 200);
  assert.strictEqual(p1Submit.body.data.attempt.status, 'COMPLETED');
  assert.strictEqual(p1Submit.body.data.evaluation.evaluatorType, 'RULE_BASED');
  assert.strictEqual(p1Submit.body.data.evaluation.feedbackItems.length, 8);
  console.log('  ✓ Flow 1 (parking-lot + RULE_BASED): DRAFT → SUBMITTED → EVALUATING → COMPLETED with 8 criteria');

  // Test Flow for Problem 2: vending-machine with AI evaluator
  const p2Start = await httpRequest('/api/practice/problems/vending-machine/attempts', 'POST', { userId: 'e2e-user' });
  const p2AttemptId = p2Start.body.data.id;
  const p2Submit = await httpRequest(`/api/practice/attempts/${p2AttemptId}/submission`, 'POST', {
    evaluatorType: 'AI',
    requirements: 'Display items, coins/cards, dispense, change',
    assumptions: 'Single currency',
    classes: 'VendingMachine, State, Inventory',
    responsibilities: 'Machine coordinates states',
    relationships: 'State pattern composition',
    designDecisions: 'State Pattern for machine lifecycle',
    edgeCases: 'Out of stock, partial payments'
  });
  assert.strictEqual(p2Submit.status, 200);
  assert.strictEqual(p2Submit.body.data.attempt.status, 'COMPLETED');
  assert.strictEqual(p2Submit.body.data.evaluation.evaluatorType, 'AI');
  assert.strictEqual(p2Submit.body.data.evaluation.feedbackItems.length, 8);
  console.log('  ✓ Flow 2 (vending-machine + AI): DRAFT → SUBMITTED → EVALUATING → COMPLETED with 8 criteria');

  // Test Flow for Problem 3: elevator-system with RULE_BASED evaluator
  const p3Start = await httpRequest('/api/practice/problems/elevator-system/attempts', 'POST', { userId: 'e2e-user' });
  const p3AttemptId = p3Start.body.data.id;
  const p3Submit = await httpRequest(`/api/practice/attempts/${p3AttemptId}/submission`, 'POST', {
    evaluatorType: 'RULE_BASED',
    requirements: 'Elevators, floor requests, dispatching',
    assumptions: '10 floors, 3 cars',
    classes: 'ElevatorController, ElevatorCar, RequestQueue',
    responsibilities: 'Controller dispatches nearest car',
    relationships: 'Controller aggregates ElevatorCars',
    designDecisions: 'LOOK/SCAN scheduling algorithm',
    edgeCases: 'Power failure, overload capacity'
  });
  assert.strictEqual(p3Submit.status, 200);
  assert.strictEqual(p3Submit.body.data.attempt.status, 'COMPLETED');
  assert.strictEqual(p3Submit.body.data.evaluation.feedbackItems.length, 8);
  console.log('  ✓ Flow 3 (elevator-system + RULE_BASED): completed with 8 criteria');

  // Test Flow for Problem 4: library-management with AI evaluator
  const p4Start = await httpRequest('/api/practice/problems/library-management/attempts', 'POST', { userId: 'e2e-user' });
  const p4AttemptId = p4Start.body.data.id;
  const p4Submit = await httpRequest(`/api/practice/attempts/${p4AttemptId}/submission`, 'POST', {
    evaluatorType: 'AI',
    requirements: 'Manage books, members, issues, returns',
    assumptions: 'Standard 14-day checkout',
    classes: 'Library, Book, Member, LoanRecord',
    responsibilities: 'Library tracks catalogue and loans',
    relationships: 'Library has Books and Members',
    designDecisions: 'Repository pattern for persistence',
    edgeCases: 'Lost book, expired membership'
  });
  assert.strictEqual(p4Submit.status, 200);
  assert.strictEqual(p4Submit.body.data.attempt.status, 'COMPLETED');
  assert.strictEqual(p4Submit.body.data.evaluation.feedbackItems.length, 8);
  console.log('  ✓ Flow 4 (library-management + AI): completed with 8 criteria');

  // Test Attempt History API
  const historyRes = await httpRequest('/api/practice/problems/parking-lot/attempts');
  assert.strictEqual(historyRes.status, 200);
  assert(Array.isArray(historyRes.body.data));
  assert(historyRes.body.data.length >= 1);
  console.log(`  ✓ GET /api/practice/problems/:id/attempts returned ${historyRes.body.data.length} attempts with history`);

  // Test GET Single Attempt API
  const getAttemptRes = await httpRequest(`/api/practice/attempts/${p1AttemptId}`);
  assert.strictEqual(getAttemptRes.status, 200);
  assert.strictEqual(getAttemptRes.body.data.id, p1AttemptId);
  assert.strictEqual(getAttemptRes.body.data.status, 'COMPLETED');
  console.log('  ✓ GET /api/practice/attempts/:id verified');

  console.log('\n--- 3. Testing Error Cases ---');

  // Error 1: Non-existent problem
  const errProblem = await httpRequest('/api/practice/problems/invalid-problem-xyz/attempts', 'POST', {});
  assert.strictEqual(errProblem.status, 400);
  assert.strictEqual(errProblem.body.success, false);
  console.log('  ✓ Non-existent problem ID rejected (400)');

  // Error 2: Non-existent attempt submission
  const errSubmit = await httpRequest('/api/practice/attempts/invalid-attempt-xyz/submission', 'POST', {});
  assert.strictEqual(errSubmit.status, 400);
  assert.strictEqual(errSubmit.body.success, false);
  console.log('  ✓ Non-existent attempt submission rejected (400)');

  // Error 3: Non-existent attempt retrieval
  const errGet = await httpRequest('/api/practice/attempts/invalid-attempt-xyz');
  assert.strictEqual(errGet.status, 404);
  assert.strictEqual(errGet.body.success, false);
  console.log('  ✓ Non-existent attempt fetch rejected (404)');

  // Error 4: Unknown route
  const errRoute = await httpRequest('/api/unknown-endpoint');
  assert.strictEqual(errRoute.status, 404);
  assert.strictEqual(errRoute.body.message, 'Route not found');
  console.log('  ✓ Unknown route returns 404');

  // Error 5: Re-submitting an already completed attempt
  const reSubmit = await httpRequest(`/api/practice/attempts/${p1AttemptId}/submission`, 'POST', {});
  assert.strictEqual(reSubmit.status, 400);
  console.log('  ✓ State machine protection: cannot re-submit COMPLETED attempt (400)');

  console.log('\n========================================');
  console.log('✓ ALL TESTS & SCENARIOS PASSED 100%!');
  console.log('========================================');
}

run().catch(err => {
  console.error('\n✗ Test Suite failed:', err);
  process.exit(1);
});
