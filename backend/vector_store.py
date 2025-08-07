import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

# === Step 1: Load incident log dataset ===
DATA_PATH = r"C:\Users\naduk\OneDrive\Documents\backends\project\backend\predictor\synthetic_incident_logs_10000.csv"  # Make sure this file is in the same folder
df = pd.read_csv(DATA_PATH)

# === Step 2: Extract log texts and root causes ===
texts = df['log_text'].astype(str).tolist()
root_causes = df['root_cause'].astype(str).tolist()

# === Step 3: Encode logs into sentence vectors ===
print("[INFO] Loading sentence transformer model...")
model = SentenceTransformer('all-MiniLM-L6-v2')  # Fast + lightweight

print("[INFO] Encoding log texts into vectors...")
embeddings = model.encode(texts, convert_to_numpy=True, show_progress_bar=True)

# === Step 4: Create FAISS index for fast similarity search ===
dimension = embeddings.shape[1]  # should be 384
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)
print(f"[INFO] FAISS index built with {len(texts)} vectors.")

# === Step 5: Store metadata for reverse lookup ===
incident_data = [{"log_text": text, "root_cause": root} for text, root in zip(texts, root_causes)]

# === Step 6: Search function for FastAPI to call ===
def search_similar_incidents(query_text: str, k: int = 3):
    query_vector = model.encode([query_text], convert_to_numpy=True)
    distances, indices = index.search(query_vector, k)

    results = []
    for idx in indices[0]:
        results.append({
            "log_text": incident_data[idx]["log_text"],
            "root_cause": incident_data[idx]["root_cause"]
        })
    return results

# === Optional test ===
if __name__ == "__main__":
    print("\n[TEST] Searching for similar incidents...\n")
    query = "Authentication failed because of expired token"
    similar = search_similar_incidents(query)
    for i, item in enumerate(similar, 1):
        print(f"{i}. Log: {item['log_text']}")
        print(f"   Root Cause: {item['root_cause']}\n")
