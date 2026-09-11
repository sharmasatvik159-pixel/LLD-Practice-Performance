const Rubric = require("./Rubric");

const rubric = new Rubric({
    id: "lLD-rubric-001",
    name: "LLD Evaluation Rubric",
    criteria: [
        {
            id: "requirement-understanding",
            name: "Requirement Understanding",
            description: "How well the learner understands the requirements.",
            maxScore: 10
        },
        {
            id: "class-responsibilities",
            name: "Class Responsibilities",
            description: "How clearly responsibilities are divided among classes.",
            maxScore: 10
        },
        {
            id: "coupling-cohesion",
            name: "Coupling & Cohesion",
            description: "How well the design manages coupling and cohesion.",
            maxScore: 10
        },
        {
            id: "encapsulation-interfaces",
            name: "Encapsulation & Interfaces",
            description: "How well the design protects data and defines interfaces.",
            maxScore: 10
        },
        {
            id: "abstraction-patterns",
            name: "Abstraction / Design Patterns",
            description: "Use of appropriate abstraction and design patterns.",
            maxScore: 10
        },
        {
            id: "extensibility",
            name: "Extensibility",
            description: "How easily the design can support future changes.",
            maxScore: 10
        },
        {
            id: "edge-cases-testability",
            name: "Edge Cases & Testability",
            description: "Handling of edge cases and ease of testing.",
            maxScore: 10
        },
        {
            id: "explanation-quality",
            name: "Explanation Quality",
            description: "Clarity and quality of the learner's explanation.",
            maxScore: 10
        }
    ]
});

console.log("Rubric:");
console.log(JSON.stringify(rubric.toJSON(), null, 2));

console.log("\nTotal criteria:");
console.log(rubric.getCriteria().length);

console.log("\nTesting getCriterion:");
console.log(rubric.getCriterion("extensibility"));