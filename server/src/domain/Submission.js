/**
 * domain/Submission.js
 *
 * Represents the learner's answer to an LLD problem.
 *
 * Responsibility:
 *   Hold the structured text content that the learner fills in during
 *   a practice attempt.  Nothing more.
 *
 * Deliberately does NOT:
 *   - evaluate itself
 *   - know about the evaluator strategy
 *   - persist itself
 *
 * Design:
 *   Submission is an abstract base (could later have a DiagramSubmission
 *   or CodeSubmission variant).  TextSubmission is the concrete class
 *   used throughout the MVP.
 *
 * Cardinality:
 *   Attempt 1 ──── 1 Submission   (one final submission per attempt)
 *
 * Fields (TextSubmission):
 *   requirements     – restated / clarified requirements
 *   assumptions      – assumptions the learner is making
 *   classes          – identified classes / entities
 *   responsibilities – what each class is responsible for
 *   relationships    – how classes relate to each other
 *   designDecisions  – rationale for patterns & trade-offs
 *   edgeCases        – edge cases and how the design handles them
 */

'use strict';

/** Discriminator for future submission variants. */
const SubmissionType = Object.freeze({
  TEXT: 'TEXT',
  // DIAGRAM: 'DIAGRAM',   // future
  // CODE:    'CODE',       // future
});

// ─── Base class ───────────────────────────────────────────────────────────────

class Submission {
  /**
   * @param {object} params
   * @param {string} params.id        - Unique submission identifier
   * @param {string} params.attemptId - The Attempt this submission belongs to
   * @param {string} params.type      - One of SubmissionType.*
   */
  constructor({ id, attemptId, type }) {
    if (new.target === Submission) {
      throw new Error(
        'Submission is abstract and cannot be instantiated directly. ' +
        'Use TextSubmission instead.'
      );
    }

    if (!id || !attemptId) {
      throw new Error('Submission: id and attemptId are required.');
    }

    this.id = id;
    this.attemptId = attemptId;
    this.type = type;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /** Updates the updatedAt timestamp. */
  touch() {
    this.updatedAt = new Date();
  }
}

// ─── TextSubmission ───────────────────────────────────────────────────────────

/** Canonical list of content fields for a text-based LLD submission. */
const TEXT_FIELDS = Object.freeze([
  'requirements',
  'assumptions',
  'classes',
  'responsibilities',
  'relationships',
  'designDecisions',
  'edgeCases',
]);

class TextSubmission extends Submission {
  /**
   * @param {object} params
   * @param {string} params.id               - Unique submission identifier
   * @param {string} params.attemptId        - The Attempt this submission belongs to
   * @param {string} [params.requirements]   - Restated / clarified requirements
   * @param {string} [params.assumptions]    - Assumptions the learner is making
   * @param {string} [params.classes]        - Identified classes / entities
   * @param {string} [params.responsibilities] - What each class is responsible for
   * @param {string} [params.relationships]  - How classes relate to each other
   * @param {string} [params.designDecisions]- Rationale for patterns & trade-offs
   * @param {string} [params.edgeCases]      - Edge cases and how they are handled
   */
  constructor({
    id,
    attemptId,
    requirements,
    assumptions,
    classes,
    responsibilities,
    relationships,
    designDecisions,
    edgeCases,
  }) {
    super({ id, attemptId, type: SubmissionType.TEXT });

    this.requirements = requirements ?? '';
    this.assumptions = assumptions ?? '';
    this.classes = classes ?? '';
    this.responsibilities = responsibilities ?? '';
    this.relationships = relationships ?? '';
    this.designDecisions = designDecisions ?? '';
    this.edgeCases = edgeCases ?? '';
  }

  /**
   * Partially updates content fields.
   * Only the keys present in `fields` are overwritten.
   * Automatically calls touch() to refresh updatedAt.
   *
   * @param {object} fields - Partial map of field name → new value
   */
  updateContent(fields = {}) {
    for (const field of TEXT_FIELDS) {
      if (fields[field] !== undefined) {
        this[field] = fields[field];
      }
    }
    this.touch();
  }

  /** Returns a plain object safe to send over the wire. */
  toJSON() {
    return {
      id: this.id,
      attemptId: this.attemptId,
      type: this.type,
      requirements: this.requirements,
      assumptions: this.assumptions,
      classes: this.classes,
      responsibilities: this.responsibilities,
      relationships: this.relationships,
      designDecisions: this.designDecisions,
      edgeCases: this.edgeCases,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = { Submission, TextSubmission, SubmissionType, TEXT_FIELDS };