from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Simple test app
app = FastAPI(title="Schedulink Test API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Schedulink Backend API is running", "status": "ok"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "schedulink-api"}

@app.get("/test")
def test_endpoint():
    return {"test": "success", "message": "Backend is working"}

# Dummy endpoints for testing
@app.get("/users")
def get_users():
    return []

@app.post("/users")
def create_user(user_data: dict):
    return {"id": 1, "message": "User created", "data": user_data}

@app.get("/slots")
def get_slots():
    return []

@app.post("/slots") 
def create_slot(slot_data: dict):
    return {"id": 1, "message": "Slot created", "data": slot_data}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
