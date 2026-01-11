from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import math
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def compute_risk(record):
    score = 0
    reasons = []

    if record["avgHistoricalAmount"] > 0:
        ratio = record["amountDisbursed"] / record["avgHistoricalAmount"]
        if ratio >= 3:
            score += 40
            reasons.append(f"Amount is {round(ratio,1)}x historical average")
        elif ratio >= 2.5:
            score += 30
            reasons.append(f"Amount is {round(ratio,1)}x historical average")
        elif ratio >= 2:
            score += 20
            reasons.append(f"Amount is {round(ratio,1)}x historical average")

    if record["transactionFrequency"] >= 20:
        score += 20
        reasons.append("Very high transaction frequency")
    elif record["transactionFrequency"] >= 15:
        score += 10
        reasons.append("Elevated transaction frequency")

    if record["beneficiaryCount"] > 0:
        per_beneficiary = record["amountDisbursed"] / record["beneficiaryCount"]
        if per_beneficiary >= 5000:
            score += 15
            reasons.append("High per-beneficiary payout")

    if record["duplicateIdentity"]:
        score += 30
        reasons.append("Same beneficiary ID across multiple states or departments")

    score = min(100, score)

    if score > 75:
        level = "High"
    elif score > 50:
        level = "Medium"
    else:
        level = "Low"

    if not reasons:
        reasons.append("Standard operational parameters")

    return score, level, reasons


@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.StringIO(content.decode("utf-8")))

    records = []
    identity_map = {}

    for _, row in df.iterrows():
        identity = str(row.get("beneficiary_id", ""))
        state = str(row.get("state", ""))
        dept = str(row.get("department", ""))

        if identity:
            identity_map.setdefault(identity, set()).add((state, dept))

    for _, row in df.iterrows():
        identity = str(row.get("beneficiary_id", ""))
        duplicate_identity = False

        if identity and len(identity_map.get(identity, [])) > 2:
            duplicate_identity = True

        record = {
            "id": str(uuid.uuid4()),
            "scheme": str(row.get("scheme", "N/A")),
            "department": str(row.get("department", "N/A")),
            "vendorName": str(row.get("vendor", "N/A")),
            "amountDisbursed": float(row.get("amount", 0)),
            "avgHistoricalAmount": float(row.get("historical_avg", 0)),
            "transactionFrequency": int(row.get("txn_count", 0)),
            "beneficiaryCount": int(row.get("beneficiary_count", 0)),
            "duplicateIdentity": duplicate_identity
        }

        score, level, reasons = compute_risk(record)

        record["riskScore"] = score
        record["riskLevel"] = level
        record["riskReasons"] = reasons
        record["auditStatus"] = "Pending"

        records.append(record)

    return records
