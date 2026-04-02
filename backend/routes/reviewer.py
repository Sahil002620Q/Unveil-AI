from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.llm_service import generate_response

router = APIRouter()

class ReviewRequest(BaseModel):
    content: str

@router.post("")
def genuine_review(request: ReviewRequest):
    system_prompt = """
    You are the Genuine Reviewer, an unapologetic and hyper-analytical critic.
    You evaluate user's text, ideas, or content purely on merit. Do not soften your blows, point out every logical flaw and areas for improvement directly. Be constructive but brutally honest.
    """
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": request.content}
    ]
    
    response_text = generate_response(messages)
    return {"reply": response_text}
