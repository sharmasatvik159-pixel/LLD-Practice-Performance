'use strict';

const PracticeService = require('./PracticeService');
const ProblemService = require('./ProblemService');
const { Problem, Difficulty } = require('../domain/Problem');
const { TextSubmission } = require('../domain/Submission');

const problemService = new ProblemService();
const practiceService = new PracticeService(problemService);

const problem = new Problem({
    id: 'parking-lot',
    title: 'Parking Lot',
    description: 'Design a parking lot system using object-oriented principles.',
    difficulty: Difficulty.MEDIUM,
    requirements: [
        'Support multiple vehicle types.',
        'Support multiple parking floors.',
        'Assign available parking spots.',
        'Handle a full parking lot.'
    ]
});

problemService.addProblem(problem);

console.log('Problem added:');
console.log(problemService.getProblem('parking-lot').toJSON());

const attempt = practiceService.startAttempt('parking-lot', 'user-001');
console.log('\nAttempt started:');
console.log(attempt.toJSON());

const submission = new TextSubmission({
    id: 'sub-001',
    attemptId: attempt.id,
    requirements: 'Vehicles, spots',
    classes: 'ParkingLot, Spot'
});

practiceService.submitAttempt(attempt.id, submission);
console.log('\nAttempt submitted:');
console.log(practiceService.getAttempt(attempt.id).toJSON());

practiceService.evaluateAttempt(attempt.id);
console.log('\nAttempt evaluating:');
console.log(practiceService.getAttempt(attempt.id).toJSON());

const mockEvaluation = {
    id: 'eval-001',
    attemptId: attempt.id,
    overallScore: 85,
    feedbackItems: []
};
practiceService.completeAttempt(attempt.id, mockEvaluation);
console.log('\nAttempt completed:');
console.log(practiceService.getAttempt(attempt.id).toJSON());

console.log('\nUser attempts:');
console.log(practiceService.getAttemptsByUser('user-001').map(a => a.toJSON()));