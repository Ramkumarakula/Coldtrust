# Live Demonstration Script: Web Application Security Vulnerabilities

**Project:** ColdTrust – Enterprise Global Cold Chain Network  
**Target Application:** ColdTrust Operations Dashboard & REST API Gateway  
**Frontend URL:** `http://localhost:5173`  
**Backend Gateway URL:** `http://localhost:3000`  
**Date of Verification:** 2026-10-15  

---

## 1. Demo Credentials (Role-Based Access)

The ColdTrust network now features a role-based login gate. Users must authenticate before the operations dashboard becomes reachable:

| Role | Username | Password | Organization / MSP Identity | Assigned Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Manufacturer** | `manufacturer` | `Password123!` | BioPharma Corp (`ManufacturerMSP`) | Consignment creation, initial batch registration |
| **Transport** | `transport` | `Password123!` | SwiftCold Logistics (`TransportMSP`) | Custody transfer acceptance, telemetry logging |
| **Retailer** | `retailer` | `Password123!` | Apex Central Pharmacy (`RetailerMSP`) | Delivery receipt confirmation, terminal acceptance |

*(Note: The login page also provides 1-click role preset buttons to auto-populate these credentials during demonstrations).*

---

## 2. Local Startup Instructions & URLs

To run the full stack locally:

### Terminal 1: Backend REST API Gateway
```bash
cd /home/ramkumar/projects/Enterprise-Cold-Chain-Network/backend
npm start
```
- **Service Status:** Listening on `http://localhost:3000`
- **Health Endpoint:** `http://localhost:3000/health`
- **Auth Endpoint:** `POST http://localhost:3000/api/auth/login`

### Terminal 2: Frontend Dashboard (Vite)
```bash
cd /home/ramkumar/projects/Enterprise-Cold-Chain-Network/frontend
npm run dev
```
- **Application URL:** Open `http://localhost:5173` in any browser.

---

## 3. Vulnerability 1: Missing Security Headers

