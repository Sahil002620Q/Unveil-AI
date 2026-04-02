from fastapi import FastAPI, Request, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, StreamingResponse
import httpx
import uvicorn
import os

app = FastAPI(title="Unveil AI Backend")

# Configuration for local LLM
LLM_API_BASE = os.getenv("LLM_API_BASE", "http://127.0.0.1:1234/v1")
LLM_API_KEY = os.getenv("LLM_API_KEY", "lm-studio")

# Mount frontend static files
pwd = os.path.dirname(os.path.abspath(__file__))
frontend_dir = os.path.join(pwd, "..", "frontend")
app.mount("/frontend", StaticFiles(directory=frontend_dir), name="frontend")
# Also mount root to frontend index.html
from fastapi.responses import FileResponse
@app.get("/")
def serve_root():
    pwd = os.path.dirname(os.path.abspath(__file__))
    frontend_index = os.path.join(pwd, "..", "frontend", "index.html")
    return FileResponse(frontend_index)

@app.post("/chat")
async def chat_proxy(request: Request):
    """Proxy chat requests to the local LLM server and stream response."""
    payload = await request.json()
    payload["stream"] = True  # Enforce streaming
    
    async def stream_generator():
        client = httpx.AsyncClient()
        try:
            async with client.stream(
                "POST", 
                f"{LLM_API_BASE}/chat/completions",
                json=payload,
                headers={"Authorization": f"Bearer {LLM_API_KEY}"},
                timeout=120.0
            ) as response:
                response.raise_for_status()
                async for chunk in response.aiter_bytes():
                    yield chunk
        except Exception as e:
            print(f"Streaming error: {e}")
            yield f"data: {{\"error\": \"{str(e)}\"}}\n\n".encode("utf-8")
        finally:
            await client.aclose()
            
    return StreamingResponse(stream_generator(), media_type="text/event-stream")

@app.post("/upload")
async def handle_upload(file: UploadFile = File(...)):
    """Placeholder upload handler. Can be extended to extract text from PDFs or save images."""
    try:
        contents = await file.read()
        return {"filename": file.filename, "size": len(contents), "message": "File uploaded successfully. Processing not yet implemented."}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

if __name__ == "__main__":
    pwd = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(pwd, "..", "frontend")
    if not os.path.exists(frontend_dir):
        print(f"Warning: Frontend directory not found at {frontend_dir}. Please ensure it exists.")
    uvicorn.run("main:app", host="127.0.0.1", port=4050, reload=True)
