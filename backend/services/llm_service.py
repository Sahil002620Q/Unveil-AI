from openai import OpenAI
import os

# Configure the local LLM endpoint (LM Studio local server)
LOCAL_LLM_URL = os.getenv("LLM_BASE_URL", "http://localhost:1234/v1")
LOCAL_LLM_API_KEY = "lm-studio" # Replace "ollama" with "lm-studio" if required. It's often ignored locally.
DEFAULT_MODEL = "dolphin3.0-llama3.1-8b" # Used dolphin model name

client = OpenAI(
    base_url=LOCAL_LLM_URL,
    api_key=LOCAL_LLM_API_KEY
)

def generate_response(messages: list, model: str = DEFAULT_MODEL) -> str:
    """
    Generate response from local LLM via OpenAI API.
    """
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.7,
            stream=False
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"LLM Error: {e}")
        return f"Error communicating with local LLM: {str(e)}"
