from pydantic import BaseModel, Field
from datetime import datetime


class CartItemResponse(BaseModel):
    id: str
    productId: str
    productName: str
    productImage: str
    colorId: str
    colorName: str
    sizeId: str
    size: str
    price: float
    quantity: int

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    id: str
    sessionId: str
    items: list[CartItemResponse]
    itemCount: int
    subtotal: float
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True


class AddToCartRequest(BaseModel):
    productId: str
    colorId: str
    sizeId: str
    quantity: int = Field(default=1, ge=1, le=10)


class UpdateCartItemRequest(BaseModel):
    quantity: int = Field(ge=0, le=10)
