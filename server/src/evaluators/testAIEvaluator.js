'use strict';

const AIEvaluator = require('./AIEvaluator');
const { TextSubmission } = require('../domain/Submission');

const evaluator = new AIEvaluator();

const submission = new TextSubmission({
    id: 'submission-ai-001',
    attemptId: 'attempt-ai-001',

    requirements:
        'The parking lot should support cars, bikes, multiple floors, and parking availability.',

    assumptions:
        'Each vehicle requires a compatible parking spot.',

    classes:
        'ParkingLot, ParkingFloor, ParkingSpot, Vehicle, Ticket.',

    responsibilities:
        'ParkingLot manages floors. ParkingFloor manages parking spots. ParkingSpot manages occupancy. Ticket stores parking details.',

    relationships:
        'ParkingLot contains multiple ParkingFloor objects. Each floor contains multiple ParkingSpot objects.',

    designDecisions:
        'Use interfaces and separate services so that new vehicle types can be added without changing existing classes.',

    edgeCases:
        'Handle a full parking lot, invalid vehicle types, unavailable spots, and duplicate parking attempts.'
});

const evaluation = evaluator.evaluate({
    attemptId: 'attempt-ai-001',
    submission
});

console.log('Evaluator type:');
console.log(evaluator.getType());

console.log('\nEvaluation:');
console.log(JSON.stringify(evaluation.toJSON(), null, 2));

console.log('\nOverall score:');
console.log(evaluation.overallScore);