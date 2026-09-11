const { TextSubmission } = require("./Submission");

// ─── Create ──────────────────────────────────────────────────────────────────

const submission = new TextSubmission({
    id: "submission-001",
    attemptId: "attempt-001",
    requirements: "System should support multiple vehicle types.",
    assumptions: "Parking lot has a fixed number of parking spots.",
    classes: "ParkingLot, Vehicle, ParkingSpot, Ticket",
    responsibilities: "ParkingLot manages parking spots.",
    relationships: "ParkingLot has many ParkingSpot objects.",
    designDecisions: "Use Strategy Pattern for parking allocation.",
    edgeCases: "Parking lot is full."
});

console.log("Initial submission:");
console.log(submission.toJSON());

// ─── Partial update ──────────────────────────────────────────────────────────

submission.updateContent({
    classes: "ParkingLot, Vehicle, ParkingSpot, Ticket, Payment",
    edgeCases: "Parking lot is full. Invalid vehicle type."
});

console.log("\nUpdated submission:");
console.log(submission.toJSON());

// ─── Verify abstract base cannot be instantiated ────────────────────────────

const { Submission } = require("./Submission");

try {
    new Submission({ id: "x", attemptId: "y" });
    console.log("\n✗ Abstract check FAILED — Submission was instantiated.");
} catch (err) {
    console.log("\n✓ Abstract check PASSED — " + err.message);
}