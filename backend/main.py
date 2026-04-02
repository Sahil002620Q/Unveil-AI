from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from backend.routes import chat, phishing, reviewer

app = FastAPI(title="Hackathon AI Bot")

# Include routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(phishing.router, prefix="/api/detect-phishing", tags=["phishing"])
app.include_router(reviewer.router, prefix="/api/honest-review", tags=["reviewer"])

# Mount static files correctly
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

@app.get("/")
async def read_index():
    return FileResponse(os.path.join(frontend_dir, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
