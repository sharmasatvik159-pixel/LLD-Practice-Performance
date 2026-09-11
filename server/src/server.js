'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { Problem, Difficulty } = require('./domain/Problem');
const { TextSubmission } = require('./domain/Submission');

const PracticeService = require('./services/PracticeService');
const ProblemService = require('./services/ProblemService');
const EvaluationService = require('./services/EvaluationService');

const RuleBasedEvaluator = require('./evaluators/RuleBasedEvaluator');
const AIEvaluator = require('./evaluators/AIEvaluator');

const app = express();

app.use(cors());
app.use(express.json());

/*
 * SERVICES
 */

const problemService = new ProblemService();
const practiceService = new PracticeService(problemService);
const evaluationService = new EvaluationService();

/*
 * EVALUATORS
 */

const ruleBasedEvaluator = new RuleBasedEvaluator();
const aiEvaluator = new AIEvaluator();

evaluationService.registerEvaluator(
  ruleBasedEvaluator.getType(),
  ruleBasedEvaluator
);

evaluationService.registerEvaluator(
  aiEvaluator.getType(),
  aiEvaluator
);

/*
 * PROBLEMS
 */

const problems = [
  new Problem({
    id: 'parking-lot',
    title: 'Parking Lot',
    description:
      'Design a parking lot system using object-oriented design principles.',
    difficulty: Difficulty.MEDIUM,
    requirements: [
      'Support multiple vehicle types.',
      'Support multiple parking floors.',
      'Assign available parking spots.',
      'Handle a full parking lot.'
    ]
  }),

  new Problem({
    id: 'vending-machine',
    title: 'Vending Machine',
    description:
      'Design a vending machine capable of managing products and payments.',
    difficulty: Difficulty.MEDIUM,
    requirements: [
      'Display products.',
      'Accept payments.',
      'Dispense products.',
      'Return change.',
      'Handle unavailable products.'
    ]
  }),

  new Problem({
    id: 'elevator-system',
    title: 'Elevator System',
    description:
      'Design an elevator system for a multi-floor building.',
    difficulty: Difficulty.HARD,
    requirements: [
      'Support multiple elevators.',
      'Accept floor requests.',
      'Move elevators between floors.',
      'Handle elevator capacity.'
    ]
  }),

  new Problem({
    id: 'library-management',
    title: 'Library Management',
    description:
      'Design a library management system for books and members.',
    difficulty: Difficulty.EASY,
    requirements: [
      'Manage books.',
      'Manage members.',
      'Issue books.',
      'Return books.',
      'Track availability.'
    ]
  })
];

problems.forEach((problem) => {
  problemService.addProblem(problem);
});

/*
 * HEALTH CHECK
 */

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'LLD Practice Platform API is running'
  });
});

/*
 * PROBLEM ROUTES
 */

// Get all problems
app.get('/api/problems', (req, res) => {
  try {
    const allProblems = problemService.getAllProblems();

    res.json({
      success: true,
      data: allProblems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get one problem
app.get('/api/problems/:problemId', (req, res) => {
  try {
    const problem = problemService.getProblem(
      req.params.problemId
    );

    res.json({
      success: true,
      data: problem
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

/*
 * PRACTICE ROUTES
 */

// Start an attempt
app.post(
  '/api/practice/problems/:problemId/attempts',
  (req, res) => {
    try {
      const { problemId } = req.params;
      const { userId } = req.body;

      const attempt = practiceService.startAttempt(
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
);

// Submit an attempt — full pipeline: submit → evaluate → complete
app.post(
  '/api/practice/attempts/:attemptId/submission',
  (req, res) => {
    try {
      const { attemptId } = req.params;

      // Build a proper TextSubmission domain object
      const submission = new TextSubmission({
        id: `submission-${Date.now()}`,
        attemptId,
        requirements:     req.body.requirements     || '',
        assumptions:      req.body.assumptions      || '',
        classes:          req.body.classes           || '',
        responsibilities: req.body.responsibilities || '',
        relationships:    req.body.relationships     || '',
        designDecisions:  req.body.designDecisions   || '',
        edgeCases:        req.body.edgeCases         || ''
      });

      // DRAFT → SUBMITTED
      practiceService.submitAttempt(attemptId, submission);

      // SUBMITTED → EVALUATING
      practiceService.evaluateAttempt(attemptId);

      // Run the evaluator (supports RULE_BASED or AI)
      const requestedEvaluator = (req.body.evaluatorType || 'RULE_BASED').toUpperCase();
      const evaluatorType = requestedEvaluator === 'AI' ? 'AI' : 'RULE_BASED';

      const evaluation = evaluationService.evaluate(
        evaluatorType,
        { attemptId, submission }
      );

      // EVALUATING → COMPLETED
      practiceService.completeAttempt(attemptId, evaluation);

      // Return the fully-populated attempt
      const attempt = practiceService.getAttempt(attemptId);

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
);

// Get an attempt (includes embedded evaluation + submission)
app.get(
  '/api/practice/attempts/:attemptId',
  (req, res) => {
    try {
      const attempt = practiceService.getAttempt(
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
);

// Get attempt history for a problem
app.get(
  '/api/practice/problems/:problemId/attempts',
  (req, res) => {
    try {
      const attempts = practiceService.getAttemptsByProblem(
        req.params.problemId
      );

      res.json({
        success: true,
        data: attempts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

/*
 * 404 HANDLER
 */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/*
 * START SERVER
 */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});