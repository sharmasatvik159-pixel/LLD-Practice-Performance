'use strict';

const RuleBasedEvaluator = require('./RuleBasedEvaluator');
const { TextSubmission } = require('../domain/Submission');

const evaluator = new RuleBasedEvaluator();

const submission = new TextSubmission({
    id: 'submission-001',
    attemptId: 'attempt-001',

    requirements: 'The parking lot should support multiple vehicle types.',

    assumptions: 'One parking lot can contain multiple floors.',

    classes: 'ParkingLot, ParkingFloor, ParkingSpot, Vehicle, Ticket.',

    responsibilities:
        'ParkingLot manages floors. ParkingFloor manages parking spots. Ticket stores parking information.',

    relationships:
        'ParkingLot has many ParkingFloor objects. ParkingFloor has many ParkingSpot objects.',

    designDecisions:
        'Use interfaces for vehicle-specific parking strategies and keep responsibilities separated.',

    edgeCases:
        'Handle a full parking lot, invalid vehicle type, and unavailable parking spots.'
});

const evaluation = evaluator.evaluate({
    attemptId: 'attempt-001',
    submission
});

console.log('Evaluator type:');
console.log(evaluator.getType());

console.log('\nEvaluation:');
console.log(JSON.stringify(evaluation.toJSON(), null, 2));

console.log('\nOverall score:');
console.log(evaluation.overallScore);