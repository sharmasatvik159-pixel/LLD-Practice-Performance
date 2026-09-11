/**
 * controllers/submissionController.js
 *
 * Handles HTTP concerns for submissions:
 *   - POST /api/attempts/:attemptId/submission  → saveDraft
 *   - GET  /api/submissions/:id                 → getSubmission
 *   - PATCH /api/submissions/:id                → updateSubmission
 */

'use strict';

const { SubmissionService } = require('../services/SubmissionService');
const { attemptService }    = require('./attemptController');

const submissionService = new SubmissionService();

/**
 * POST /api/attempts/:attemptId/submission
 * Body: { requirements, assumptions, classes, responsibilities,
 *          relationships, designDecisions, edgeCases }
 *
 * Creates a new draft or updates an existing one (idempotent).
 * Also links the submission to the attempt (DRAFT → SUBMITTED).
 */
function saveDraft(req, res) {
  try {
    const { attemptId } = req.params;

    // Verify the attempt exists before creating a submission
    attemptService.getAttempt(attemptId);

    const submission = submissionService.saveDraft(attemptId, req.body);

    // Link the submission to the attempt (advances to SUBMITTED)
    try {
      attemptService.submitAttempt(attemptId, submission.id);
    } catch (transitionErr) {
      // Attempt may already be SUBMITTED (e.g. draft save after first submit)
      // This is acceptable — we still update the submission content
      if (!transitionErr.message.includes('invalid transition')) {
        throw transitionErr;
      }
    }

    res.status(201).json({ success: true, data: submission.toJSON() });
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
}

/**
 * GET /api/submissions/:id
 * Returns a submission by its own id.
 */
function getSubmission(req, res) {
  try {
    const submission = submissionService.getSubmission(req.params.id);
    res.json({ success: true, data: submission.toJSON() });
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
}

/**
 * PATCH /api/submissions/:id
 * Body: partial field updates
 * Updates specific fields on an existing submission.
 */
function updateSubmission(req, res) {
  try {
    const submission = submissionService.updateSubmission(req.params.id, req.body);
    res.json({ success: true, data: submission.toJSON() });
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
}

module.exports = {
  saveDraft,
  getSubmission,
  updateSubmission,
  submissionService, // exported so evaluationController can share the same instance
};
