# AGENTS.md — ColdTrust Master Operating Protocol for AI Agents

**Project Name:** ColdTrust – Enterprise Global Cold Chain Network  
**Target Platform:** Hyperledger Fabric v2.5.16 Enterprise Logistics Command Center  
**Root Document:** `AGENTS.md`

---

## 1. Mandatory Pre-Flight Execution Rule

Before proposing or implementing ANY architectural modifications, code edits, or refactorings, ALL future AI coding agents MUST inspect and read the following source-of-truth documents:

1. `AGENTS.md` (THIS FILE)
2. `CURRENT_STATE.md`
3. `docs/ARCHITECTURE_BASELINE.md`
4. `docs/DECISIONS.md`
5. `docs/ROADMAP.md`
6. `docs/SESSION_STATE.md`

---

## 2. Project Architecture Summary

ColdTrust consists of 4 main architectural layers:

```
[ Operations Dashboard ] (React 19 / Vite 8 / Tailwind v4 / ColdTrust Tokens)
         │
         ▼ (HTTP REST JSON)
[ REST API Gateway ] (Express / TypeScript / Zod / Winston / Swagger UI)
         │
         ▼ (gRPC / TLS via @hyperledger/fabric-gateway)
[ Hyperledger Fabric Consortium ] (4 Orgs: Manufacturer, Transport, Retailer, Regulator)
         │
         ▼ (Golang Chaincode on coldchain-channel)
[ Smart Contract Engine ] (Automated temperature breach rule: temp > MaxTemp -> COMPROMISED)
```

---

## 3. Protected Systems (DO NOT MODIFY WITHOUT EXPLICIT APPROVAL)

The following systems are considered frozen, fully verified, and MUST NOT be modified during frontend or documentation tasks:

* 🛡 **Hyperledger Fabric Topology & Cryptography:** `blockchain/` (17 Docker containers, crypto-config, channel blocks).
* 🛡 **Smart Contract Chaincode:** `chaincode/shipment/` (Golang structs, state transitions, compromise rule engine).
* 🛡 **Backend REST API Contracts:** `backend/src/` (Zod schemas, Express endpoint signatures, status response format).
* 🛡 **IoT Telemetry Simulator Engine:** `simulator/src/` (Telemetry schema, stream frequency).

---

## 4. Fundamental Agent Operating Rules

### Rule 1: Source-of-Truth Memory
* The codebase and persistent markdown files in `docs/` are your **only** ground truth memory.
* Never rely on conversational context alone. Always inspect files using viewing tools before diagnosing or writing code.

### Rule 2: Visual Direction Authority
* All visual UI/UX work MUST follow `.agents/skills/coldtrust-enterprise-ui/SKILL.md` as the primary design authority.
* **ColdTrust Visual Style:** Dark navy (`#0B0F17`), solid graphite (`#131B2E`), ice-blue accents (`#0EA5E9`), high data density, SAP/IBM/DHL command center vibe.
* **Strict Prohibition:** NO Web3/crypto visuals, NO neon glow, NO multi-color text gradients, NO floating coins or cubes.

### Rule 3: Git & Commit Discipline
* Always check `git status` and `git diff --stat` before committing.
* Never commit secrets (`.env`, `.key`, `.pem`, wallet credentials) or build artifacts.
* Do NOT push commits to remote repositories automatically unless explicitly instructed by the user.

### Rule 4: Docker & Infrastructure Safety
* Frontend or documentation work MUST NOT start, restart, or modify Docker containers or Fabric networks.
* If a backend service is unavailable, handle it gracefully using frontend loading/error states rather than attempting to modify backend infrastructure.

### Rule 5: Architecture Change Protocol
* Silent architecture replacements are strictly forbidden. Any architectural change MUST strictly follow `docs/ARCHITECTURE_CHANGE_PROTOCOL.md`.
