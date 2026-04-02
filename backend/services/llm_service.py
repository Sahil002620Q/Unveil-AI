import httpx

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "dolphin" # Assuming dolphin is installed in Ollama. Can be "dolphin-llama3" or similar.

async def ask_ollama(messages: list) -> str:
    payload = {
        "model": MODEL_NAME,
        "messages": messages,
        "stream": False
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(OLLAMA_URL, json=payload)
            response.raise_for_status()
            data = response.json()
            return data.get("message", {}).get("content", "")
        except Exception as e:
            print(f"Ollama Error: {e}")
            return f"Error communicating with local LLM: {str(e)}"
