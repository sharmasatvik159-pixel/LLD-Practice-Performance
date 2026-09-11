/**
 * services/FeedbackService.js
 *
 * Responsibility:
 *   Retrieve and present feedback from a completed evaluation.
 *   Kept separate from EvaluationService to honour SRP — EvaluationService
 *   coordinates the pipeline; FeedbackService handles the read-side.
 *
 * Methods:
 *   getFeedback(evaluationId)              → Feedback[]
 *   getFeedbackForCriterion(evaluationId, criterionId) → Feedback
 *   generateFeedbackSummary(evaluationId)  → object
 */

'use strict';

class FeedbackService {
  /**
   * @param {EvaluationService} evaluationService
   */
  constructor(evaluationService) {
    this._evaluationService = evaluationService;
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /**
   * Returns all feedback items for a completed evaluation.
   *
   * @param {string} evaluationId
   * @returns {Feedback[]}
   */
  getFeedback(evaluationId) {
    const evaluation = this._evaluationService.getEvaluation(evaluationId);
    return evaluation.feedbackItems;
  }

  /**
   * Returns feedback for a single criterion within an evaluation.
   *
   * @param {string} evaluationId
   * @param {string} criterionId
   * @returns {Feedback}
   */
  getFeedbackForCriterion(evaluationId, criterionId) {
    const evaluation = this._evaluationService.getEvaluation(evaluationId);
    const item       = evaluation.getFeedback(criterionId);

    if (!item) {
      throw new Error(
        `FeedbackService: no feedback found for criterion "${criterionId}" ` +
        `in evaluation "${evaluationId}".`
      );
    }

    return item;
  }

  /**
   * Generates a structured summary of all feedback for an evaluation.
   * Used by the feedback page to render the full result view.
   *
   * @param {string} evaluationId
   * @returns {object}
   */
  generateFeedbackSummary(evaluationId) {
    const evaluation = this._evaluationService.getEvaluation(evaluationId);

    // Split feedback into strengths (score ≥ 7) and improvements (score < 7)
    const strengths    = evaluation.feedbackItems.filter((f) => f.score >= 7);
    const improvements = evaluation.feedbackItems.filter((f) => f.score < 7);

    // Find highest- and lowest-scoring criteria
    const sorted     = [...evaluation.feedbackItems].sort((a, b) => b.score - a.score);
    const topArea    = sorted[0]    ?? null;
    const bottomArea = sorted[sorted.length - 1] ?? null;

    return {
      evaluationId:   evaluation.id,
      attemptId:      evaluation.attemptId,
      evaluatorType:  evaluation.evaluatorType,
      overallScore:   evaluation.overallScore,
      evaluatedAt:    evaluation.evaluatedAt,
      strengths:      strengths.map((f)    => f.toJSON()),
      improvements:   improvements.map((f) => f.toJSON()),
      topArea:        topArea    ? topArea.toJSON()    : null,
      bottomArea:     bottomArea ? bottomArea.toJSON() : null,
      allFeedback:    evaluation.feedbackItems.map((f) => f.toJSON()),
    };
  }
}

module.exports = { FeedbackService };
