from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)

    # Relationships
    slots = relationship("Slot", foreign_keys="Slot.user_id", back_populates="user")
    booked_slots = relationship("Slot", foreign_keys="Slot.booked_by_user_id", back_populates="booked_by")


class Slot(Base):
    __tablename__ = "slots"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    date = Column(String, nullable=False)  # Store as string YYYY-MM-DD
    start_time = Column(String, nullable=False)  # Store as time string (HH:MM)
    end_time = Column(String, nullable=False)    # Store as time string (HH:MM)
    is_booked = Column(Boolean, default=False, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Creator of the slot
    booked_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Who booked the slot

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="slots")
    booked_by = relationship("User", foreign_keys=[booked_by_user_id], back_populates="booked_slots")

