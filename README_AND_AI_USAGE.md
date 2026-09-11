# LLD Practice Platform — Master Documentation & AI Usage Report

**Author:** Satvik Sharma  
**Project:** LLD Practice Platform  
**Repository:** [https://github.com/sharmasatvik159-pixel/LLD-Practice-Performance](https://github.com/sharmasatvik159-pixel/LLD-Practice-Performance.git)  
**Status:** Completed MVP  

---

## Table of Contents
1. [Project Overview & Key Features](#1-project-overview--key-features)
2. [How to Run the Project](#2-how-to-run-the-project)
3. [Running Automated Tests](#3-running-automated-tests)
4. [Key Architectural Decisions](#4-key-architectural-decisions)
5. [Known Limitations & Future Roadmap](#5-known-limitations--future-roadmap)
6. [Comprehensive AI Usage Report](#6-comprehensive-ai-usage-report)

---

## 1. Project Overview & Key Features

The **LLD Practice Platform** is an interactive, full-stack application designed to help software engineers practice Low-Level Design (LLD) and Object-Oriented Design (OOD) problems. Candidates formulate real-world solutions, justify architectural decisions, and receive instant, structured feedback across an 8-criterion rubric using both **Rule-Based** and **AI Evaluator** engines.

### Key Features
- **Curated OOD Problems:**
  - 🅿️ **Parking Lot** (*Medium*) — Multi-vehicle allocation, multi-floor layout, capacity handling.
  - 🥤 **Vending Machine** (*Medium*) — State transitions, inventory management, payment & change calculation.
  - 🛗 **Elevator System** (*Hard*) — Dispatching algorithms (LOOK/SCAN), concurrent floor requests, capacity limits.
  - 📚 **Library Management** (*Easy*) — Catalog search, membership loans, returns, and reservation workflows.
- **Dual Evaluation Engines (Strategy Pattern):**
  - **Rule-Based Evaluator**: Rapid rubric compliance check across every structural section.
  - **AI Evaluator**: Deeper heuristic review analyzing architectural cohesion, design trade-offs, and pattern applicability.
- **8 Rubric Criteria:**
  1. *Requirement Understanding*
  2. *Class Responsibilities (SRP)*
  3. *Coupling & Cohesion*
  4. *Encapsulation & Interfaces*
  5. *Abstraction & Design Patterns*
  6. *Extensibility (OCP)*
  7. *Edge Cases & Testability*
  8. *Explanation Quality*
- **Deterministic State Machine:** Strictly enforces the attempt lifecycle: `DRAFT` &rarr; `SUBMITTED` &rarr; `EVALUATING` &rarr; `COMPLETED`.
- **Attempt History & Retries:** Review past attempts, scores, and evaluations with timestamps to track design improvement over time.
- **Modern Minimalist UI:** Responsive layout, color-coded score badges, and intuitive field guides.

---

## 2. How to Run the Project

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Installed and configured

### Step 1: Clone the Repository
```bash
git clone https://github.com/sharmasatvik159-pixel/LLD-Practice-Performance.git
cd LLD-Practice-Performance
```

### Step 2: Start the Backend Server
Open a terminal in the project root:
```bash
cd server
npm install
npm run dev
```
- The backend Express API starts on: **`http://localhost:5000`**
- Health check verification: `http://localhost:5000/api/health`

### Step 3: Start the Frontend Client
Open a second terminal window:
```bash
cd client
npm install
npm run dev
```
- The React + Vite client starts on: **`http://localhost:5173`**
- Open your browser and navigate to `http://localhost:5173` to browse problems, formulate designs, select an evaluator, and view instant feedback.

---

## 3. Running Automated Tests

The platform includes a test runner executing 10 domain unit tests, 4 end-to-end problem scenarios, and 5 error injection cases:

```bash
cd server
npm test
```

### Expected Test Output:
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
  ✓ GET /api/problems returned 4 problems (parking-lot, vending-machine, elevator-system, library-management)
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

## 4. Key Architectural Decisions

1. **Clean Architecture & Domain-Driven Design (DDD):**
   - Core domain models (`Problem`, `Attempt`, `Submission`, `Rubric`, `Evaluation`, `Feedback`) are implemented in pure JavaScript without third-party framework coupling.
   - Core business rules and validation reside strictly in the domain layer.

2. **Deterministic Finite State Machine (FSM):**
   - Attempts progress through: `DRAFT` &rarr; `SUBMITTED` &rarr; `EVALUATING` &rarr; `COMPLETED`.
   - Domain guards prevent out-of-order execution and enforce terminal state immutability (cannot alter completed evaluations).

3. **Strategy Pattern for Evaluators:**
   - Abstract `Evaluator` base class standardizes evaluation.
   - `RuleBasedEvaluator` and `AIEvaluator` implement concrete strategies.
   - `EvaluationService` manages the registry, enabling new evaluators (OpenAI GPT-4, Claude, custom AST parsers) to be added without modifying existing code (Open/Closed Principle).

4. **Structured 7-Field Input Schema:**
   - Instead of a single unstructured text box, candidates formulate designs across 7 distinct engineering areas (*Requirements, Assumptions, Classes, Responsibilities, Relationships, Decisions, and Edge Cases*).

5. **Constructor Dependency Injection:**
   - `PracticeService` explicitly receives `ProblemService` in its constructor (`new PracticeService(problemService)`), decoupling components and simplifying test mocks.

---

## 5. Known Limitations & Future Roadmap

| Limitation in Current MVP | Rationale in MVP | Production Roadmap Solution |
| :--- | :--- | :--- |
| **In-Memory Storage** | In-memory JavaScript `Map` structures enable zero-friction local setup without database installation. | Implement the Repository Pattern backed by PostgreSQL (with Prisma ORM) or MongoDB for durable persistence. |
| **Heuristic AI Engine** | Offline heuristic engine ensures 100% uptime, 0ms latency, and no external API key dependency. | Connect `AIEvaluator` to live LLM APIs (OpenAI / Anthropic / Gemini) using structured JSON output prompts with fallback to rule-based evaluation. |
| **Synchronous Execution** | MVP evaluation completes in <50ms, allowing immediate client response in a single HTTP cycle. | Move evaluation to an asynchronous job queue (BullMQ / Redis) with Server-Sent Events (SSE) or WebSockets for real-time progress updates. |
| **Textual Input Only** | Simplifies candidate input and standardizes rubric text extraction. | Add a drag-and-drop UML class diagram visualizer and Mermaid.js AST parser for automated relationship validation. |
| **Local / Anonymous User Scope** | Prioritized core design evaluation workflow over authentication overhead. | Integrate NextAuth / Clerk / Supabase Auth for multi-tenant candidate profiles and public shareable design portfolios. |

---

## 6. Comprehensive AI Usage Report

### Overview
This project was developed using human-AI pair programming workflows via advanced agentic AI coding assistants (DeepMind Antigravity / Gemini & Claude models). The collaboration adhered strictly to modern software engineering principles, rigorous test-driven validation, and transparent oversight.

### AI Collaboration Breakdown

```
+-----------------------------------+--------------------+----------------------+
| Task / Subsystem                  | AI Contribution    | Human Responsibility |
+-----------------------------------+--------------------+----------------------+
| System Architecture & DDD         | 40% (Drafting)     | 60% (Scoping & Dec.) |
| Domain Models & State Machine     | 50% (Coding)       | 50% (Review & Invar.)|
| Evaluator Engines (Strategy)      | 60% (Boilerplate)  | 40% (Rubric mapping) |
| Frontend UI (React + Vite)        | 45% (Styling/Pages)| 55% (UX review & QA) |
| Automated Test Runner & E2E       | 70% (Scaffolding)  | 30% (Scenario specs) |
| Architecture & PDF Documentation  | 60% (Formatting)   | 40% (Content & Proof)|
+-----------------------------------+--------------------+----------------------+
```

### Where AI Was Utilized:
1. **Refactoring & Bug Fixing:** Diagnosed and resolved a dependency injection mismatch where `PracticeService` required `ProblemService` during attempt creation.
2. **State Machine Synthesis:** Assisted in structuring the 4-phase transition methods (`submit()`, `evaluate()`, `complete()`) with explicit error handling for invalid transitions.
3. **Automated Test Scaffolding:** Generated the complete test suite runner in `server/testRunner.js` that orchestrates 10 domain unit tests, 4 end-to-end problem scenarios, and 5 edge-case error injections.
4. **Responsive Styling & Polish:** Helped refine modern CSS design tokens, responsive CSS Grid layouts, loading spinners, and color-coded score badges.
5. **Documentation & PDF Generation:** Built Python ReportLab automation scripts to generate formal academic/technical PDF whitepapers and design notes.

### Human Developer Responsibilities & Oversight:
1. **Product Direction & Requirements:** Defined the core problem, the 8-criterion rubric, the 4 classic LLD challenges, and the user journey.
2. **Architecture Validation:** Verified that the domain layer remained decoupled from Express, ensuring business rules cannot be bypassed by HTTP layer changes.
3. **Code Review & Quality Control:** Reviewed every generated diff block, removed unused duplicate client files, and ensured clean LF line endings and consistent formatting.
4. **Functional Testing:** Manually executed each user flow in the browser (problem selection &rarr; filling 7 fields &rarr; evaluating via Rule-Based and AI &rarr; reviewing detailed feedback &rarr; checking history).

---

**Prepared by:** Satvik Sharma  
**Engineering Lead & Platform Author**
