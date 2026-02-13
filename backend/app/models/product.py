from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import uuid4
from typing import Optional


class Product(SQLModel, table=True):
    __tablename__ = "products"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    slug: str = Field(unique=True, index=True)
    name: str
    subtitle: str
    description: str
    price: float
    original_price: Optional[float] = None
    category: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    images: list["ProductImage"] = Relationship(back_populates="product")
    colors: list["ProductColor"] = Relationship(back_populates="product")
    sizes: list["ProductSize"] = Relationship(back_populates="product")


class ProductImage(SQLModel, table=True):
    __tablename__ = "product_images"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    product_id: str = Field(foreign_key="products.id")
    url: str
    alt: str
    is_main: bool = False
    sort_order: int = 0

    # Relationships
    product: Optional[Product] = Relationship(back_populates="images")


class ProductColor(SQLModel, table=True):
    __tablename__ = "product_colors"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    product_id: str = Field(foreign_key="products.id")
    name: str
    code: str  # Hex color code
    image_url: str  # Thumbnail image for color selector
    sort_order: int = 0

    # Relationships
    product: Optional[Product] = Relationship(back_populates="colors")


class ProductSize(SQLModel, table=True):
    __tablename__ = "product_sizes"

    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    product_id: str = Field(foreign_key="products.id")
    size: str  # e.g., "US 8", "US 9", "M", "L"
    stock: int = 0
    sort_order: int = 0

    # Relationships
    product: Optional[Product] = Relationship(back_populates="sizes")
