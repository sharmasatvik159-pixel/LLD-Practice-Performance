'use strict';

const EvaluationService = require('./EvaluationService');
const RuleBasedEvaluator = require('../evaluators/RuleBasedEvaluator');
const { TextSubmission } = require('../domain/Submission');
const { EvaluatorType } = require('../domain/Evaluation');

const service = new EvaluationService();

const evaluator = new RuleBasedEvaluator();

service.registerEvaluator(
    EvaluatorType.RULE_BASED,
    evaluator
);

const submission = new TextSubmission({
    id: 'submission-service-001',
    attemptId: 'attempt-service-001',

    requirements:
        'The system should support multiple vehicle types.',

    assumptions:
        'Each vehicle requires a suitable parking spot.',

    classes:
        'ParkingLot, ParkingFloor, ParkingSpot, Vehicle, Ticket.',

    responsibilities:
        'ParkingLot manages floors. ParkingFloor manages spots.',

    relationships:
        'ParkingLot contains ParkingFloor objects.',

    designDecisions:
        'Use interfaces to support different vehicle types.',

    edgeCases:
        'Handle a full parking lot and invalid vehicle types.'
});

const evaluation = service.evaluate(
    EvaluatorType.RULE_BASED,
    {
        attemptId: 'attempt-service-001',
        submission
    }
);

console.log('Evaluation service test:');
console.log(JSON.stringify(evaluation.toJSON(), null, 2));

console.log('\nOverall score:');
console.log(evaluation.overallScore);