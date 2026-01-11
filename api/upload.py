from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import uuid
from datetime import timedelta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.StringIO(content.decode("utf-8")))

    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")

    id_states = {}
    id_departments = {}
    vendor_count = {}
    date_map = {}

    for _, row in df.iterrows():
        rid = str(row["ID"])
        state = str(row["State"])
        dept = str(row["Department"])
        vendor = str(row["Vendor"])
        date = row["Date"]

        id_states.setdefault(rid, set()).add(state)
        id_departments.setdefault(rid, set()).add(dept)
        vendor_count[vendor] = vendor_count.get(vendor, 0) + 1

        if pd.notna(date):
            date_map.setdefault(rid, []).append(date)

    records = []

    for _, row in df.iterrows():
        reasons = []
        score = 0

        rid = str(row["ID"])
        amount = float(row["Amount"]) if not pd.isna(row["Amount"]) else 0
        issue = str(row["Issue"]) if not pd.isna(row["Issue"]) else ""

        if amount >= 50_00_000:
            score += 30
            reasons.append("Unusually high transaction amount (₹50L+)")

        if len(id_states.get(rid, [])) > 1:
            score += 20
            reasons.append("Same ID appears across multiple states")

        if len(id_departments.get(rid, [])) > 1:
            score += 15
            reasons.append("Same ID appears across multiple departments")

        vendor = str(row["Vendor"])
        if vendor_count.get(vendor, 0) > 3:
            score += 20
            reasons.append("Same vendor involved in multiple transactions")

        if issue.strip() != "":
            score += 15
            reasons.append("Audit issue already reported in records")

        dates = date_map.get(rid, [])
        if len(dates) >= 2:
            dates = sorted(dates)
            for i in range(len(dates) - 1):
                if (dates[i + 1] - dates[i]) <= timedelta(days=5):
                    score += 15
                    reasons.append("Multiple transactions within short time window")
                    break

        if len(reasons) >= 2:
            score += 10
            reasons.append("Multiple anomaly indicators detected")

        score = min(score, 100)

        if score > 75:
            level = "High"
        elif score > 45:
            level = "Medium"
        else:
            level = "Low"

        if not reasons:
            reasons.append("No significant anomaly detected")

        records.append({
            "id": str(uuid.uuid4()),
            "scheme": str(row["Scheme"]),
            "department": str(row["Department"]),
            "vendorName": str(row["Vendor"]),
            "amountDisbursed": amount,
            "avgHistoricalAmount": amount,
            "transactionFrequency": 1,
            "beneficiaryCount": 1,
            "riskScore": score,
            "riskLevel": level,
            "riskReasons": reasons,
            "auditStatus": "Pending"
        })

    return records
