from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.llm_service import ask_ollama

router = APIRouter()

class PhishingRequest(BaseModel):
    url: str

@router.post("/")
async def detect_phishing(request: PhishingRequest):
    system_prompt = """
    You are an expert cybersecurity analyst specialized in phishing detection.
    Analyze the following URL for phishing indicators. 
    Explain why it looks suspicious or safe based on domain name, structure, and known patterns.
    Do not visit the URL, only analyze the string. Provide a straightforward, practical analysis.
    Finally, give a conclusion: [SAFE], [SUSPICIOUS], or [MALICIOUS].
    """
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"URL to analyze: {request.url}"}
    ]
    
    response_text = await ask_ollama(messages)
    return {"reply": response_text}
