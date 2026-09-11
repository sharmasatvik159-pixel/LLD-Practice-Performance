'use strict';

const { Attempt, AttemptStatus } = require('../domain/Attempt');

class PracticeService {
    constructor(problemService) {
        if (!problemService) {
            throw new Error('PracticeService: problemService is required.');
        }
        this.problemService = problemService;
        this.attempts = new Map();
    }

    startAttempt(problemId, userId = 'anonymous') {
        // Validate problem exists via injected service (throws if missing)
        this.problemService.getProblem(problemId);

        const attempt = new Attempt({
            id: `attempt-${Date.now()}`,
            problemId,
            userId
        });

        this.attempts.set(attempt.id, attempt);
        return attempt;
    }

    getAttempt(attemptId) {
        const attempt = this.attempts.get(attemptId);
        if (!attempt) {
            throw new Error(`PracticeService: attempt "${attemptId}" not found.`);
        }
        return attempt;
    }

    submitAttempt(attemptId, submission) {
        const attempt = this.getAttempt(attemptId);
        if (!submission) {
            throw new Error('PracticeService: submission is required.');
        }

        attempt.submit(submission.id);   // pass the ID string, not the object
        attempt.submission = submission;  // store full object for API responses
        return attempt;
    }

    evaluateAttempt(attemptId) {
        const attempt = this.getAttempt(attemptId);
        attempt.startEvaluation();       // SUBMITTED → EVALUATING
        return attempt;
    }

    completeAttempt(attemptId, evaluation) {
        const attempt = this.getAttempt(attemptId);
        if (!evaluation) {
            throw new Error('PracticeService: evaluation is required.');
        }

        attempt.complete(evaluation.id);  // pass the ID string, not the object
        attempt.evaluation = evaluation;  // store full object for API responses
        return attempt;
    }

    getAttemptsByProblem(problemId) {
        return [...this.attempts.values()]
            .filter((a) => a.problemId === problemId)
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    getAttemptsByUser(userId) {
        return Array.from(this.attempts.values()).filter(
            (attempt) => attempt.userId === userId
        );
    }
}

module.exports = PracticeService;