from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import uuid4
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.product import Product


class WishlistItem(SQLModel, table=True):
    __tablename__ = "wishlist_items"
    __table_args__ = (
        {"extend_existing": True},
    )

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    product_id: str = Field(foreign_key="products.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional["User"] = Relationship(back_populates="wishlist_items")
    product: Optional["Product"] = Relationship()
