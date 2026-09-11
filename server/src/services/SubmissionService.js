/**
 * services/SubmissionService.js
 *
 * Responsibility:
 *   Save, retrieve, and update a learner's submission for an attempt.
 *   Does NOT evaluate submissions — that is EvaluationService's job.
 *
 * Methods:
 *   saveDraft(attemptId, fields)          → TextSubmission
 *   getSubmission(submissionId)           → TextSubmission
 *   updateSubmission(submissionId, fields)→ TextSubmission
 *
 * Storage:
 *   In-memory Map for MVP.
 */

'use strict';

const { TextSubmission, SubmissionType } = require('../domain/Submission');
const { v4: uuidv4 }                     = require('uuid');

/** Canonical list of fields a TextSubmission accepts. */
const TEXT_FIELDS = [
  'requirements',
  'assumptions',
  'classes',
  'responsibilities',
  'relationships',
  'designDecisions',
  'edgeCases',
];

class SubmissionService {
  constructor() {
    /** @type {Map<string, TextSubmission>} */
    this._submissions = new Map();
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  _find(submissionId) {
    const submission = this._submissions.get(submissionId);
    if (!submission) {
      throw new Error(`SubmissionService: submission "${submissionId}" not found.`);
    }
    return submission;
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /**
   * Creates or overwrites a draft submission for an attempt.
   * If a submission already exists for the attempt, it is updated in-place
   * and touch()ed — a new submission is not created.
   *
   * @param {string} attemptId
   * @param {object} fields - Partial or full TextSubmission fields
   * @returns {TextSubmission}
   */
  saveDraft(attemptId, fields = {}) {
    if (!attemptId) throw new Error('SubmissionService.saveDraft: attemptId is required.');

    // Check if a draft already exists for this attempt
    const existing = [...this._submissions.values()]
      .find((s) => s.attemptId === attemptId);

    if (existing) {
      // Update existing draft in-place
      for (const field of TEXT_FIELDS) {
        if (fields[field] !== undefined) {
          existing[field] = fields[field];
        }
      }
      existing.touch();
      return existing;
    }

    // Create a new submission — all fields default to empty string if missing
    const submission = new TextSubmission({
      id:               uuidv4(),
      attemptId,
      requirements:     fields.requirements     ?? '',
      assumptions:      fields.assumptions      ?? '',
      classes:          fields.classes          ?? '',
      responsibilities: fields.responsibilities ?? '',
      relationships:    fields.relationships    ?? '',
      designDecisions:  fields.designDecisions  ?? '',
      edgeCases:        fields.edgeCases        ?? '',
    });

    this._submissions.set(submission.id, submission);
    return submission;
  }

  /**
   * Retrieves a submission by its id.
   *
   * @param {string} submissionId
   * @returns {TextSubmission}
   */
  getSubmission(submissionId) {
    return this._find(submissionId);
  }

  /**
   * Retrieves a submission by its attemptId.
   *
   * @param {string} attemptId
   * @returns {TextSubmission|undefined}
   */
  getSubmissionByAttemptId(attemptId) {
    return [...this._submissions.values()].find((s) => s.attemptId === attemptId);
  }

  /**
   * Updates specific fields on an existing submission.
   * Only the fields provided in `fields` are changed.
   *
   * @param {string} submissionId
   * @param {object} fields - Partial update
   * @returns {TextSubmission}
   */
  updateSubmission(submissionId, fields = {}) {
    const submission = this._find(submissionId);

    for (const field of TEXT_FIELDS) {
      if (fields[field] !== undefined) {
        submission[field] = fields[field];
      }
    }

    submission.touch();
    return submission;
  }
}

module.exports = { SubmissionService, SubmissionType };
