import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

# Load data
df = pd.read_csv("synthetic_incident_logs_10000.csv")

# Combine multiple fields into one input text
df["combined_input"] = df["timestamp"].astype(str) + " | " + \
                       df["component"].astype(str) + " | " + \
                       df["severity"].astype(str) + " | " + \
                       df["log_text"].astype(str)

# Set features and labels
X = df["combined_input"]
y = df["root_cause"]

# Create ML pipeline
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', LogisticRegression(max_iter=1000))
])

# Train model
pipeline.fit(X, y)

# Save the trained model
joblib.dump(pipeline, "root_cause_model.pkl")
print("✅ Model trained using all fields and saved.")
