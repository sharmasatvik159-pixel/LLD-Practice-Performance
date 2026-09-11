const { Attempt } = require("./Attempt");

const attempt = new Attempt({
    id: "attempt-001",
    problemId: "parking-lot"
});

console.log("Initial:");
console.log(attempt.toJSON());

attempt.submit("submission-001");

console.log("\nAfter submission:");
console.log(attempt.toJSON());

attempt.startEvaluation();

console.log("\nDuring evaluation:");
console.log(attempt.toJSON());

attempt.complete("evaluation-001");

console.log("\nAfter completion:");
console.log(attempt.toJSON());