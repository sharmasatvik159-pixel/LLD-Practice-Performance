'use strict';

const express = require('express');

function createPracticeRoutes(practiceController) {
    const router = express.Router();

    router.post(
        '/problems/:problemId/attempts',
        practiceController.startAttempt.bind(practiceController)
    );

    router.post(
        '/attempts/:attemptId/submission',
        practiceController.submitAttempt.bind(practiceController)
    );

    router.get(
        '/attempts/:attemptId',
        practiceController.getAttempt.bind(practiceController)
    );

    return router;
}

module.exports = createPracticeRoutes;