/**
 * controllers/attemptController.js
 *
 * Handles HTTP concerns for attempts:
 *   - POST /api/attempts         → createAttempt
 *   - GET  /api/attempts/:id     → getAttempt
 *   - GET  /api/attempts         → getAllAttempts (dashboard history)
 *   - GET  /api/problems/:problemId/attempts → getAttemptHistory
 */

'use strict';

const { AttemptService } = require('../services/AttemptService');

const attemptService = new AttemptService();

/**
 * POST /api/attempts
 * Body: { problemId }
 * Creates a new DRAFT attempt.
 */
function createAttempt(req, res) {
  try {
    const { problemId } = req.body;
    if (!problemId) {
      return res.status(400).json({ success: false, message: 'problemId is required.' });
    }

    const attempt = attemptService.createAttempt(problemId);
    res.status(201).json({ success: true, data: attempt.toJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * GET /api/attempts/:id
 * Returns a single attempt with its current status.
 */
function getAttempt(req, res) {
  try {
    const attempt = attemptService.getAttempt(req.params.id);
    res.json({ success: true, data: attempt.toJSON() });
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
}

/**
 * GET /api/attempts
 * Returns all attempts across all problems (dashboard history).
 */
function getAllAttempts(req, res) {
  try {
    const attempts = attemptService.getAllAttempts();
    res.json({ success: true, data: attempts.map((a) => a.toJSON()) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * GET /api/problems/:problemId/attempts
 * Returns attempt history for one problem, newest-first.
 */
function getAttemptHistory(req, res) {
  try {
    const attempts = attemptService.getAttemptHistory(req.params.problemId);
    res.json({ success: true, data: attempts.map((a) => a.toJSON()) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  createAttempt,
  getAttempt,
  getAllAttempts,
  getAttemptHistory,
  attemptService,   // exported so EvaluationService can share the same instance
};
