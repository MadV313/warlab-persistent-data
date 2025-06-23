# main.py — JSON File Storage API (Read/Write) for Discord Bot
import os
import json
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Directory where your JSON files are stored
DATA_DIR = os.path.join(os.getcwd(), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# Allow any origin (for now); lock this down later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/data/{filename}")
async def read_file(filename: str):
    """GET a JSON file from /data/filename"""
    file_path = os.path.join(DATA_DIR, filename)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found.")
    with open(file_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Invalid JSON format.")
    return JSONResponse(content=data)

@app.put("/data/{filename}")
async def write_file(filename: str, request: Request):
    """PUT to /data/filename to overwrite file with new JSON"""
    file_path = os.path.join(DATA_DIR, filename)
    try:
        body = await request.json()
    except:
        raise HTTPException(status_code=400, detail="Invalid JSON body.")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(body, f, indent=2)
    return {"status": "✅ File saved", "file": filename}
