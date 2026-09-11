'use strict';

const express                                          = require('express');
const { createAttempt, getAttempt, getAllAttempts }    = require('../controllers/attemptController');
const { saveDraft }                                    = require('../controllers/submissionController');
const { evaluateAttempt }                              = require('../controllers/evaluationController');

const router = express.Router();

router.post('/',                               createAttempt);  // POST /api/attempts
router.get('/',                                getAllAttempts);  // GET  /api/attempts
router.get('/:id',                             getAttempt);     // GET  /api/attempts/:id
router.post('/:attemptId/submission',          saveDraft);      // POST /api/attempts/:attemptId/submission
router.post('/:attemptId/evaluate',            evaluateAttempt); // POST /api/attempts/:attemptId/evaluate

module.exports = router;
