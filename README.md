# Q-LIFELOCK

> **PQC Migration & Quantum Exposure Platform — Q-Hack India 2026**  
> **Quantifying Quantum Exposure & Prioritizing Post-Quantum Cryptography Migration by Data Lifetime**  
> *Compliant with NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA), and CycloneDX 1.6 CBOM.*

---

## 🌟 Overview

**Q-LIFELOCK** transforms cryptographic inventory scanning from a flat list of algorithms into a prioritized, actionable post-quantum migration strategy.

Most security tools report:
> *"RSA-2048 is present in `vault.py`."*

**Q-LIFELOCK answers:**
> *"This RSA-2048 key protects master customer banking records requiring a **30-year lifetime** (expiring 2056). Under a **2035 Cryptographically Relevant Quantum Computer (CRQC)** scenario, an adversary collecting ciphertext today will decrypt it **21 years before confidentiality legally expires** (Active Harvest-Now-Decrypt-Later exposure). Priority: **CRITICAL**. Recommendation: Replace with **NIST FIPS 203 ML-KEM-1024**."*

---

## 🚀 Key Modules & Architecture

1. **Cryptographic Inventory Scanner (`core/scanner`)**
   - High-precision lexical and AST scanners detecting RSA, ECDSA, ECDH, Diffie-Hellman, AES, etc.
   - Context-aware engine classifying environment (`production` vs `test` / `sample` / `mock`). Test-code receives automatic attenuation to avoid false alert fatigue.

2. **Quantum Risk & HNDL Engine (`core/risk`, `core/domain`)**
   - Evaluates **Mosca's Theorem** ($X + Y > Z$) and Harvest-Now-Decrypt-Later (HNDL) exposure windows.
   - Calculates quantitative risk scores (0–100) and exposure tiers: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`.

3. **Quantum Time Machine (`core/timemachine`)**
   - Interactive future scenario simulation allowing security teams to shift the projected CRQC arrival horizon (2027–2045).
   - Recalculates asset exposure, delta shifts, and vulnerability windows in real-time.

4. **Function-Aware Migration Planner (`core/migration`)**
   - Distinguishes **Key Establishment** (recommending **NIST FIPS 203 ML-KEM**) from **Digital Signatures** (recommending **NIST FIPS 204 ML-DSA** or **FIPS 205 SLH-DSA**).
   - Provides hybrid transition strategies (e.g. Hybrid X25519 + ML-KEM-768 for TLS 1.3).

5. **Quantum Readiness Scoring Engine (`core/readiness`)**
   - Dynamic 0–100% readiness score recomputed as findings transition through workflow states: `not_started` ➔ `planned` ➔ `in_progress` ➔ `validated` ➔ `completed`.

6. **Educational Quantum Simulation Lab (`core/quantum`)**
   - **Toy Shor's Algorithm Simulation:** Runs order-finding quantum circuits factoring composite integers ($N=15, 21, 33, 35$) with quantum Fourier transform (QFT) period measurement and classical factor derivation.
   - **Fault-Tolerant Resource Estimator:** Models physical qubits, logical qubits, surface-code cycles, and wall-clock cryptanalysis time based on peer-reviewed literature (Gidney & Ekerå 2021, Roetteler et al. 2017).

7. **Standardized Artifact Export (`core/export`)**
   - **CycloneDX 1.6 Cryptography BOM (CBOM):** Industry-standard machine-readable specification of cryptographic assets with NIST PQC levels.
   - **Executive Markdown Audit Report:** CISO/Board ready posture assessment.
   - **CSV Export:** Tabular data for Jira/SIEM import.

8. **Web Dashboard (`frontend`)**
   - Modern Next.js application built with a custom cybersecurity design system, light/dark mode support, responsive layouts, live filtering, and interactive drawers.

---

## 🛠️ Quick Start & Setup Instructions

### Prerequisites
- **Python 3.11+**
- **Node.js 18+**

### 1. Backend Setup & Run

```bash
# From workspace root
python -m pip install -r requirements.txt

# Run the FastAPI server
python -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```
API Documentation and Swagger UI will be available at:  
👉 **http://127.0.0.1:8000/docs**

### 2. Frontend Setup & Run

```bash
# Navigate to frontend directory
cd frontend
npm install
npm run dev
```
Open your browser to:  
👉 **http://localhost:3000**

Alternatively, on Windows you can simply double-click:
- `LAUNCH_QLIFELOCK.bat` (Starts both Backend and Frontend, and opens the browser)
- `STOP_QLIFELOCK.bat` (Safely halts all background servers)

---

## 🧪 Running Automated Tests

Run the complete test suite:
```bash
python -m pytest
```
Output:
```text
tests/test_all_engines.py (11 tests passed)
tests/test_api.py (9 tests passed)
tests/fixtures/synthetic_repo/tests (1 test passed)
================ 21 passed in 1.2s ================
```

---

## 📡 REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Health check & service status |
| `/api/scans/latest` | `GET` | Fetch latest cryptographic inventory and summary |
| `/api/scan` | `POST` | Trigger scan on a target repository |
| `/api/timemachine/simulate` | `POST` | Simulate quantum risk under custom scenario year |
| `/api/findings/{id}/status` | `PATCH` | Update migration status and recompute readiness |
| `/api/quantum/toy-shor` | `GET` | Run educational Shor's factoring simulation |
| `/api/quantum/resource-estimates` | `GET` | Retrieve fault-tolerant quantum resource estimates |
| `/api/scans/latest/export/cbom` | `GET` | Download CycloneDX 1.6 Cryptography BOM JSON |
| `/api/scans/latest/export/csv` | `GET` | Download findings spreadsheet in CSV format |
| `/api/scans/latest/export/report` | `GET` | Download executive markdown audit report |

---

## 📐 Implementation & Technical Details

- **Core Language & Frameworks:** Python 3.11, FastAPI, Pydantic v2, Next.js 15, React 19, TypeScript.
- **Standards Implemented:**
  - NIST FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism (ML-KEM)
  - NIST FIPS 204: Module-Lattice-Based Digital Signature Algorithm (ML-DSA)
  - NIST FIPS 205: Stateless Hash-Based Digital Signature Algorithm (SLH-DSA)
  - OWASP CycloneDX 1.6 Cryptographic Bill of Materials (CBOM) specification
- **Security Boundaries:** Strict path canonicalization and confinement to prevent directory traversal (`core/scanner/security.py`), isolated scan spaces, and safe handling of AST parsing.

---

## 📄 License
MIT License / Q-Hack India 2026
