# Low-Level Design (LLD) Specification

## Design Patterns Applied

### 1. Strategy Pattern (Evaluators)
- **Interface/Base**: `Evaluator` (`getType()`, `evaluate({ attemptId, submission })`)
- **Concrete Strategies**: `RuleBasedEvaluator` and `AIEvaluator`
- **Context**: `EvaluationService` manages a registry (`Map<string, Evaluator>`) and delegates execution dynamically based on caller preference.
- **Benefit**: New evaluators (e.g., OpenAI GPT-4, Claude, Custom AST analyzers) can be plugged in without modifying existing evaluation code (Open-Closed Principle).

### 2. State Machine Pattern (Attempt Lifecycle)
- **Model**: `Attempt` domain entity with `AttemptStatus` enum (`DRAFT`, `SUBMITTED`, `EVALUATING`, `COMPLETED`).
- **Encapsulation**: State transitions are strictly governed by domain methods (`submit()`, `evaluate()`, `complete()`), raising informative domain exceptions on invalid transitions.

### 3. Template / Inheritance (Submission)
- **Base Class**: `Submission` defines abstract interface and common metadata (`id`, `attemptId`, `createdAt`, `updatedAt`). Direct instantiation is forbidden.
- **Concrete Class**: `TextSubmission` captures the 7 structured LLD input fields.
- **Future Extension**: Allows easily adding `DiagramSubmission`, `CodeSubmission`, or `MultiFileSubmission` without breaking the evaluation contract.

### 4. Dependency Injection (Services)
- `PracticeService` requires `problemService` injected in its constructor:
  ```javascript
  const problemService = new ProblemService();
  const practiceService = new PracticeService(problemService);
  ```
- Decouples services, enables mock injection for unit testing, and ensures clean boundaries.

---

## Domain Model Class Diagram

```
+------------------------------------+
|              Problem               |
+------------------------------------+
| - id: string                       |
| - title: string                    |
| - description: string              |
| - difficulty: Difficulty           |
| - requirements: string[]           |
+------------------------------------+
| + toJSON(): object                 |
+------------------------------------+
                  ^
                  | references (problemId)
+------------------------------------+
|              Attempt               |
+------------------------------------+
| - id: string                       |
| - problemId: string                |
| - userId: string                   |
| - status: AttemptStatus            |
| - submissionId: string?            |
| - evaluationId: string?            |
| - createdAt: Date                  |
| - submittedAt: Date?               |
| - completedAt: Date?               |
| - submission: Submission?          |
| - evaluation: Evaluation?          |
+------------------------------------+
| + submit(submissionId): void       |
| + evaluate(): void                 |
| + complete(evaluationId): void     |
| + toJSON(): object                 |
+------------------------------------+
         |                      |
         v holds                v holds
+----------------------+   +------------------------------------+
|    TextSubmission    |   |             Evaluation             |
+----------------------+   +------------------------------------+
| - id: string         |   | - id: string                       |
| - attemptId: string  |   | - attemptId: string                |
| - requirements: text |   | - evaluatorType: EvaluatorType     |
| - assumptions: text  |   | - overallScore: number             |
| - classes: text      |   | - feedbackItems: Feedback[]        |
| - responsibilities: t|   | - evaluatedAt: Date                |
| - relationships: text|   +------------------------------------+
| - designDecisions: t |   | + calculateOverallScore(): number  |
| - edgeCases: text    |   | + complete(): void                 |
+----------------------+   +------------------------------------+
                                            |
                                            v 1..* contains
                                   +-------------------+
                                   |     Feedback      |
                                   +-------------------+
                                   | - criterionId: str|
                                   | - score: number   |
                                   | - evidence: string|
                                   | - concern: string |
                                   | - suggestion: str |
                                   | - confidence: str |
                                   +-------------------+
```

---

## SOLID Principles Mapping

- **Single Responsibility Principle (SRP)**:
  - `ProblemService`: Only stores and searches problem definitions.
  - `PracticeService`: Only manages attempts and coordinates lifecycle.
  - `EvaluationService`: Only routes evaluation requests to evaluators.
  - `RuleBasedEvaluator` / `AIEvaluator`: Only compute feedback according to their specific strategy.

- **Open/Closed Principle (OCP)**:
  - Adding new evaluators requires zero edits to existing evaluator classes; register via `evaluationService.registerEvaluator(type, evaluator)`.

- **Liskov Substitution Principle (LSP)**:
  - Any `Evaluator` subclass can be used anywhere an `Evaluator` is expected.
  - `TextSubmission` satisfies all contracts defined on `Submission`.

- **Interface Segregation Principle (ISP)**:
  - Domain entities expose focused, dedicated methods (`submit()`, `evaluate()`, `complete()`) rather than large monolithic update interfaces.

- **Dependency Inversion Principle (DIP)**:
  - `PracticeService` relies on abstract service dependencies passed into its constructor, not hardcoded singletons.
