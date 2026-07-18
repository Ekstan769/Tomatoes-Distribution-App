# Farm2Market: 3-Person Team Delegation Matrix

This document defines the specific task ownership for the 3-person Farm2Market development team. 

## Team Roles
1.  **Team Lead (You):** Focuses on system architecture, FastAPI/ML integration, database integration, and routing. Serves as final gatekeeper for all PRs.
2.  *:** Focuses on business logic, Zod validation implementation, and quality assurance for the Unreliable Partner’s work.
3.  **** Focuses on high-volume, low-risk CRUD implementation, data seeding, and initial scaffolding.

---

## Task Delegation Breakdown

| Entity/Module | Team Lead (You) | peer 2| peer 1|
| :--- | :--- | :--- | :--- |
| **Auth & RBAC** | Middleware Logic | Implementation of Sign-up/Login logic | Unit tests for login/role flows |
| **Admin Controls** | Review & System Architecture | Admin endpoint implementation | Basic CRUD for User listing |
| **Logistics (Shipment)**| FastAPI Flow & Integration | Zod Schema & Controller Logic | Seeding DB with Master CSV |
| **Orders & Wallet** | DB Schema Integration | Order state management | Wallet balance retrieval logic |
| **Listings & Reviews**| Code Reviews (Final) | Review Controller implementation | Listings CRUD implementation |

---

## Detailed Task Descriptions

### 1. Team Lead 
*   **Routing Architecture:** Setup Express routes and middleware to ensure all API v1 endpoints are structured correctly.
*   **FastAPI Integration:** Establish the connection to the Python backend; ensure the shipment data flows from Express to FastAPI and back.
*   **Database Integration:** Handle Prisma schema definitions and maintain the database client.
*   **Final Gatekeeping:** Review all PRs for architectural alignment. If a PR does not meet the "Definition of Done," it is rejected immediately.

### 2. peer2
*   **Validation Logic:** Write all Zod schemas. Ensure they match the contract/data dictionary *exactly*.
*   **Business Logic Controllers:** Implement complex controller logic (e.g., Order status updates, Auth role-based logic).
*   **Review Layer:** Act as the primary reviewer for the Unreliable Partner’s code. Ensure they are not renaming fields or hardcoding outcomes.
*   **Admin Implementation:** Build the core logic for Admin endpoints to view system data.

### 3. peer1
*   **Data Seeding:** Write the one-time script to seed the 10,000-row synthetic dataset.
*   **CRUD Scaffolding:** Implement basic endpoints for Listings (Product) and Reviews. Keep them simple: Create, Read, Update, Delete.
*   **Unit Tests:** Write simple tests for existing routes to ensure basic functionality.
*   **Constraint:** You are strictly forbidden from modifying the Prisma schema or the Zod validation schemas provided by the Reliable Partner.

---

## Critical Rules for Success

### The Definition of Done (DoD)
All team members must satisfy these conditions before submitting a PR:
1.  **Validation:** Every request body must be validated against a Zod schema.
2.  **Naming:** Field names MUST be in camelCase.
3.  **Mocking:** If an integration (e.g., payment) isn't ready, use a mock response. Do not block progress.
4.  **Error Handling:** Use `try-catch` blocks and return correct HTTP status codes (400, 500, etc.).
5.  **Security:** Ensure the ML service is internal and never exposed to the internet.

### Code Review Protocol
*   The **peer** submits code to the **peer2**.
*   The **peer2** verifies against the DoD. If it passes, they suggest it to the **Team Lead**.
*   The **Team Lead** performs the final integration check and merges the code.

---
*Reference: [Farm2Market Integration Launch Plan](sandbox:/mnt/data/Farm2Market_Integration_Launch_Plan.pdf)*
