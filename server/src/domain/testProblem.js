const { Problem } = require("./Problem");

const problem = new Problem({
    id: "parking-lot",
    title: "Parking Lot",
    description: "Design a parking lot system.",
    difficulty: "Medium",
    requirements: [
        "Support multiple vehicle types",
        "Assign suitable parking spots",
        "Calculate parking fees"
    ]
});

console.log(problem.getDetails());

console.log("\nRequirements:");
console.log(problem.getRequirements());