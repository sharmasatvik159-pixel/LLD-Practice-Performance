'use strict';

const express                            = require('express');
const { getAllProblems, getProblemById } = require('../controllers/problemController');
const { getAttemptHistory }              = require('../controllers/attemptController');

const router = express.Router();

router.get('/',      getAllProblems);   // GET /api/problems
router.get('/:id',   getProblemById);  // GET /api/problems/:id
router.get('/:problemId/attempts', getAttemptHistory); // GET /api/problems/:problemId/attempts

module.exports = router;
