from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.llm_service import generate_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/")
async def universal_assistant(request: ChatRequest):
    system_prompt = "You are Unveil AI, a highly advanced, premium Universal Assistant. Provide clear, concise, and helpful answers without sugarcoating. Maintain a professional yet confident persona."
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": request.message}
    ]
    
    response_text = await generate_response(messages)
    return {"reply": response_text}
