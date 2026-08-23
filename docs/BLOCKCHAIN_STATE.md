# ColdTrust Blockchain Architecture State

**Framework:** Hyperledger Fabric v2.5.16  
**Channel Name:** `coldchain-channel`  
**Chaincode Name:** `shipment` (Version `1.0`)

---

## 1. Consortium Network Components

The consortium network consists of 17 Docker containers configured under `blockchain/compose/`:

1. **Raft Orderer Node**: `orderer.coldchain.com` (Port `7050`)
2. **4 Peer Nodes**:
   - `peer0.manufacturer.coldchain.com` (Port `7051`, Gossip `7051`)
   - `peer0.transport.coldchain.com` (Port `8051`, Gossip `8051`)
   - `peer0.retailer.coldchain.com` (Port `9051`, Gossip `9051`)
   - `peer0.regulator.coldchain.com` (Port `10051`, Gossip `10051`)
3. **4 CouchDB World State Databases**:
   - `couchdb0` (Port `5984`), `couchdb1` (Port `6984`), `couchdb2` (Port `7984`), `couchdb3` (Port `8984`)
4. **4 Certificate Authorities (CAs)**:
   - `ca.manufacturer.coldchain.com` (Port `7054`), `ca.transport.coldchain.com` (Port `8054`), `ca.retailer.coldchain.com` (Port `9054`), `ca.regulator.coldchain.com` (Port `10054`)
5. **4 Chaincode Containers**: Container instances created dynamically upon chaincode approval/commit.

---

## 2. Deployment & Verification Status Matrix

| Subsystem Component | State | Description / Evidence |
| :--- | :--- | :--- |
| Network Crypto Material | `CONFIGURED` & `GENERATED` | MSP structure, TLS certs, and private keys located in `blockchain/organizations/`. |
| Channel Artifacts | `GENERATED` | `genesis.block`, `coldchain.tx`, and anchor peer update transactions in `blockchain/channel/`. |
| Smart Contract Code | `IMPLEMENTED` & `COMPILED` | Golang chaincode package located in `chaincode/shipment/`. Unit tests passing. |
| Chaincode Package | `PACKAGED` | `coldchain.tar.gz` packaged in `blockchain/channel/`. |
| Docker Stack | `CONFIGURED` & `VERIFIED` | Verified cleanly via `./scripts/network.sh up` and end-to-end scenario test. |
| Operational Run State | `NOT CURRENTLY RUNNING` | Containers stopped post-verification to conserve system ephemeral socket handles. |

---

## 3. Smart Contract Lifecycle & Breach Rules

### Consignment Lifecycle States
* `CREATED`: Asset created on ledger by `ManufacturerMSP`. Initial bounds (`minTemp`, `maxTemp`) recorded.
* `IN_TRANSIT`: Custody accepted by `TransportMSP`. Telemetry logs actively recorded.
* `DELIVERED`: Shipment received at destination by `RetailerMSP`. Final state transition.
* `COMPROMISED`: Permanent immutable breach state triggered by smart contract engine.

### Automated Temperature Breach Engine Rule
The chaincode enforces strict thermal boundary checking during telemetry recording:
```go
if telemetry.Temperature > shipment.MaxTemp {
    shipment.Status = "COMPROMISED"
}
```
> [!IMPORTANT]
> Once a shipment transitions to `COMPROMISED`, smart contract logic permanently blocks reversion to `IN_TRANSIT` or `DELIVERED`.

---

## 4. Key Management Automation Scripts

* `scripts/network.sh up`: Launches containers, generates channel artifacts, joins peers, deploys chaincode.
* `blockchain/scripts/createChannel.sh`: Creates `coldchain-channel` and joins peer nodes across all 4 orgs.
* `blockchain/scripts/deployCC.sh`: Packages, installs, approves, and commits Golang smart contract code.
* `blockchain/scripts/testInvoke.sh`: Validates chaincode invocation directly via peer CLI binaries.
