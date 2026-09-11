'use strict';

const Evaluator = require('./Evaluator');
const { Evaluation, EvaluatorType } = require('../domain/Evaluation');
const Feedback = require('../domain/Feedback');

class RuleBasedEvaluator extends Evaluator {
  constructor() {
    super(EvaluatorType.RULE_BASED);
  }

  evaluate({ attemptId, submission }) {
    if (!attemptId || !submission) {
      throw new Error(
        'RuleBasedEvaluator: attemptId and submission are required.'
      );
    }

    const feedbackItems = [];

    feedbackItems.push(
      this.evaluateField(
        'requirement-understanding',
        submission.requirements,
        'Clearly identifies the system requirements.'
      )
    );

    feedbackItems.push(
      this.evaluateField(
        'class-responsibilities',
        submission.responsibilities,
        'Clearly defines responsibilities for each class.'
      )
    );

    feedbackItems.push(
      this.evaluateField(
        'coupling-cohesion',
        submission.relationships,
        'Explains relationships between classes.'
      )
    );

    feedbackItems.push(
      this.evaluateField(
        'encapsulation-interfaces',
        submission.classes,
        'Identifies classes and their structure.'
      )
    );

    feedbackItems.push(
      this.evaluateField(
        'abstraction-patterns',
        submission.designDecisions,
        'Explains abstraction and design decisions.'
      )
    );

    feedbackItems.push(
      this.evaluateField(
        'extensibility',
        submission.designDecisions,
        'Considers how the design can be extended.'
      )
    );

    feedbackItems.push(
      this.evaluateField(
        'edge-cases-testability',
        submission.edgeCases,
        'Identifies edge cases and testing considerations.'
      )
    );

    feedbackItems.push(
      this.evaluateField(
        'explanation-quality',
        submission.assumptions,
        'Provides clear assumptions supporting the design.'
      )
    );

    const evaluation = new Evaluation({
      id: `evaluation-${Date.now()}`,
      attemptId,
      evaluatorType: EvaluatorType.RULE_BASED,
      overallScore: 0,
      feedbackItems
    });

    evaluation.calculateOverallScore();

    evaluation.complete();

    return evaluation;
  }

  evaluateField(criterionId, value, positiveMessage) {
    const hasContent =
      value !== undefined &&
      value !== null &&
      String(value).trim().length > 0;

    const score = hasContent ? 8 : 3;

    return new Feedback({
      criterionId,
      score,
      evidence: hasContent
        ? `Submission contains information for ${criterionId}.`
        : `Submission does not contain enough information for ${criterionId}.`,
      concern: hasContent
        ? 'No major issue detected by the rule-based evaluator.'
        : 'The submitted section is empty or insufficient.',
      suggestion: hasContent
        ? positiveMessage
        : `Add a clear explanation for ${criterionId}.`,
      confidence: hasContent ? 'HIGH' : 'MEDIUM'
    });
  }
}

module.exports = RuleBasedEvaluator;