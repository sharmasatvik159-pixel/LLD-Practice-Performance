const { Evaluation, EvaluatorType } = require("./Evaluation");

const evaluation = new Evaluation({
    id: "evaluation-001",
    attemptId: "attempt-001",
    evaluatorType: EvaluatorType.RULE_BASED,
    overallScore: 0,
    feedbackItems: []
});

console.log("Initial evaluation:");
console.log(evaluation.toJSON());

evaluation.addFeedback({
    criterionId: "requirement-understanding",
    score: 8,
    toJSON() {
        return {
            criterionId: this.criterionId,
            score: this.score
        };
    }
});

evaluation.addFeedback({
    criterionId: "class-responsibilities",
    score: 7,
    toJSON() {
        return {
            criterionId: this.criterionId,
            score: this.score
        };
    }
});

evaluation.addFeedback({
    criterionId: "coupling-cohesion",
    score: 6,
    toJSON() {
        return {
            criterionId: this.criterionId,
            score: this.score
        };
    }
});

const score = evaluation.calculateOverallScore();

console.log("\nCalculated overall score:");
console.log(score);

evaluation.complete();

console.log("\nCompleted evaluation:");
console.log(evaluation.toJSON());