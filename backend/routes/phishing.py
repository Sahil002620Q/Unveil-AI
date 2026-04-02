from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.llm_service import generate_response

router = APIRouter()

class PhishingRequest(BaseModel):
    url: str

@router.post("")
def url_detector(request: PhishingRequest):
    system_prompt = """
    You are an expert cybersecurity URL Detector.
    Analyze the provided URL for phishing patterns visually. Explain domain structure anomalies or reassure if it looks safe.
    Always conclude precisely with [SAFE], [SUSPICIOUS], or [MALICIOUS].
    """
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Analyze this URL: {request.url}"}
    ]
    
    response_text = generate_response(messages)
    return {"reply": response_text}
