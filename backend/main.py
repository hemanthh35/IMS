from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from summarizer import summarize_incident
from vector_store import search_similar_incidents
import joblib
import os
import csv
from datetime import datetime

# === Load ML model ===
model_path = os.path.join(os.path.dirname(__file__), "predictor", "root_cause_model.pkl")
model = joblib.load(model_path)

# === FastAPI App ===
app = FastAPI()

# === CORS (Allow frontend on localhost:3000 and Render) ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://ai-incident-management-frontend.onrender.com",
        "https://ims-frontend.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Pydantic Models ===
class InputText(BaseModel):
    text: str

class IncidentInput(BaseModel):
    timestamp: str
    component: str
    severity: str
    log_text: str

class SearchQuery(BaseModel):
    log_text: str

# === CSV Logging ===
def log_incident_to_csv(data: IncidentInput, prediction: str):
    row = {
        "timestamp": datetime.now().isoformat(),
        "component": data.component,
        "severity": data.severity,
        "log_text": data.log_text,
        "predicted_root_cause": prediction
    }
    file_path = "incident_history.csv"
    write_header = not os.path.exists(file_path)
    with open(file_path, mode="a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=row.keys())
        if write_header:
            writer.writeheader()
        writer.writerow(row)

# === API Routes ===

# 🏥 Health Check
@app.get("/")
def health_check():
    return {"status": "healthy", "message": "AI Incident Management System API is running"}

# 🔍 Summarization Endpoint
@app.post("/summarize")
def summarize(data: InputText):
    result = summarize_incident(data.text)
    return {"summary": result}

# 🤖 Root Cause Prediction
@app.post("/predict")
async def predict_root_cause(data: IncidentInput):
    input_text = f"{data.timestamp} {data.component} {data.severity} {data.log_text}"
    prediction = model.predict([input_text])[0]
    log_incident_to_csv(data, prediction)
    return {"predicted_root_cause": prediction}

# 🔁 FAISS Similar Search
@app.post("/search")
async def search_similar_incidents_api(query: SearchQuery):
    results = search_similar_incidents(query.log_text, k=3)
    return {"similar_incidents": results}

# 📊 Dashboard / History Logs
@app.get("/history")
async def get_history():
    csv_path = os.path.join(os.path.dirname(__file__), "incident_history.csv")
    history = []
    if not os.path.exists(csv_path):
        return JSONResponse(content=[])
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            history.append({
                "timestamp": row["timestamp"],
                "component": row["component"],
                "severity": row["severity"],
                "log_text": row["log_text"],
                "predicted_root_cause": row["predicted_root_cause"]
            })
    return JSONResponse(content=history)
