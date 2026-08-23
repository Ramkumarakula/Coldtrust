# ColdTrust Known Issues & Operational Considerations

---

## 1. Operating System & Ephemeral Network Sockets

### Issue 1.1: WSL Ephemeral Socket Buffer Exhaustion under Continuous Stress Load
* **Category:** System & OS Boundary Constraint (Windows WSL2)
* **Description:** Streaming over 12,000 continuous high-frequency HTTP/gRPC transactions from the IoT simulator can exhaust Windows WSL ephemeral socket buffers (`WSAENOBUFS` / `0x80072747` and `HCS_E_CONNECTION_TIMEOUT`).
* **Root Cause:** Ephemeral socket handle accumulation in Windows host virtual network interface bridge during multi-hour stress testing.
* **Resolution / Standard Recovery Procedure:** Running `wsl --shutdown` in PowerShell or restarting the host PC flushes all hung socket handles and completely restores clean operational state.

### Issue 1.2: Path Translation across Windows and WSL UNC Boundary
* **Category:** File System & Tool Execution
* **Description:** Executing native Windows CMD binaries (e.g. Windows `git` or `npm`) directly against `\\wsl$\Ubuntu\...` paths can produce path translation warnings (`CMD.EXE was started with the above path as the current directory... UNC paths are not supported`).
* **Resolution:** Execute Linux binaries natively inside WSL (`wsl -d Ubuntu bash -c "..."`) or use relative workspace paths.

---

## 2. Server Port Allocation & Standard Fallback Behavior

* **Frontend Port Fallback:** Vite is configured for default port `5173`. If port `5173` is actively in use by another local process, Vite automatically binds to `5174`. This is standard fallback behavior and not a bug.
* **Backend Port Binds:** Express REST API binds to port `3000`. If port `3000` is bound by another instance, the server process will throw `EADDRINUSE`. Ensure previous backend processes are terminated before starting `npm start`.

---

## 3. Environment & Offline Development Behavior

* **Backend Gateway Failover in Offline Mode:** When the Hyperledger Fabric Docker stack is stopped, backend gRPC connections to `peer0.manufacturer...:7051` will log gateway connection retry errors. This is expected when running the REST server without the underlying Fabric container network active.
