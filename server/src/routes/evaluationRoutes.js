'use strict';

const express                                          = require('express');
const { getEvaluation, getFeedbackSummary }            = require('../controllers/evaluationController');

const router = express.Router();

router.get('/:id',           getEvaluation);      // GET /api/evaluations/:id
router.get('/:id/feedback',  getFeedbackSummary); // GET /api/evaluations/:id/feedback

module.exports = router;
