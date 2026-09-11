/**
 * domain/Attempt.js
 *
 * Represents one practice session by one learner for one problem.
 *
 * Responsibility:
 *   Own the lifecycle of a practice attempt and enforce
 *   valid state transitions.
 *
 * Lifecycle:
 *   DRAFT → SUBMITTED → EVALUATING → COMPLETED
 *                                   ↘ FAILED
 *
 * Cardinality:
 *   Problem   1 ──── * Attempt       (many attempts per problem)
 *   Attempt   1 ──── 1 Submission    (one final submission per attempt)
 *   Attempt   1 ──── 1 Evaluation    (one evaluation result per attempt)
 *
 * Design rule:
 *   Only Attempt's own methods may advance its status.
 *   Direct assignment (attempt.status = "COMPLETED") is not
 *   the intended API — callers must use submit(), startEvaluation(),
 *   complete(), or fail() instead.
 */

'use strict';

/** All valid states an Attempt can be in. */
const AttemptStatus = Object.freeze({
  DRAFT:      'DRAFT',
  SUBMITTED:  'SUBMITTED',
  EVALUATING: 'EVALUATING',
  COMPLETED:  'COMPLETED',
  FAILED:     'FAILED',
});

/**
 * The only state transitions that are permitted.
 * Any other transition throws an error immediately.
 */
const VALID_TRANSITIONS = Object.freeze({
  [AttemptStatus.DRAFT]:      [AttemptStatus.SUBMITTED],
  [AttemptStatus.SUBMITTED]:  [AttemptStatus.EVALUATING],
  [AttemptStatus.EVALUATING]: [AttemptStatus.COMPLETED, AttemptStatus.FAILED],
  [AttemptStatus.COMPLETED]:  [],
  [AttemptStatus.FAILED]:     [],
});

class Attempt {
  /**
   * @param {object} params
   * @param {string} params.id        - Unique attempt identifier
   * @param {string} params.problemId - The Problem this attempt belongs to
   */
  constructor({ id, problemId, userId }) {
    if (!id || !problemId) {
      throw new Error('Attempt: id and problemId are required.');
    }

    this.id           = id;
    this.problemId    = problemId;
    this.userId       = userId || 'anonymous';
    this.status       = AttemptStatus.DRAFT;
    this.submissionId = null;   // 1:1 — set when the learner submits
    this.evaluationId = null;   // 1:1 — set when evaluation completes
    this.submission   = null;   // full Submission object (set by service)
    this.evaluation   = null;   // full Evaluation object (set by service)
    this.createdAt    = new Date();
    this.submittedAt  = null;
    this.completedAt  = null;
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  /**
   * Validates and performs a status transition.
   * @param {string} nextStatus - Target status from AttemptStatus
   */
  _transition(nextStatus) {
    const allowed = VALID_TRANSITIONS[this.status];

    if (!allowed.includes(nextStatus)) {
      throw new Error(
        `Attempt [${this.id}]: invalid transition ${this.status} → ${nextStatus}. ` +
        `Allowed: ${allowed.length ? allowed.join(', ') : 'none (terminal state)'}.`
      );
    }

    this.status = nextStatus;
  }

  // ─── Public lifecycle API ───────────────────────────────────────────────────

  /**
   * Learner submits their answer.
   * @param {string} submissionId - ID of the Submission being attached
   */
  submit(submissionId) {
    if (!submissionId) throw new Error('Attempt.submit: submissionId is required.');
    this._transition(AttemptStatus.SUBMITTED);
    this.submissionId = submissionId;
    this.submittedAt  = new Date();
  }

  /** Evaluation process begins (Evaluator picks it up). */
  startEvaluation() {
    this._transition(AttemptStatus.EVALUATING);
  }

  /**
   * Evaluation finished successfully.
   * @param {string} evaluationId - ID of the completed Evaluation (satisfies 1:1 cardinality)
   */
  complete(evaluationId) {
    if (!evaluationId) throw new Error('Attempt.complete: evaluationId is required.');
    this._transition(AttemptStatus.COMPLETED);
    this.evaluationId = evaluationId;
    this.completedAt  = new Date();
  }

  /** Evaluation could not be completed (e.g. API error). */
  fail() {
    this._transition(AttemptStatus.FAILED);
  }

  /** Returns a plain object safe to send over the wire. */
  toJSON() {
    const json = {
      id:           this.id,
      problemId:    this.problemId,
      userId:       this.userId,
      status:       this.status,
      submissionId: this.submissionId,
      evaluationId: this.evaluationId,
      createdAt:    this.createdAt,
      submittedAt:  this.submittedAt,
      completedAt:  this.completedAt,
    };

    if (this.submission) {
      json.submission = typeof this.submission.toJSON === 'function'
        ? this.submission.toJSON()
        : this.submission;
    }

    if (this.evaluation) {
      json.evaluation = typeof this.evaluation.toJSON === 'function'
        ? this.evaluation.toJSON()
        : this.evaluation;
    }

    return json;
  }
}

module.exports = { Attempt, AttemptStatus };
