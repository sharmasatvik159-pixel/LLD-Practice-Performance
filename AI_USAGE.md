# LLD Practice Platform — Documentation & AI Usage Report

**Author:** Satvik Sharma  
**Project:** LLD Practice Platform  
**Repository:** [https://github.com/sharmasatvik159-pixel/LLD-Practice-Performance](https://github.com/sharmasatvik159-pixel/LLD-Practice-Performance.git)  
**Status:** MVP Completed & Verified  

---

## 1. How to Run the Project

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
- The backend Express API will start on: **`http://localhost:5000`**
- Health check verification: `http://localhost:5000/api/health`

### Step 3: Start the Frontend Client
Open a second terminal window:
```bash
cd client
npm install
npm run dev
```
- The React + Vite client will start on: **`http://localhost:5173`**
- Open your browser and navigate to `http://localhost:5173` to explore problems, submit designs, and inspect evaluation feedback.

### Step 4: Run the Automated Test Suite
To execute all 10 domain unit tests, 4 end-to-end problem flows, and 5 error handling scenarios:
```bash
cd server
npm test
```
All tests should pass with `100%` pass rate.

---

## 2. Key Architectural Decisions

1. **Domain-Driven Design (DDD) & Clean Architecture:**
   - Pure domain models (`Problem`, `Attempt`, `Submission`, `Rubric`, `Evaluation`, `Feedback`) are completely isolated from Express and web concerns.
   - Core invariants and validation live inside domain entities, preventing invalid state representations.

2. **Guarded Finite State Machine (FSM):**
   - An attempt progresses strictly through: `DRAFT` &rarr; `SUBMITTED` &rarr; `EVALUATING` &rarr; `COMPLETED`.
   - Domain guards prevent out-of-order execution (e.g. evaluating before submitting) and enforce terminal state immutability (cannot mutate an already completed attempt).

3. **Strategy Pattern for Pluggable Evaluators:**
   - Abstract `Evaluator` class defines the evaluation contract.
   - `RuleBasedEvaluator` provides high-speed, deterministic rubric checks.
   - `AIEvaluator` provides deeper heuristic feedback on design trade-offs.
   - `EvaluationService` manages the registry, enabling new evaluators (e.g. OpenAI GPT-4, Claude 3.5 Sonnet) to be plugged in without modifying existing code (Open/Closed Principle).

4. **Structured 7-Field Design Schema:**
   - Rather than an unstructured text box, candidates formulate designs across 7 distinct engineering dimensions: *Requirements, Assumptions, Classes, Responsibilities, Relationships, Design Decisions, and Edge Cases*.
   - Trains candidates in systematic object-oriented breakdown.

5. **Constructor Dependency Injection:**
   - `PracticeService` requires `ProblemService` injected at instantiation (`new PracticeService(problemService)`).
   - Guarantees testability, enables seamless mocking in unit tests, and avoids singleton coupling.

---

## 3. Known Limitations & Future Roadmap

| Limitation in Current MVP | Rationale in MVP | Production Roadmap Solution |
| :--- | :--- | :--- |
| **In-Memory Storage** | In-memory JavaScript `Map` structures enable zero-friction local setup without database installation. | Implement the Repository Pattern backed by PostgreSQL (with Prisma/Drizzle ORM) or MongoDB for durable persistence. |
| **Heuristic AI Engine** | Offline heuristic engine ensures 100% uptime, 0ms latency, and no external API key dependency. | Connect `AIEvaluator` to live LLM APIs (OpenAI / Anthropic / Gemini) using structured JSON output prompts with fallback to rule-based evaluation. |
| **Synchronous Execution** | MVP evaluation completes in <50ms, allowing immediate client response in a single HTTP cycle. | Move evaluation to an asynchronous job queue (BullMQ / Redis) with Server-Sent Events (SSE) or WebSockets for real-time progress updates. |
| **Textual Input Only** | Simplifies candidate input and standardizes rubric text extraction. | Add a drag-and-drop UML class diagram visualizer and Mermaid.js AST parser for automated relationship validation. |
| **Local / Anonymous User Scope** | Prioritized core design evaluation workflow over authentication overhead. | Integrate NextAuth / Clerk / Supabase Auth for multi-tenant candidate profiles and public shareable design portfolios. |

---

## 4. AI Usage Report

### Overview
This project was developed using human-AI pair programming workflows via advanced agentic AI coding assistants (DeepMind Antigravity / Gemini & Claude models). The collaboration adhered strictly to modern software engineering principles, rigorous test-driven validation, and transparent oversight.

### Summary of AI Collaboration

```
+-------------------------------------------------------------------------------+
|                             AI COLLABORATION MATRIX                           |
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

### 1. Where AI Was Utilized:
- **Refactoring & Bug Fixing:** Diagnosed and resolved a dependency injection mismatch where `PracticeService` required `ProblemService` during attempt creation.
- **State Machine Synthesis:** Assisted in structuring the 4-phase transition methods (`submit()`, `evaluate()`, `complete()`) with explicit error handling for invalid transitions.
- **Automated Test Scaffolding:** Generated the complete test suite runner in `server/testRunner.js` that orchestrates 10 domain unit tests, 4 end-to-end problem scenarios, and 5 edge-case error injections.
- **Responsive Styling & Polish:** Helped refine modern CSS design tokens, responsive CSS Grid layouts, loading spinners, and color-coded score badges.
- **Documentation & PDF Generation:** Built Python ReportLab automation scripts to generate formal academic/technical PDF whitepapers and design notes.

### 2. Human Developer Responsibilities & Oversight:
- **Product Direction & Requirements:** Defined the core problem, the 8-criterion rubric, the 4 classic LLD challenges, and the user journey.
- **Architecture Validation:** Verified that the domain layer remained decoupled from Express, ensuring business rules cannot be bypassed by HTTP layer changes.
- **Code Review & Quality Control:** Reviewed every generated diff block, removed unused duplicate client files, and ensured clean LF line endings and consistent formatting.
- **Functional Testing:** Manually executed each user flow in the browser (problem selection &rarr; filling 7 fields &rarr; evaluating via Rule-Based and AI &rarr; reviewing detailed feedback &rarr; checking history).

### 3. Key Takeaways & Learnings from AI-Assisted Development:
- **Speed of Iteration:** Scaffolding complete domain models and automated test suites was accelerated by ~4x compared to manual authoring.
- **Test-First Reliability:** Utilizing AI to generate end-to-end integration tests immediately revealed edge cases (e.g. attempting to re-submit completed attempts) that were promptly guarded at the domain level.
- **Preserved Design Ownership:** The software architecture was led by human engineering judgment (Strategy Pattern, FSM, DDD), using AI as a high-velocity execution partner.