### Vulnerability Name & OWASP Classification
- **Vulnerability:** Missing HTTP Security Response Headers
- **OWASP Category:** [A05:2021 – Security Misconfiguration](https://owasp.org/Top10/A05-Security-Misconfiguration/)
- **CWE:** CWE-16 (Configuration), CWE-1021 (Improper Restriction of Rendered UI Layers or Frames)

### Why It Matters (Non-Technical Explanation)
Security headers instruct the web browser to enforce critical defensive boundaries. Without these headers, malicious third-party websites can secretly embed the ColdTrust dashboard inside an invisible `<iframe>` to trick operators into clicking buttons (Clickjacking), or load unauthorized malicious scripts that steal supply chain data.

### Evidence Captured (Live Server Response)
Command executed:
```bash
curl -I http://localhost:5173
```
Real response captured from the running frontend server:
```http
HTTP/1.1 200 OK
Vary: Origin
Content-Type: text/html
Cache-Control: no-cache
Etag: W/"4fd-QHSfLNQ3kYvq/oQcJD/+4MQWwTw"
Date: Thu, 15 Oct 2026 18:21:30 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

**Header Status Breakdown:**
- `Content-Security-Policy`: **MISSING** (No restriction on where scripts, styles, or iframes can load from)
- `X-Frame-Options`: **MISSING** (Allows external websites to embed this app in an iframe, enabling clickjacking)
- `X-Content-Type-Options`: **MISSING** (Allows MIME-type sniffing of scripts disguised as images or text)
- `Strict-Transport-Security` (HSTS): **MISSING** (Does not mandate encrypted HTTPS communication)

### Step-by-Step Live Demo Script for Evaluators
1. Open Google Chrome, Firefox, or Edge and navigate to `http://localhost:5173`.
2. Press `F12` (or Right-Click → Inspect) to open **Developer Tools**.
3. Click on the **Network** tab in DevTools.
4. Refresh the page (`Ctrl + R` or `F5`).
5. In the Network requests list, click on the first entry: `localhost` (Document request).
6. In the right-hand panel, select the **Headers** sub-tab and scroll down to **Response Headers**.
7. **Point out to the audience:** Notice that standard hardening headers such as `Content-Security-Policy`, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff` are completely absent from the HTTP response.

### What a Secure Version Would Do Instead
A secure production web server would configure reverse proxy or Vite server headers injecting `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and a strict `Content-Security-Policy` restricting script sources to `'self'`.

---

## 4. Vulnerability 2: Sensitive Data Exposed in Client-Side Storage

### Vulnerability Name & OWASP Classification
- **Vulnerability:** Sensitive Authentication Token Stored in Browser `localStorage`
- **OWASP Category:** [A04:2021 – Insecure Design](https://owasp.org/Top10/A04-Insecure-Design/) / [A02:2021 – Cryptographic Failures](https://owasp.org/Top10/A02-Cryptographic-Failures/)
- **CWE:** CWE-922 (Insecure Storage of Sensitive Information), CWE-312 (Cleartext Storage of Sensitive Information)

### Why It Matters (Non-Technical Explanation)
Browser `localStorage` is accessible to **any** JavaScript executing on the web page. If an attacker injects any malicious script (via an XSS flaw, third-party library compromise, or browser extension), the attacker can instantly read the user's secret session token from storage, copy it, and permanently impersonate that user on the blockchain network without needing their password.

### Evidence Captured (Implementation Code Excerpt)
In [`frontend/src/components/LoginPage.jsx`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/frontend/src/components/LoginPage.jsx#L50-L55):
```javascript
const { token, user } = data.data;

// Sensitive Data Exposed in Client-Side Storage: Store raw JWT in localStorage
localStorage.setItem('coldtrust_jwt_token', token);
localStorage.setItem('coldtrust_user', JSON.stringify(user));
```

And in [`frontend/src/App.jsx`](file:///home/ramkumar/projects/Enterprise-Cold-Chain-Network/frontend/src/App.jsx#L18-L24):
```javascript
function getAuthHeaders() {
  const token = localStorage.getItem('coldtrust_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
```

### Step-by-Step Live Demo Script for Evaluators
1. Open `http://localhost:5173` in your browser (the ColdTrust login page will appear).
2. Click the **BioPharma Corp (Manufacturer)** preset button to populate credentials, then click **Authenticate & Enter Dashboard**.
3. Verify that the login succeeds and the dashboard interface opens.
4. Press `F12` to open **Developer Tools**.
5. Click on the **Application** tab (in Chrome/Edge) or **Storage** tab (in Firefox).
6. In the left sidebar, expand **Local Storage** and click on `http://localhost:5173`.
7. **Point out to the audience:** Highlight the key `coldtrust_jwt_token`. The complete, unencrypted JWT bearer token (`eyJhbGciOi...`) is stored in plain readable text.
8. Switch to the **Console** tab in DevTools and type:
   ```javascript
   localStorage.getItem('coldtrust_jwt_token')
   ```
9. Press `Enter`. Show that any JavaScript code can access this token immediately with a single command. Explain that any cross-site script or untrusted npm module could exfiltrate this token to steal full control of the consortium account.

### What a Secure Version Would Do Instead
A secure enterprise application would store session tokens in an `httpOnly`, `Secure`, `SameSite=Strict` cookie, which is automatically handled by the browser for API requests and is completely inaccessible to client-side JavaScript.

---

## 5. Summary & Verification Status

| Vulnerability | OWASP Category | Confirmed? | Demo Ready? | Key Risk |
| :--- | :--- | :---: | :---: | :--- |
| **Missing Security Headers** | A05:2021 – Security Misconfiguration | **Yes** | **Yes** | Clickjacking & unconstrained script execution |
| **Sensitive Data in localStorage** | A04:2021 – Insecure Design / CWE-922 | **Yes** | **Yes** | Token exfiltration via client-side script access |

- **Total Vulnerabilities Confirmed:** 2
- **Demo Script Ready:** Yes, both live demo workflows are fully operational and reproducible.
