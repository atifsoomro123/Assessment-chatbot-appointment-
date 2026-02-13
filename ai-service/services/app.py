from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from services.appointment_service import handle_message
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Service")


class ChatRequest(BaseModel):
    session_id: str
    message: str


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/chat")
def chat(req: ChatRequest):
    try:
        print(f"Received message for session {req.session_id}: {req.message}")
        reply, extracted = handle_message(req.session_id, req.message)
        return {"reply": reply, "extracted": extracted}
    except Exception as e:
        # return an actual error response code
        raise HTTPException(status_code=500, detail=str(e))
