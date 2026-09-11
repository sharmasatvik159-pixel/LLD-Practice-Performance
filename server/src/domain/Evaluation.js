/**
 * domain/Evaluation.js
 *
 * Represents the result produced after an Evaluator assesses a Submission.
 *
 * Responsibility:
 *   Hold the aggregated score, per-criterion breakdown, and metadata
 *   about who evaluated and when.
 *
 * Relationship:
 *   Attempt ──contains──▶ Submission
 *   Submission ──evaluated by──▶ Evaluator
 *   Evaluator ──produces──▶ Evaluation
 *   Evaluation ──contains──▶ Feedback[]
 *
 * overallScore is stored as a 0–100 percentage so that the UI and
 * history views always have a single comparable number, regardless of
 * how many criteria are in the rubric.
 */

'use strict';

/** Which evaluator strategy produced this result. */
const EvaluatorType = Object.freeze({
  RULE_BASED: 'RULE_BASED',
  AI:         'AI',
});

class Evaluation {
  /**
   * @param {object}     params
   * @param {string}     params.id            - Unique evaluation identifier
   * @param {string}     params.attemptId     - The Attempt being evaluated
   * @param {string}     params.evaluatorType - One of EvaluatorType.*
   * @param {number}     params.overallScore  - 0–100 percentage
   * @param {Feedback[]} params.feedbackItems - One Feedback per rubric criterion
   * @param {Date}       [params.evaluatedAt] - Defaults to now
   */
  constructor({
    id,
    attemptId,
    evaluatorType,
    overallScore,
    feedbackItems,
    evaluatedAt,
  }) {
    if (!id || !attemptId || !evaluatorType) {
      throw new Error('Evaluation: id, attemptId, and evaluatorType are required.');
    }

    if (!Object.values(EvaluatorType).includes(evaluatorType)) {
      throw new Error(
        `Evaluation: evaluatorType must be one of ${Object.values(EvaluatorType).join(', ')}.`
      );
    }

    if (typeof overallScore !== 'number' || overallScore < 0 || overallScore > 100) {
      throw new Error('Evaluation: overallScore must be a number between 0 and 100.');
    }

    if (!Array.isArray(feedbackItems)) {
      throw new Error('Evaluation: feedbackItems must be an array of Feedback instances.');
    }

    this.id            = id;
    this.attemptId     = attemptId;
    this.evaluatorType = evaluatorType;
    this.overallScore  = overallScore;
    this.feedbackItems = feedbackItems;   // Feedback[]
    this.evaluatedAt   = evaluatedAt ?? new Date();
  }

  /**
   * Convenience accessor: returns the Feedback for a specific criterion.
   * @param {string} criterionId
   * @returns {Feedback|undefined}
   */
  getFeedback(criterionId) {
    return this.feedbackItems.find((f) => f.criterionId === criterionId);
  }

  /**
   * Recalculates overallScore from the current feedbackItems.
   * Useful when feedbackItems are built incrementally via addFeedback().
   *
   * Formula: (sum of criterion scores / sum of maxScores from rubric) × 100
   * If no rubric is provided, falls back to assuming maxScore = 10 per item.
   *
   * @param {Rubric} [rubric] - Optional rubric for accurate maxScore lookup
   * @returns {number} Updated 0–100 score
   */
  calculateOverallScore(rubric) {
    if (this.feedbackItems.length === 0) return 0;

    let totalScore = 0;
    let maxScore   = 0;

    for (const item of this.feedbackItems) {
      totalScore += item.score;
      if (rubric) {
        try {
          maxScore += rubric.getCriterion(item.criterionId).maxScore;
        } catch {
          maxScore += 10; // fallback
        }
      } else {
        maxScore += 10;
      }
    }

    this.overallScore = Math.round((totalScore / maxScore) * 100);
    return this.overallScore;
  }

  /**
   * Appends a Feedback item to this evaluation.
   * Throws if the evaluation has already been completed.
   *
   * @param {Feedback} feedbackItem
   */
  addFeedback(feedbackItem) {
    if (this._isCompleted) {
      throw new Error('Evaluation: cannot add feedback to a completed evaluation.');
    }
    this.feedbackItems.push(feedbackItem);
  }

  /**
   * Marks this evaluation as complete, preventing further modification.
   * Records the evaluation timestamp.
   */
  complete() {
    this._isCompleted = true;
    this.evaluatedAt  = new Date();
  }

  /** Returns a plain object safe to send over the wire. */
  toJSON() {
    return {
      id:            this.id,
      attemptId:     this.attemptId,
      evaluatorType: this.evaluatorType,
      overallScore:  this.overallScore,
      feedbackItems: this.feedbackItems.map((f) => f.toJSON()),
      evaluatedAt:   this.evaluatedAt,
    };
  }
}

module.exports = { Evaluation, EvaluatorType };
