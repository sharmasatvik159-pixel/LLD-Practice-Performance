'use strict';

class ProblemController {
  constructor(problemService) {
    this.problemService = problemService;
  }

  getAllProblems(req, res) {
    try {
      const problems = this.problemService.getAllProblems();

      res.json({
        success: true,
        data: problems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  getProblem(req, res) {
    try {
      const problem = this.problemService.getProblem(
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
  }
}

module.exports = ProblemController;