from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import sqlite3
import os

app = FastAPI(title="Schedulink API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory storage for testing
users_db = []
slots_db = []
user_counter = 1
slot_counter = 1

# Pydantic models
class UserCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None

class SlotCreate(BaseModel):
    title: str
    description: Optional[str] = None
    date: str
    start_time: str
    end_time: str
    user_id: Optional[int] = None

class SlotOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    date: str
    start_time: str
    end_time: str
    is_booked: bool = False
    user_id: Optional[int] = None
    booked_by_user_id: Optional[int] = None

# Routes
@app.get("/")
def read_root():
    return {"message": "Schedulink Backend API is running", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "schedulink-api"}

@app.post("/users", response_model=UserOut)
def create_user(user: UserCreate):
    global user_counter
    
    # Check for duplicate email
    for existing_user in users_db:
        if existing_user["email"] == user.email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = {
        "id": user_counter,
        "name": user.name,
        "email": user.email,
        "phone": user.phone
    }
    users_db.append(new_user)
    user_counter += 1
    return new_user

@app.get("/users", response_model=List[UserOut])
def get_users():
    return users_db

@app.post("/slots", response_model=SlotOut)  
def create_slot(slot: SlotCreate):
    global slot_counter
    
    # Validate user exists if provided
    if slot.user_id:
        user_exists = any(user["id"] == slot.user_id for user in users_db)
        if not user_exists:
            raise HTTPException(status_code=404, detail="User not found")
    
    new_slot = {
        "id": slot_counter,
        "title": slot.title,
        "description": slot.description,
        "date": slot.date,
        "start_time": slot.start_time,
        "end_time": slot.end_time,
        "is_booked": False,
        "user_id": slot.user_id,
        "booked_by_user_id": None
    }
    slots_db.append(new_slot)
    slot_counter += 1
    return new_slot

@app.get("/slots", response_model=List[SlotOut])
def get_slots():
    return slots_db

@app.patch("/slots/{slot_id}/book", response_model=SlotOut)
def book_slot(slot_id: int, booking_data: dict):
    user_id = booking_data.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    
    # Find slot
    slot = None
    for s in slots_db:
        if s["id"] == slot_id:
            slot = s
            break
    
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    
    if slot["is_booked"]:
        raise HTTPException(status_code=400, detail="Slot already booked")
    
    # Verify user exists
    user_exists = any(user["id"] == user_id for user in users_db)
    if not user_exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    slot["is_booked"] = True
    slot["booked_by_user_id"] = user_id
    return slot

@app.patch("/slots/{slot_id}/cancel", response_model=SlotOut)
def cancel_booking(slot_id: int):
    # Find slot
    slot = None
    for s in slots_db:
        if s["id"] == slot_id:
            slot = s
            break
    
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    
    if not slot["is_booked"]:
        raise HTTPException(status_code=400, detail="Slot is not booked")
    
    slot["is_booked"] = False
    slot["booked_by_user_id"] = None
    return slot

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
