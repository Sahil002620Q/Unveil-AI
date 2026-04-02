from openai import AsyncOpenAI
import os

# Configure the local LLM endpoint (Ollama via OpenAI API schema)
# To use LM Studio, change base_url to "http://localhost:1234/v1"
LOCAL_LLM_URL = os.getenv("LLM_BASE_URL", "http://localhost:11434/v1")
LOCAL_LLM_API_KEY = "ollama" # Replace "ollama" with "lm-studio" if required. It's often ignored locally.
DEFAULT_MODEL = "dolphin" # Assuming dolphin is installed via Ollama

client = AsyncOpenAI(
    base_url=LOCAL_LLM_URL,
    api_key=LOCAL_LLM_API_KEY
)

async def generate_response(messages: list, model: str = DEFAULT_MODEL) -> str:
    """
    Generate response from local LLM via OpenAI API.
    """
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.7,
            stream=False
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"LLM Error: {e}")
        return f"Error communicating with local LLM: {str(e)}"
