import os
from fastapi import FastAPI, Depends, HTTPException, Body, Path, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import engine, get_db
from typing import List, Optional
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Get environment configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
DEBUG = os.getenv("DEBUG", "true").lower() == "true"
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://manikandan.info,https://manikandan.info,http://appointment-booking-platform-1644783152.ap-south-1.elb.amazonaws.com").split(",")

# Initialize FastAPI app
app = FastAPI(
    title="Schedulink API",
    description="Smart Appointment Scheduler Backend",
    version="1.0.0",
    docs_url="/docs" if DEBUG else None,  # Disable docs in production
    redoc_url="/redoc" if DEBUG else None,
    openapi_url="/openapi.json" if DEBUG else None
)

# Enable CORS with environment-specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Schedulink Backend API is running", "version": "1.0.0"}

# Add a test endpoint for debugging
@app.get("/test")
def test_endpoint():
    logger.info("Test endpoint accessed")
    return {"status": "API is working", "timestamp": "2025-08-06"}

# ===== USER ENDPOINTS =====

@app.post("/users", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    logger.info(f"Attempting to create user with email: {user.email}")
    try:
        # Check if email already exists
        db_user = db.query(models.User).filter(models.User.email == user.email).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create new user
        new_user = models.User(**user.dict())
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        logger.info(f"Created user: {new_user.email}")
        return new_user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/users", response_model=List[schemas.UserOut])
def list_users(db: Session = Depends(get_db)):
    """Get all users"""
    logger.info("Fetching all users")
    try:
        users = db.query(models.User).all()
        logger.info(f"Found {len(users)} users")
        return users
    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/users/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get a specific user by ID"""
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ===== SLOT ENDPOINTS =====

@app.post("/slots", response_model=schemas.SlotOut)
def create_slot(slot: schemas.SlotCreate, db: Session = Depends(get_db)):
    """Create a new appointment slot"""
    try:
        # Validate user exists if user_id is provided
        if slot.user_id:
            user = db.query(models.User).filter(models.User.id == slot.user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
        
        # Create new slot
        new_slot = models.Slot(**slot.dict())
        db.add(new_slot)
        db.commit()
        db.refresh(new_slot)
        logger.info(f"Created slot: {new_slot.title} on {new_slot.date}")
        return new_slot
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating slot: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/slots", response_model=List[schemas.SlotOut])
def list_slots(
    date: Optional[str] = Query(None, description="Filter by date (YYYY-MM-DD)"),
    is_booked: Optional[bool] = Query(None, description="Filter by booking status"),
    user_id: Optional[int] = Query(None, description="Filter by user ID"),
    db: Session = Depends(get_db)
):
    """Get all slots with optional filters"""
    try:
        query = db.query(models.Slot)
        
        # Apply filters
        if date:
            query = query.filter(models.Slot.date == date)
        if is_booked is not None:
            query = query.filter(models.Slot.is_booked == is_booked)
        if user_id:
            query = query.filter(models.Slot.user_id == user_id)
        
        slots = query.all()
        return slots
    except Exception as e:
        logger.error(f"Error fetching slots: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ✅ Book a slot
@app.patch("/slots/{slot_id}/book", response_model=schemas.SlotOut)
def book_slot(
    slot_id: int = Path(..., description="ID of the slot to book"),
    booking: schemas.SlotBooking = Body(...),
    db: Session = Depends(get_db)
):
    """Book an available slot"""
    try:
        # Find the slot
        slot = db.query(models.Slot).filter(models.Slot.id == slot_id).first()
        if not slot:
            raise HTTPException(status_code=404, detail="Slot not found")
        
        # Check if slot is already booked
        if slot.is_booked:
            raise HTTPException(status_code=400, detail="Slot is already booked")
        
        # Verify the user exists
        user = db.query(models.User).filter(models.User.id == booking.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Book the slot
        slot.is_booked = True
        slot.booked_by_user_id = booking.user_id
        db.commit()
        db.refresh(slot)
        
        logger.info(f"Slot {slot_id} booked by user {booking.user_id}")
        return slot
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error booking slot {slot_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.patch("/slots/{slot_id}/cancel", response_model=schemas.SlotOut)
def cancel_booking(
    slot_id: int = Path(..., description="ID of the slot to cancel"),
    db: Session = Depends(get_db)
):
    """Cancel a booking for a slot"""
    try:
        slot = db.query(models.Slot).filter(models.Slot.id == slot_id).first()
        if not slot:
            raise HTTPException(status_code=404, detail="Slot not found")
        
        if not slot.is_booked:
            raise HTTPException(status_code=400, detail="Slot is not booked")
        
        # Cancel the booking
        slot.is_booked = False
        slot.booked_by_user_id = None
        db.commit()
        db.refresh(slot)
        
        logger.info(f"Booking cancelled for slot {slot_id}")
        return slot
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error cancelling booking for slot {slot_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/slots/{slot_id}", response_model=schemas.SlotOut)
def get_slot(slot_id: int, db: Session = Depends(get_db)):
    """Get a specific slot by ID"""
    try:
        slot = db.query(models.Slot).filter(models.Slot.id == slot_id).first()
        if not slot:
            raise HTTPException(status_code=404, detail="Slot not found")
        return slot
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching slot {slot_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.put("/slots/{slot_id}", response_model=schemas.SlotOut)
def update_slot(
    slot_id: int,
    slot_update: schemas.SlotUpdate,
    db: Session = Depends(get_db)
):
    """Update a slot"""
    try:
        slot = db.query(models.Slot).filter(models.Slot.id == slot_id).first()
        if not slot:
            raise HTTPException(status_code=404, detail="Slot not found")
        
        # Update only provided fields
        update_data = slot_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(slot, field, value)
        
        db.commit()
        db.refresh(slot)
        
        logger.info(f"Updated slot {slot_id}")
        return slot
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating slot {slot_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.delete("/slots/{slot_id}")
def delete_slot(slot_id: int, db: Session = Depends(get_db)):
    """Delete a slot"""
    try:
        slot = db.query(models.Slot).filter(models.Slot.id == slot_id).first()
        if not slot:
            raise HTTPException(status_code=404, detail="Slot not found")
        
        db.delete(slot)
        db.commit()
        
        logger.info(f"Deleted slot {slot_id}")
        return {"message": "Slot deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting slot {slot_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ===== USER SLOT ENDPOINTS =====

@app.get("/users/{user_id}/slots", response_model=List[schemas.SlotOut])
def get_user_slots(user_id: int, db: Session = Depends(get_db)):
    """Get all slots created by a specific user"""
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        slots = db.query(models.Slot).filter(models.Slot.user_id == user_id).all()
        return slots
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching slots for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/users/{user_id}/bookings", response_model=List[schemas.SlotOut])
def get_user_bookings(user_id: int, db: Session = Depends(get_db)):
    """Get all slots booked by a specific user"""
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        bookings = db.query(models.Slot).filter(models.Slot.booked_by_user_id == user_id).all()
        return bookings
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching bookings for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ===== HEALTH CHECK =====

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "schedulink-api"}


