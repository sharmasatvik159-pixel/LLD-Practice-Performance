'use strict';

const Evaluator = require('./Evaluator');
const { Evaluation, EvaluatorType } = require('../domain/Evaluation');
const Feedback = require('../domain/Feedback');

class AIEvaluator extends Evaluator {
  constructor() {
    super(EvaluatorType.AI);
  }

  evaluate({ attemptId, submission }) {
    if (!attemptId || !submission) {
      throw new Error(
        'AIEvaluator: attemptId and submission are required.'
      );
    }

    const feedbackItems = [
      this.createFeedback(
        'requirement-understanding',
        submission.requirements,
        'requirements'
      ),

      this.createFeedback(
        'class-responsibilities',
        submission.responsibilities,
        'class responsibilities'
      ),

      this.createFeedback(
        'coupling-cohesion',
        submission.relationships,
        'relationships'
      ),

      this.createFeedback(
        'encapsulation-interfaces',
        submission.classes,
        'classes and interfaces'
      ),

      this.createFeedback(
        'abstraction-patterns',
        submission.designDecisions,
        'abstraction and design patterns'
      ),

      this.createFeedback(
        'extensibility',
        submission.designDecisions,
        'extensibility'
      ),

      this.createFeedback(
        'edge-cases-testability',
        submission.edgeCases,
        'edge cases and testability'
      ),

      this.createFeedback(
        'explanation-quality',
        submission.assumptions,
        'design explanation'
      )
    ];

    const evaluation = new Evaluation({
      id: `ai-evaluation-${Date.now()}`,
      attemptId,
      evaluatorType: EvaluatorType.AI,
      overallScore: 0,
      feedbackItems
    });

    evaluation.calculateOverallScore();
    evaluation.complete();

    return evaluation;
  }

  createFeedback(criterionId, value, area) {
    const hasContent =
      value !== undefined &&
      value !== null &&
      String(value).trim().length > 0;

    return new Feedback({
      criterionId,
      score: hasContent ? 9 : 4,

      evidence: hasContent
        ? `The submission provides information about ${area}.`
        : `The submission provides little or no information about ${area}.`,

      concern: hasContent
        ? `The ${area} section can still be improved with more precise reasoning.`
        : `The ${area} section is missing or insufficient.`,

      suggestion: hasContent
        ? `Explain the reasoning behind the ${area} decision and discuss possible trade-offs.`
        : `Add a clear explanation covering ${area}.`,

      confidence: hasContent ? 'MEDIUM' : 'LOW'
    });
  }
}

module.exports = AIEvaluator;