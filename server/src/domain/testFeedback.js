const Feedback = require("./Feedback");

const feedback = new Feedback({
    criterionId: "class-responsibilities",
    score: 8,
    evidence: "Classes have clearly separated responsibilities.",
    concern: "Some responsibilities could be further isolated.",
    suggestion: "Consider extracting the payment logic into a separate service.",
    confidence: "HIGH"
});

console.log("Feedback:");
console.log(feedback.toJSON());