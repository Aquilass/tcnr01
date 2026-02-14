from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import uuid4
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.user import User


class Order(SQLModel, table=True):
    __tablename__ = "orders"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    order_number: str = Field(index=True, unique=True)
    session_id: Optional[str] = Field(default=None, index=True)
    user_id: Optional[str] = Field(default=None, foreign_key="users.id", index=True)
    status: str = Field(default="pending")
    payment_method: str = Field(default="credit_card")
    payment_status: str = Field(default="paid")
    items_total: float
    shipping_fee: float
    total_amount: float
    recipient_name: str
    recipient_phone: str
    shipping_address: str
    shipping_city: Optional[str] = None
    shipping_state: Optional[str] = None
    shipping_postal_code: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    items: list["OrderItem"] = Relationship(back_populates="order")
    user: Optional["User"] = Relationship(back_populates="orders")


class OrderItem(SQLModel, table=True):
    __tablename__ = "order_items"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    order_id: str = Field(foreign_key="orders.id")
    product_id: str
    product_slug: str = Field(default="")
    product_name: str
    product_image: str
    color_id: str
    color_name: str
    size_id: str
    size: str
    price: float
    quantity: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    order: Optional[Order] = Relationship(back_populates="items")
