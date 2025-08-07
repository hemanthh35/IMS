from transformers import pipeline

summarizer = pipeline("summarization", model="t5-small")

def summarize_incident(text: str) -> str:
    try:
        summary = summarizer(text, max_length=50, min_length=10, do_sample=False)
        return summary[0]['summary_text'].strip()
    except Exception as e:
        return f"❌ Could not summarize logs: {str(e)}"
