from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os

from backend.routes import chat, phishing, reviewer

app = FastAPI(title="Unveil AI")

# CORS middleware for testing locally if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(phishing.router, prefix="/api/detect-phishing", tags=["phishing"])
app.include_router(reviewer.router, prefix="/api/honest-review", tags=["reviewer"])

# Dummy route for file attachments
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    # In a full implementation, we'd parse the file and send its content to the LLM.
    # For now, we just acknowledge receipt.
    return {"message": f"File '{file.filename}' processed successfully.", "success": True}

# Mount static files
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
os.makedirs(frontend_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

@app.get("/")
async def read_index():
    return FileResponse(os.path.join(frontend_dir, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
