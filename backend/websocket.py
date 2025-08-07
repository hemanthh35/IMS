# websocket.py

from fastapi import WebSocket
from predictor.predictor import predict_root_cause
from summarizer import summarize_text

async def log_stream_handler(websocket: WebSocket):
    await websocket.accept()
    buffer = ""

    while True:
        try:
            data = await websocket.receive_text()
            buffer += data + "\n"

            if buffer.count("\n") % 3 == 0:  # summarize every 3 logs
                summary = summarize_text(buffer)
                root_cause = predict_root_cause(buffer)
                response = {
                    "summary": summary,
                    "root_cause": root_cause,
                    "raw_log": buffer.strip()
                }
                await websocket.send_json(response)
                buffer = ""  # reset buffer after summary

        except Exception as e:
            await websocket.send_text(f"⚠️ Error: {str(e)}")
            await websocket.close()
            break
