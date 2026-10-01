"""
API Integration Tests for Q-LIFELOCK FastAPI app.
"""
import pytest
from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_get_latest_scan():
    response = client.get("/api/scans/latest")
    assert response.status_code == 200
    data = response.json()
    assert "scan_id" in data
    assert data["total_findings"] > 0
    assert len(data["findings"]) > 0


def test_timemachine_simulate_api():
    # Fetch latest scan
    scan = client.get("/api/scans/latest").json()
    findings = scan["findings"]

    # Simulate for 2029 (aggressive scenario)
    res_2029 = client.post("/api/timemachine/simulate", json={"scenario_year": 2029, "findings": findings})
    assert res_2029.status_code == 200
    data_2029 = res_2029.json()
    assert data_2029["scenario_year"] == 2029
    assert "shifts" in data_2029
    assert "exposure_counts" in data_2029


def test_update_finding_status_and_readiness():
    scan = client.get("/api/scans/latest").json()
    target_f = scan["findings"][0]
    fid = target_f["finding_id"]

    res = client.patch(f"/api/findings/{fid}/status", json={"migration_status": "completed"})
    assert res.status_code == 200
    data = res.json()
    assert data["new_status"] == "completed"
    assert "updated_readiness_score" in data


def test_quantum_toy_shor_api():
    res = client.get("/api/quantum/toy-shor?N=15")
    assert res.status_code == 200
    data = res.json()
    assert data["target_integer"] == 15
    assert data["derived_factors"] == [3, 5]


def test_quantum_resource_estimates_api():
    res = client.get("/api/quantum/resource-estimates?algorithm=RSA&key_size=2048")
    assert res.status_code == 200
    data = res.json()
    assert data["algorithm"] == "RSA"
    assert data["logical_qubits"] == 4098


def test_export_cbom_api():
    res = client.get("/api/scans/latest/export/cbom")
    assert res.status_code == 200
    data = res.json()
    assert data["bomFormat"] == "CycloneDX"
    assert data["specVersion"] == "1.6"
    assert len(data["components"]) > 0


def test_export_csv_api():
    res = client.get("/api/scans/latest/export/csv")
    assert res.status_code == 200
    assert "Finding ID,Algorithm,Function" in res.text


def test_export_report_api():
    res = client.get("/api/scans/latest/export/report")
    assert res.status_code == 200
    assert "Q-LIFELOCK Executive Quantum Readiness Report" in res.text

