# System Architecture — LLD Practice Platform

## Overview
The **LLD Practice Platform** is an interactive, full-stack application designed to help software engineers practice Low-Level Design (LLD) and Object-Oriented Design (OOD) problems. Users formulate solutions by breaking down requirements, identifying classes and responsibilities, defining relationships, making design pattern choices, and addressing edge cases. The platform evaluates their submissions against an 8-criterion rubric using both **Rule-Based** and **AI Evaluator** engines.

---

## High-Level Architecture

```
+-------------------------------------------------------------------------+
|                               FRONTEND                                  |
|                 React 18 + Vite + React Router DOM                      |
|                                                                         |
|  [ProblemsPage]  -->  [PracticePage]  -->  [ResultPage]                 |
|         |                   |                                           |
|         +-------------------+---------->  [HistoryPage]                 |
+-------------------------------------------------------------------------+
                                    |
                            HTTP / REST API
                                    |
                                    v
+-------------------------------------------------------------------------+
|                                BACKEND                                  |
|                           Express.js Engine                             |
|                                                                         |
|  [Problem Routes]   [Practice Routes]   [Evaluation]   [Health Check]   |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                            SERVICE LAYER                                |
|  - ProblemService: Manages LLD problem catalog                          |
|  - PracticeService: Coordinates Attempt lifecycle and state transitions |
|  - EvaluationService: Pluggable evaluator registry & execution          |
+-------------------------------------------------------------------------+
                                    |
            +-----------------------+-----------------------+
            |                                               |
            v                                               v
+---------------------------+               +-----------------------------+
|     EVALUATOR ENGINES     |               |        DOMAIN MODELS        |
|  - RuleBasedEvaluator     |               |  - Problem & Difficulty     |
|  - AIEvaluator            |               |  - Attempt & State Machine  |
|  (Strategy Pattern)       |               |  - Submission (TextSub.)    |
|                           |               |  - Rubric & Criteria        |
|                           |               |  - Evaluation & Feedback    |
+---------------------------+               +-----------------------------+
```

---

## Attempt Lifecycle & State Machine

Every practice attempt follows a strict deterministic finite state machine (FSM) to ensure data integrity and prevent illegal transitions:

```
    +-----------+
    |   DRAFT   |  <--- Attempt initiated by user (POST /api/practice/problems/:id/attempts)
    +-----------+
          |
          | submit(submissionId)
          v
    +-----------+
    | SUBMITTED |  <--- User submits design solution
    +-----------+
          |
          | evaluate()
          v
    +------------+
    | EVALUATING |  <--- Evaluator pipeline begins processing
    +------------+
          |
          | complete(evaluationId)
          v
    +-----------+
    | COMPLETED |  <--- Evaluation finished with 8 rubric criteria and overall score
    +-----------+
```

### State Transition Invariants:
- **DRAFT**: Can only transition to `SUBMITTED`. Cannot be re-evaluated or completed directly.
- **SUBMITTED**: Can only transition to `EVALUATING`.
- **EVALUATING**: Can only transition to `COMPLETED`.
- **COMPLETED**: Terminal state. Re-submitting an already completed attempt is strictly rejected with an error.

---

## The 8 Rubric Criteria

Both Rule-Based and AI evaluators assess submissions across the standard 8 LLD criteria:

1. **Requirement Understanding** (`requirement-understanding`) — Clarity of functional and non-functional scope.
2. **Class Responsibilities** (`class-responsibilities`) — Application of Single Responsibility Principle (SRP).
3. **Coupling & Cohesion** (`coupling-cohesion`) — Separation of concerns and dependency management.
4. **Encapsulation & Interfaces** (`encapsulation-interfaces`) — Data hiding and contract-based design.
5. **Abstraction & Patterns** (`abstraction-patterns`) — Selection of appropriate GoF design patterns (Strategy, Factory, State, etc.).
6. **Extensibility** (`extensibility`) — Open-Closed Principle (OCP) and ease of introducing new requirements.
7. **Edge Cases & Testability** (`edge-cases-testability`) — Failure handling, concurrency, boundary conditions, and mockability.
8. **Explanation Quality** (`explanation-quality`) — Quality of reasoning, assumptions, and trade-off discussions.

---

## Evaluation Pipeline Details

1. **Client Submission**: The client sends the structured 7-part submission (`requirements`, `assumptions`, `classes`, `responsibilities`, `relationships`, `designDecisions`, `edgeCases`) along with the desired engine (`RULE_BASED` or `AI`).
2. **Validation**: The backend validates the attempt status and builds the `TextSubmission` domain entity.
3. **State Updates**: The attempt moves from `DRAFT` to `SUBMITTED`, then to `EVALUATING`.
4. **Strategy Execution**: `EvaluationService` invokes the requested evaluator strategy (`RuleBasedEvaluator` or `AIEvaluator`).
5. **Completion**: The attempt status transitions to `COMPLETED` with timestamp, overall score, and criterion breakdown.
