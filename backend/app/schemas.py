from pydantic import BaseModel, Field
from typing import Optional


class UserCreate(BaseModel):
    email: str = Field(..., description="User's email address")
    name: str = Field(..., description="User's full name")
    phone: Optional[str] = Field(None, description="User's phone number")


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    phone: Optional[str] = None

    class Config:
        from_attributes = True


class SlotCreate(BaseModel):
    title: str = Field(..., description="Slot title")
    description: Optional[str] = Field(None, description="Slot description")
    date: str = Field(..., description="Date of the slot (YYYY-MM-DD)")
    start_time: str = Field(..., description="Start time (HH:MM format)")
    end_time: str = Field(..., description="End time (HH:MM format)")
    user_id: Optional[int] = Field(None, description="ID of the user creating the slot")


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

    class Config:
        from_attributes = True


class SlotBooking(BaseModel):
    user_id: int = Field(..., description="ID of the user booking the slot")


class SlotUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None

