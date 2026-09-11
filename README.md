# LLD Practice Platform

A full-stack interactive platform for practicing **Low-Level Design (LLD)** and **Object-Oriented Design (OOD)** problems. Formulate real-world design solutions, justify architectural decisions, and receive instant, structured feedback across an 8-criterion rubric using both **Rule-Based** and **AI Evaluator** engines.

---

## Key Features

- **Real-World LLD Problems**: Practice classic system design problems with distinct difficulty tiers:
  - 🅿️ **Parking Lot** (*Medium*) — Multi-vehicle allocation, multi-floor layout, capacity handling.
  - 🥤 **Vending Machine** (*Medium*) — State transitions, inventory management, payment & change calculation.
  - 🛗 **Elevator System** (*Hard*) — Dispatching algorithms (LOOK/SCAN), concurrent floor requests, capacity limits.
  - 📚 **Library Management** (*Easy*) — Catalog search, membership loans, returns, and reservation workflows.
- **Dual Evaluation Engines (Strategy Pattern)**:
  - **Rule-Based Evaluator**: Rapid rubric compliance check across every structural section.
  - **AI Evaluator**: Deeper heuristic review analyzing architectural cohesion, design trade-offs, and pattern applicability.
- **8 Rubric Criteria**:
  1. Requirement Understanding
  2. Class Responsibilities (SRP)
  3. Coupling & Cohesion
  4. Encapsulation & Interfaces
  5. Abstraction & Design Patterns
  6. Extensibility (OCP)
  7. Edge Cases & Testability
  8. Explanation Quality
- **Deterministic State Machine**: Strictly enforces the attempt lifecycle: `DRAFT` → `SUBMITTED` → `EVALUATING` → `COMPLETED`.
- **Attempt History & Retries**: Review past attempts, scores, and evaluations with timestamps to track design improvement over time.
- **Modern Minimalist UI**: Clean typography (Inter font), responsive layout, color-coded score badges, and intuitive field guides.

---

## Architecture & Design Patterns

- **Strategy Pattern**: Pluggable evaluation algorithms via `EvaluationService` and `Evaluator` strategies.
- **Finite State Machine (FSM)**: Guarded transitions inside the `Attempt` domain model.
- **Template Method / Inheritance**: Abstract `Submission` parent class with `TextSubmission` specialization.
- **Dependency Injection**: `ProblemService` injected into `PracticeService` for decoupling and testability.

For detailed architecture diagrams and design specifications:
- [Architecture Documentation](docs/ARCHITECTURE.md)
- [Low-Level Design (LLD) Document](docs/LLD_DESIGN.md)
- [REST API Specification](docs/API_SPECIFICATION.md)

---

## Tech Stack

- **Frontend**: React 18, Vite, React Router DOM v6, Vanilla CSS (Design Tokens, Responsive Grid/Flexbox)
- **Backend**: Node.js, Express.js (Clean Architecture / Domain-Driven Design)
- **Testing**: Native Node.js test runner with unit tests and end-to-end integration tests

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (bundled with Node.js)

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/lld-practice-platform.git
cd "LLD Practice Platform"
```

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```
The backend API server starts at `http://localhost:5000`.

### 3. Frontend Setup
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
The client app starts at `http://localhost:5173`.

---

## Running Tests

Run the complete test suite (10 unit tests + end-to-end API tests covering all 4 problems and error cases):
```bash
cd server
npm test
```

Expected output:
```
========================================
RUNNING LLD PRACTICE PLATFORM TEST SUITE
========================================

--- 1. Executing Domain & Service Unit Tests ---
  ✓ PASSED: src/domain/testAttempt.js
  ✓ PASSED: src/domain/testEvaluation.js
  ✓ PASSED: src/domain/testFeedback.js
  ✓ PASSED: src/domain/testProblem.js
  ✓ PASSED: src/domain/testRubric.js
  ✓ PASSED: src/domain/testSubmission.js
  ✓ PASSED: src/evaluators/testAIEvaluator.js
  ✓ PASSED: src/evaluators/testRuleBasedEvaluator.js
  ✓ PASSED: src/services/testEvaluationService.js
  ✓ PASSED: src/services/testPracticeService.js

--- 2. Executing End-to-End API Integration Tests ---
  ✓ GET /api/health passed
  ✓ GET /api/problems returned 4 problems
  ✓ GET /api/problems/:id verified for all 4 problems
  ✓ Flow 1 (parking-lot + RULE_BASED): DRAFT → SUBMITTED → EVALUATING → COMPLETED with 8 criteria
  ✓ Flow 2 (vending-machine + AI): DRAFT → SUBMITTED → EVALUATING → COMPLETED with 8 criteria
  ✓ Flow 3 (elevator-system + RULE_BASED): completed with 8 criteria
  ✓ Flow 4 (library-management + AI): completed with 8 criteria
  ✓ GET /api/practice/problems/:id/attempts returned attempts with history
  ✓ GET /api/practice/attempts/:id verified

--- 3. Testing Error Cases ---
  ✓ Non-existent problem ID rejected (400)
  ✓ Non-existent attempt submission rejected (400)
  ✓ Non-existent attempt fetch rejected (404)
  ✓ Unknown route returns 404
  ✓ State machine protection: cannot re-submit COMPLETED attempt (400)

========================================
✓ ALL TESTS & SCENARIOS PASSED 100%!
========================================
```

---

## Project Structure

```
LLD Practice Platform/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # ProblemsPage, PracticePage, ResultPage, HistoryPage
│   │   ├── services/           # API client service
│   │   ├── App.jsx             # Router and layout configuration
│   │   └── app.css             # Unified styling and design tokens
│   ├── index.html              # HTML shell with Google Fonts
│   └── package.json
├── server/                     # Express.js Backend
│   ├── src/
│   │   ├── domain/             # Domain entities (Problem, Attempt, Submission, Rubric, Evaluation)
│   │   ├── evaluators/         # Strategy evaluators (RuleBasedEvaluator, AIEvaluator)
│   │   ├── services/           # Application services (ProblemService, PracticeService, EvaluationService)
│   │   └── server.js           # Express app & route definitions
│   ├── testRunner.js           # Complete test suite runner
│   └── package.json
├── docs/                       # Architecture & Design Documentation
│   ├── ARCHITECTURE.md         # High-level architecture & pipeline
│   ├── LLD_DESIGN.md           # OOP patterns, SOLID mapping & class diagram
│   └── API_SPECIFICATION.md    # REST API documentation
├── .gitignore                  # Git ignore rules
└── README.md                   # Project overview and setup guide
```

---

## License
MIT License.
