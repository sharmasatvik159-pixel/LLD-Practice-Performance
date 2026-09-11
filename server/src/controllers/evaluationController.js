/**
 * controllers/evaluationController.js
 *
 * Handles HTTP concerns for evaluation and feedback:
 *   - POST /api/attempts/:attemptId/evaluate → evaluateAttempt
 *   - GET  /api/evaluations/:id              → getEvaluation
 *   - GET  /api/evaluations/:id/feedback     → getFeedbackSummary
 */

'use strict';

const { EvaluationService } = require('../services/EvaluationService');
const { FeedbackService }   = require('../services/FeedbackService');
const { RuleBasedEvaluator } = require('../evaluators/RuleBasedEvaluator');
const { AIEvaluator }        = require('../evaluators/AIEvaluator');
const { defaultRubric }      = require('../domain/Rubric');
const { attemptService }     = require('./attemptController');
const { submissionService }  = require('./submissionController');

// ─── Evaluator strategy selection ─────────────────────────────────────────────
// Default to RuleBasedEvaluator; switch to AIEvaluator when OPENAI_API_KEY
// is present in the environment.

const evaluator = process.env.OPENAI_API_KEY
  ? new AIEvaluator(defaultRubric)
  : new RuleBasedEvaluator(defaultRubric);

const evaluationService = new EvaluationService(evaluator, attemptService);
const feedbackService   = new FeedbackService(evaluationService);

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/attempts/:attemptId/evaluate
 * Triggers evaluation for a submitted attempt.
 */
async function evaluateAttempt(req, res) {
  try {
    const { attemptId } = req.params;

    // Fetch attempt and submission
    const attempt    = attemptService.getAttempt(attemptId);
    const submission = submissionService.getSubmissionByAttemptId(attemptId);

    if (!submission) {
      return res.status(400).json({
        success: false,
        message: 'No submission found for this attempt. Submit your answer first.',
      });
    }

    if (attempt.status !== 'SUBMITTED') {
      return res.status(400).json({
        success: false,
        message: `Attempt is in "${attempt.status}" status. Only SUBMITTED attempts can be evaluated.`,
      });
    }

    // Run the evaluation pipeline
    const evaluation = await evaluationService.evaluateAttempt(attempt, submission);

    res.status(201).json({ success: true, data: evaluation.toJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * GET /api/evaluations/:id
 * Returns a raw evaluation result.
 */
function getEvaluation(req, res) {
  try {
    const evaluation = evaluationService.getEvaluation(req.params.id);
    res.json({ success: true, data: evaluation.toJSON() });
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
}

/**
 * GET /api/evaluations/:id/feedback
 * Returns a rich feedback summary for the learner's result view.
 */
function getFeedbackSummary(req, res) {
  try {
    const summary = feedbackService.generateFeedbackSummary(req.params.id);
    res.json({ success: true, data: summary });
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
}

module.exports = { evaluateAttempt, getEvaluation, getFeedbackSummary };
