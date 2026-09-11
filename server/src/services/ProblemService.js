'use strict';

class ProblemService {
  constructor() {
    this.problems = new Map();
  }

  addProblem(problem) {
    if (!problem) {
      throw new Error('ProblemService: problem is required.');
    }

    this.problems.set(problem.id, problem);

    return problem;
  }

  getProblem(problemId) {
    const problem = this.problems.get(problemId);

    if (!problem) {
      throw new Error(
        `ProblemService: problem "${problemId}" not found.`
      );
    }

    return problem;
  }

  getAllProblems() {
    return Array.from(this.problems.values());
  }
}

module.exports = ProblemService;