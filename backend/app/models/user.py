from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import uuid4
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.cart import Cart
    from app.models.order import Order
    from app.models.wishlist import WishlistItem


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: str = "TW"
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    carts: list["Cart"] = Relationship(back_populates="user")
    orders: list["Order"] = Relationship(back_populates="user")
    wishlist_items: list["WishlistItem"] = Relationship(back_populates="user")
