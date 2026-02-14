from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import uuid4
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.user import User


class Cart(SQLModel, table=True):
    __tablename__ = "carts"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    session_id: Optional[str] = Field(default=None, index=True)
    user_id: Optional[str] = Field(default=None, foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    items: list["CartItem"] = Relationship(back_populates="cart")
    user: Optional["User"] = Relationship(back_populates="carts")


class CartItem(SQLModel, table=True):
    __tablename__ = "cart_items"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    cart_id: str = Field(foreign_key="carts.id")
    product_id: str = Field(foreign_key="products.id")
    color_id: str
    size_id: str
    quantity: int = 1
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    cart: Optional[Cart] = Relationship(back_populates="items")
