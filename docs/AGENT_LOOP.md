# ColdTrust Autonomous Agent Loop Specification

**Purpose:** Defines the repeatable execution loop for AI agents working on the ColdTrust codebase to guarantee context preservation and zero regressions.

---

## The Repeatable Agent Loop Diagram

```
┌─────────────────────────────────────────────────────────┐
│ 1. READ STATE & PERSISTENT MEMORY                      │
│    Inspect AGENTS.md, CURRENT_STATE.md, SESSION_STATE.md │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 2. UNDERSTAND OBJECTIVE & BOUNDARIES                    │
│    Confirm user request & technical freeze constraints  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 3. INSPECT AUTHORITATIVE SOURCE CODE                    │
│    View target files using viewing tools before editing │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 4. FORMULATE INCREMENTAL PLAN                           │
│    Check design tokens & API schemas                    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 5. IMPLEMENT PRODUCTION-QUALITY CHANGE                  │
│    Edit code incrementally without collateral damage    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 6. EXECUTE COMPILATION & BUILD VERIFICATION             │
│    Run npm run build / test commands                    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 7. REVIEW DIFF & STAGING DISCIPLINE                     │
│    Run git status, git diff --stat                      │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 8. UPDATE PERSISTENT MEMORY                             │
│    Update SESSION_STATE.md & relevant state docs        │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 9. CREATE FOCUSED GIT COMMIT (WHEN AUTHORIZED)          │
│    Commit milestone checkpoint locally                  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 10. REPORT STATUS & WAIT FOR HUMAN APPROVAL             │
└─────────────────────────────────────────────────────────┘
```
