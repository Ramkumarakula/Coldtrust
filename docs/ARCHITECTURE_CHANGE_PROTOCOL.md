# ColdTrust Architecture Change Protocol

**Mandatory Directive:** All future AI coding agents MUST follow this 11-step change protocol before altering any subsystem architecture.

---

## The 11-Step Architectural Change Workflow

```
1. READ CURRENT ARCHITECTURE
         │
         ▼
2. PROPOSE CHANGE & SCOPE
         │
         ▼
3. IMPACT ANALYSIS
         │
         ▼
4. DEPENDENCY & API CONTRACT ANALYSIS
         │
         ▼
5. SECURITY & ACCESS CONTROL ANALYSIS
         │
         ▼
6. MIGRATION & BACKWARD COMPATIBILITY PLAN
         │
         ▼
7. HUMAN APPROVAL GATE (STOP & WAIT)
         │
         ▼
8. INCREMENTAL IMPLEMENTATION
         │
         ▼
9. COMPREHENSIVE TESTING & VERIFICATION
         │
         ▼
10. UPDATE PERSISTENT DOCUMENTATION
         │
         ▼
11. FOCUSED GIT COMMIT
```

---

## Detailed Step Rules

1. **Step 1 — Read Current Architecture:** Inspect `AGENTS.md`, `CURRENT_STATE.md`, and `docs/ARCHITECTURE_BASELINE.md`.
2. **Step 2 — Propose Change & Scope:** Clearly define which subsystem is affected (Frontend, Backend, Chaincode, Blockchain).
3. **Step 3 — Impact Analysis:** Identify potential breaking changes or regressions.
4. **Step 4 — Dependency & API Contract Analysis:** Verify API schemas (`Zod`), response structures, or Golang structs.
5. **Step 5 — Security Analysis:** Ensure MSP identity checks, TLS certs, and access controls remain intact.
6. **Step 6 — Migration Plan:** Define backward-compatible migration steps.
7. **Step 7 — Human Approval Gate:** Present implementation plan to user and **STOP** until explicit approval is granted.
8. **Step 8 — Incremental Implementation:** Make small, production-quality edits without rewriting unaffected components.
9. **Step 9 — Testing & Verification:** Run unit tests (`npm test`, `go test`), builds (`npm run build`), or e2e test scripts.
10. **Step 10 — Update Persistent Documentation:** Update `CURRENT_STATE.md` and `SESSION_STATE.md`.
11. **Step 11 — Focused Git Commit:** Stage modified files and create a clean git commit.
