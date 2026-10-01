"""
FastAPI Backend Application for Q-LIFELOCK.
"""
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from core.domain.models import (
    ScanSummary,
    Finding,
    MigrationStatus,
    QuantumExposure,
)
from core.scanner.engine import ScannerEngine
from core.timemachine.scenario import TimeMachineEngine
from core.readiness.metric import ReadinessEngine
from core.quantum.adapter import QuantumAdapter
from core.export.cbom import CBOMGenerator
from core.export.report import ReportGenerator
from fastapi.responses import Response, PlainTextResponse

from contextlib import asynccontextmanager

CURRENT_SCAN: Optional[ScanSummary] = None
DEFAULT_SYNTHETIC_DIR = Path("tests/fixtures/synthetic_repo").resolve()

class ScanRequest(BaseModel):
    repository_path: Optional[str] = None
    scenario_year: int = 2035
    repository_name: Optional[str] = None

class TimeMachineRequest(BaseModel):
    scenario_year: int
    findings: Optional[List[Finding]] = None

class StatusUpdateRequest(BaseModel):
    migration_status: MigrationStatus

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Seed initial scan with synthetic repository so dashboard opens with live data."""
    global CURRENT_SCAN
    if DEFAULT_SYNTHETIC_DIR.exists():
        CURRENT_SCAN = ScannerEngine.scan_directory(
            target_dir=DEFAULT_SYNTHETIC_DIR,
            repository_name="Synthetic-Core-Banking-Services",
            scenario_year=2035,
        )
    yield

app = FastAPI(
    title="Q-LIFELOCK API",
    description="Quantifying Quantum Exposure and Prioritizing Post-Quantum Cryptography Migration by Data Lifetime",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Q-LIFELOCK", "version": "0.1.0"}


@app.post("/api/scan", response_model=ScanSummary)
def run_scan(payload: ScanRequest):
    """Initiate cryptographic inventory scan on a repository."""
    global CURRENT_SCAN
    target_path = Path(payload.repository_path).resolve() if payload.repository_path else DEFAULT_SYNTHETIC_DIR
    if not target_path.exists():
        raise HTTPException(status_code=400, detail=f"Target directory does not exist: {target_path}")

    repo_name = payload.repository_name or target_path.name
    CURRENT_SCAN = ScannerEngine.scan_directory(
        target_dir=target_path,
        repository_name=repo_name,
        scenario_year=payload.scenario_year,
    )
    return CURRENT_SCAN


@app.get("/api/scans/latest", response_model=ScanSummary)
def get_latest_scan():
    """Retrieve findings and executive summary from the latest scan."""
    global CURRENT_SCAN
    if not CURRENT_SCAN:
        if DEFAULT_SYNTHETIC_DIR.exists():
            CURRENT_SCAN = ScannerEngine.scan_directory(
                target_dir=DEFAULT_SYNTHETIC_DIR,
                repository_name="Synthetic-Core-Banking-Services",
                scenario_year=2035,
            )
        else:
            raise HTTPException(status_code=404, detail="No scan results available. Run a scan first.")
    return CURRENT_SCAN


@app.post("/api/timemachine/simulate")
def simulate_scenario(payload: TimeMachineRequest):
    """Recalculate quantum exposure under an explicit future scenario year."""
    global CURRENT_SCAN
    findings = payload.findings or (CURRENT_SCAN.findings if CURRENT_SCAN else [])
    if not findings:
        raise HTTPException(status_code=400, detail="No findings available to simulate.")

    result = TimeMachineEngine.simulate_year(
        findings=findings,
        scenario_year=payload.scenario_year,
    )
    return result


@app.patch("/api/findings/{finding_id}/status")
def update_finding_status(finding_id: str, payload: StatusUpdateRequest):
    """Update migration workflow status for a specific finding and recompute readiness."""
    global CURRENT_SCAN
    if not CURRENT_SCAN:
        raise HTTPException(status_code=404, detail="No active scan found.")

    target_finding = None
    for f in CURRENT_SCAN.findings:
        if f.finding_id == finding_id:
            f.migration_status = payload.migration_status
            target_finding = f
            break

    if not target_finding:
        raise HTTPException(status_code=404, detail=f"Finding ID '{finding_id}' not found.")

    # Recompute readiness score
    readiness = ReadinessEngine.calculate_readiness(CURRENT_SCAN.findings)
    CURRENT_SCAN.readiness_score = readiness["readiness_score"]

    return {
        "finding_id": finding_id,
        "new_status": payload.migration_status,
        "updated_readiness_score": CURRENT_SCAN.readiness_score,
        "readiness_breakdown": readiness,
    }


@app.get("/api/quantum/toy-shor")
def run_toy_shor(N: int = Query(default=15, description="Composite number to factor")):
    """Run educational Shor's algorithm period-finding simulation."""
    try:
        result = QuantumAdapter.run_toy_shor_factoring(N=N)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/quantum/resource-estimates")
def get_quantum_resource_estimates(algorithm: str = "RSA", key_size: Optional[int] = 2048):
    """Retrieve peer-reviewed quantum cryptanalysis resource estimation data."""
    estimate = QuantumAdapter.get_resource_estimates(algorithm=algorithm, key_size=key_size)
    if not estimate:
        raise HTTPException(status_code=404, detail="Resource estimate not found.")
    return estimate


@app.get("/api/scans/latest/export/cbom")
def export_latest_cbom():
    """Export latest scan as CycloneDX 1.6 Cryptography BOM JSON."""
    global CURRENT_SCAN
    if not CURRENT_SCAN:
        get_latest_scan()
    cbom_data = CBOMGenerator.generate(CURRENT_SCAN)
    return cbom_data


@app.get("/api/scans/latest/export/csv")
def export_latest_csv():
    """Export latest scan findings as CSV."""
    global CURRENT_SCAN
    if not CURRENT_SCAN:
        get_latest_scan()
    csv_text = ReportGenerator.to_csv(CURRENT_SCAN)
    return PlainTextResponse(content=csv_text, media_type="text/csv", headers={
        "Content-Disposition": "attachment; filename=qlifelock_findings.csv"
    })


@app.get("/api/scans/latest/export/report")
def export_latest_executive_report():
    """Export executive readiness and risk report in Markdown."""
    global CURRENT_SCAN
    if not CURRENT_SCAN:
        get_latest_scan()
    report_md = ReportGenerator.to_markdown_executive_summary(CURRENT_SCAN)
    return PlainTextResponse(content=report_md, media_type="text/markdown", headers={
        "Content-Disposition": "attachment; filename=qlifelock_executive_report.md"
    })
