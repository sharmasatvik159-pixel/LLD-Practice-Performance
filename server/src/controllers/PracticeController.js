'use strict';

const { TextSubmission } = require('../domain/Submission');
const { EvaluatorType } = require('../domain/Evaluation');

class PracticeController {
    constructor(practiceService, evaluationService) {
        this.practiceService = practiceService;
        this.evaluationService = evaluationService;
    }

    startAttempt(req, res) {
        try {
            const { problemId } = req.params;
            const { userId } = req.body;

            const attempt = this.practiceService.startAttempt(
                problemId,
                userId || 'anonymous'
            );

            res.status(201).json({
                success: true,
                data: attempt
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    submitAttempt(req, res) {
        try {
            const { attemptId } = req.params;

            const submission = new TextSubmission({
                id: `submission-${Date.now()}`,
                attemptId,

                requirements: req.body.requirements,
                assumptions: req.body.assumptions,
                classes: req.body.classes,
                responsibilities: req.body.responsibilities,
                relationships: req.body.relationships,
                designDecisions: req.body.designDecisions,
                edgeCases: req.body.edgeCases
            });

            const attempt = this.practiceService.submitAttempt(
                attemptId,
                submission
            );

            const evaluation = this.evaluationService.evaluate(
                EvaluatorType.RULE_BASED,
                {
                    attemptId,
                    submission
                }
            );

            this.practiceService.completeAttempt(
                attemptId,
                evaluation
            );

            res.json({
                success: true,
                data: {
                    attempt,
                    evaluation
                }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    getAttempt(req, res) {
        try {
            const attempt = this.practiceService.getAttempt(
                req.params.attemptId
            );

            res.json({
                success: true,
                data: attempt
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = PracticeController;