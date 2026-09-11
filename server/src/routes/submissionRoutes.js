'use strict';

const express                                    = require('express');
const { getSubmission, updateSubmission }        = require('../controllers/submissionController');

const router = express.Router();

router.get('/:id',    getSubmission);     // GET   /api/submissions/:id
router.patch('/:id',  updateSubmission);  // PATCH /api/submissions/:id

module.exports = router;
