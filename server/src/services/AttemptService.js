/**
 * services/AttemptService.js
 *
 * Responsibility:
 *   Control the full lifecycle of a learner's practice attempt.
 *   Delegates to Attempt domain object for state transitions —
 *   the service coordinates, the domain object enforces the rules.
 *
 * Methods:
 *   createAttempt(problemId)              → Attempt
 *   getAttempt(attemptId)                 → Attempt
 *   submitAttempt(attemptId, submissionId)→ Attempt
 *   getAttemptHistory(problemId)          → Attempt[]
 *
 * Storage:
 *   In-memory Map for MVP.
 *   Replace with a database repository later without changing
 *   any controller, route, or domain object.
 */

'use strict';

const { Attempt, AttemptStatus } = require('../domain/Attempt');
const { v4: uuidv4 }             = require('uuid');

class AttemptService {
  constructor() {
    /** @type {Map<string, Attempt>} */
    this._attempts = new Map();
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Looks up an attempt by id. Throws a clean error if not found.
   * @param {string} attemptId
   * @returns {Attempt}
   */
  _find(attemptId) {
    const attempt = this._attempts.get(attemptId);
    if (!attempt) {
      throw new Error(`AttemptService: attempt "${attemptId}" not found.`);
    }
    return attempt;
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /**
   * Creates a new DRAFT attempt for the given problem.
   *
   * @param {string} problemId - Must match an existing Problem id
   * @returns {Attempt}
   */
  createAttempt(problemId) {
    if (!problemId) throw new Error('AttemptService.createAttempt: problemId is required.');

    const attempt = new Attempt({
      id:        uuidv4(),
      problemId,
    });

    this._attempts.set(attempt.id, attempt);
    return attempt;
  }

  /**
   * Retrieves an attempt by id.
   *
   * @param {string} attemptId
   * @returns {Attempt}
   */
  getAttempt(attemptId) {
    return this._find(attemptId);
  }

  /**
   * Advances the attempt from DRAFT → SUBMITTED and links the submission.
   * The Attempt domain object validates the transition.
   *
   * @param {string} attemptId
   * @param {string} submissionId - ID of the Submission being attached
   * @returns {Attempt}
   */
  submitAttempt(attemptId, submissionId) {
    const attempt = this._find(attemptId);
    attempt.submit(submissionId); // throws if attempt is not in DRAFT
    return attempt;
  }

  /**
   * Returns all attempts for a given problem, ordered newest-first.
   * Powers the "attempt history" view in the UI.
   *
   * @param {string} problemId
   * @returns {Attempt[]}
   */
  getAttemptHistory(problemId) {
    return [...this._attempts.values()]
      .filter((a) => a.problemId === problemId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Returns all attempts across all problems, ordered newest-first.
   * Used for the dashboard history panel.
   *
   * @returns {Attempt[]}
   */
  getAllAttempts() {
    return [...this._attempts.values()]
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Marks an attempt as EVALUATING.
   * Called by EvaluationService before starting evaluation.
   *
   * @param {string} attemptId
   * @returns {Attempt}
   */
  startEvaluation(attemptId) {
    const attempt = this._find(attemptId);
    attempt.startEvaluation();
    return attempt;
  }

  /**
   * Marks an attempt as COMPLETED and links the evaluation.
   * Called by EvaluationService on success.
   *
   * @param {string} attemptId
   * @param {string} evaluationId
   * @returns {Attempt}
   */
  completeAttempt(attemptId, evaluationId) {
    const attempt = this._find(attemptId);
    attempt.complete(evaluationId);
    return attempt;
  }

  /**
   * Marks an attempt as FAILED.
   * Called by EvaluationService on unrecoverable error.
   *
   * @param {string} attemptId
   * @returns {Attempt}
   */
  failAttempt(attemptId) {
    const attempt = this._find(attemptId);
    attempt.fail();
    return attempt;
  }
}

module.exports = { AttemptService, AttemptStatus };
