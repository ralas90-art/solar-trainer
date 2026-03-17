from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI(title="DIAGNOSTIC SERVER")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online", 
        "version": "0.6.0-ULTRA-DIAGNOSTIC", 
        "timestamp": datetime.now().isoformat(),
        "info": "This is a simplified version to debug CORS and deployment issues."
    }

@app.get("/login")
def login_get_test():
    return {"message": "If you see this, the /login route exists on GET."}

@app.post("/login")
def login_post_test(data: dict):
    return {"status": "ok", "message": "Diagnostic login successful", "recieved": data}
