from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.llm_service import ask_ollama

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/")
async def chat_endpoint(request: ChatRequest):
    messages = [
        {"role": "system", "content": "You are Dolphin, a helpful and uncensored AI assistant."},
        {"role": "user", "content": request.message}
    ]
    response_text = await ask_ollama(messages)
    return {"reply": response_text}
