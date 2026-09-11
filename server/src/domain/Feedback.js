'use strict';

class Feedback {
  constructor({
    criterionId,
    score,
    evidence,
    concern,
    suggestion,
    confidence
  }) {
    if (
      !criterionId ||
      score === undefined ||
      !evidence ||
      !concern ||
      !suggestion ||
      !confidence
    ) {
      throw new Error(
        'Feedback: criterionId, score, evidence, concern, suggestion, and confidence are required.'
      );
    }

    if (typeof score !== 'number' || score < 0 || score > 10) {
      throw new Error('Feedback: score must be a number between 0 and 10.');
    }

    this.criterionId = criterionId;
    this.score = score;
    this.evidence = evidence;
    this.concern = concern;
    this.suggestion = suggestion;
    this.confidence = confidence;
  }

  toJSON() {
    return {
      criterionId: this.criterionId,
      score: this.score,
      evidence: this.evidence,
      concern: this.concern,
      suggestion: this.suggestion,
      confidence: this.confidence
    };
  }
}

module.exports = Feedback;