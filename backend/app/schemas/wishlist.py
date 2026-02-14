from pydantic import BaseModel
from datetime import datetime


class AddWishlistRequest(BaseModel):
    productId: str


class WishlistItemResponse(BaseModel):
    id: str
    productId: str
    productName: str
    productImage: str
    productSlug: str
    price: float
    createdAt: datetime

    class Config:
        from_attributes = True


class WishlistResponse(BaseModel):
    items: list[WishlistItemResponse]
    count: int
