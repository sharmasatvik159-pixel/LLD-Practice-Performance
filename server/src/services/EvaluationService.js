'use strict';

class EvaluationService {
  constructor() {
    this.evaluators = new Map();
    this.evaluations = new Map();
  }

  registerEvaluator(type, evaluator) {
    if (!type || !evaluator) {
      throw new Error(
        'EvaluationService: type and evaluator are required.'
      );
    }

    this.evaluators.set(type, evaluator);

    return evaluator;
  }

  getEvaluator(type) {
    const evaluator = this.evaluators.get(type);

    if (!evaluator) {
      throw new Error(
        `EvaluationService: evaluator "${type}" not found.`
      );
    }

    return evaluator;
  }

  evaluate(type, { attemptId, submission }) {
    const evaluator = this.getEvaluator(type);

    const evaluation = evaluator.evaluate({
      attemptId,
      submission
    });

    // Store for later retrieval by FeedbackService
    this.evaluations.set(evaluation.id, evaluation);

    return evaluation;
  }

  getEvaluation(evaluationId) {
    const evaluation = this.evaluations.get(evaluationId);

    if (!evaluation) {
      throw new Error(
        `EvaluationService: evaluation "${evaluationId}" not found.`
      );
    }

    return evaluation;
  }
}

module.exports = EvaluationService;