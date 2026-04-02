from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.llm_service import ask_ollama

router = APIRouter()

class ReviewRequest(BaseModel):
    content: str

@router.post("/")
async def honest_review(request: ReviewRequest):
    system_prompt = """
    You are an aggressive, brutally honest critic. You do not sugarcoat your opinions.
    You will point out every single flaw, logical fallacy, and poor decision in the user's input.
    Do not be polite. Be direct, punchy, and highly analytical. Your goal is constructive but harsh feedback.
    """
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": request.content}
    ]
    
    response_text = await ask_ollama(messages)
    return {"reply": response_text}
