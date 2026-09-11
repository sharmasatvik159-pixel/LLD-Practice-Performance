# REST API Specification — LLD Practice Platform

**Base URL**: `http://localhost:5000/api`

---

## 1. System Health

### `GET /api/health`
Checks server status.

- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "LLD Practice Platform API is running"
  }
  ```

---

## 2. Problems Catalog

### `GET /api/problems`
Retrieves all available LLD practice problems.

- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "parking-lot",
        "title": "Parking Lot",
        "description": "Design a parking lot system using object-oriented design principles.",
        "difficulty": "Medium",
        "requirements": [
          "Support multiple vehicle types.",
          "Support multiple parking floors.",
          "Assign available parking spots.",
          "Handle a full parking lot."
        ]
      },
      {
        "id": "vending-machine",
        "title": "Vending Machine",
        "description": "Design a vending machine capable of managing products and payments.",
        "difficulty": "Medium",
        "requirements": [...]
      },
      {
        "id": "elevator-system",
        "title": "Elevator System",
        "description": "Design an elevator system for a multi-floor building.",
        "difficulty": "Hard",
        "requirements": [...]
      },
      {
        "id": "library-management",
        "title": "Library Management",
        "description": "Design a library management system for books and members.",
        "difficulty": "Easy",
        "requirements": [...]
      }
    ]
  }
  ```

### `GET /api/problems/:problemId`
Retrieves details for a specific problem.

- **Parameters**: `problemId` (string) e.g., `parking-lot`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "parking-lot",
      "title": "Parking Lot",
      "description": "Design a parking lot system using object-oriented design principles.",
      "difficulty": "Medium",
      "requirements": [...]
    }
  }
  ```
- **Error (404 Not Found)**:
  ```json
  {
    "success": false,
    "message": "Problem \"xyz\" not found."
  }
  ```

---

## 3. Practice & Attempts

### `POST /api/practice/problems/:problemId/attempts`
Initiates a new practice attempt in `DRAFT` status.

- **Path Parameter**: `problemId`
- **Request Body** (optional):
  ```json
  {
    "userId": "user-123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "attempt-1789113880396",
      "problemId": "parking-lot",
      "userId": "user-123",
      "status": "DRAFT",
      "submissionId": null,
      "evaluationId": null,
      "createdAt": "2026-09-11T08:04:40.396Z",
      "submittedAt": null,
      "completedAt": null
    }
  }
  ```

### `POST /api/practice/attempts/:attemptId/submission`
Submits a design solution. Executes the complete pipeline:
`DRAFT` → `SUBMITTED` → `EVALUATING` → `COMPLETED`.

- **Path Parameter**: `attemptId`
- **Request Body**:
  ```json
  {
    "evaluatorType": "RULE_BASED", // or "AI"
    "requirements": "1. Multi-vehicle...",
    "assumptions": "Flat pricing...",
    "classes": "ParkingLot, Spot, Vehicle...",
    "responsibilities": "ParkingLot coordinates...",
    "relationships": "ParkingLot has Spots...",
    "designDecisions": "Strategy Pattern...",
    "edgeCases": "Full parking lot..."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "attempt": {
        "id": "attempt-1789113880396",
        "problemId": "parking-lot",
        "userId": "user-123",
        "status": "COMPLETED",
        "submissionId": "submission-...",
        "evaluationId": "evaluation-...",
        "createdAt": "2026-09-11T08:04:40.396Z",
        "submittedAt": "2026-09-11T08:04:40.426Z",
        "completedAt": "2026-09-11T08:04:40.427Z",
        "submission": { ... },
        "evaluation": {
          "id": "evaluation-...",
          "attemptId": "attempt-1789113880396",
          "evaluatorType": "RULE_BASED",
          "overallScore": 80,
          "feedbackItems": [
            {
              "criterionId": "requirement-understanding",
              "score": 8,
              "evidence": "Submission contains information for requirement-understanding.",
              "concern": "No major issue detected by the rule-based evaluator.",
              "suggestion": "Clearly identifies the system requirements.",
              "confidence": "HIGH"
            }
            // ... 8 criteria items total
          ],
          "evaluatedAt": "2026-09-11T08:04:40.427Z"
        }
      },
      "evaluation": { ... }
    }
  }
  ```

### `GET /api/practice/attempts/:attemptId`
Retrieves full details of a specific attempt including embedded submission and evaluation feedback.

- **Path Parameter**: `attemptId`
- **Response (200 OK)**: Attempt entity object
- **Error (404 Not Found)**: When attempt does not exist

### `GET /api/practice/problems/:problemId/attempts`
Retrieves attempt history for a specific problem.

- **Path Parameter**: `problemId`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "attempt-1789113880396",
        "problemId": "parking-lot",
        "userId": "tester",
        "status": "COMPLETED",
        "submissionId": "submission-...",
        "evaluationId": "evaluation-...",
        "createdAt": "...",
        "completedAt": "...",
        "evaluation": {
          "overallScore": 80,
          "evaluatorType": "RULE_BASED",
          "feedbackItems": [...]
        }
      }
    ]
  }
  ```
