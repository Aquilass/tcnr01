from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CreateOrderRequest(BaseModel):
    recipient_name: str
    recipient_phone: str
    shipping_address: str
    shipping_city: Optional[str] = None
    shipping_state: Optional[str] = None
    shipping_postal_code: Optional[str] = None
    payment_method: str = "credit_card"
    notes: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: str
    productId: str
    productSlug: str
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


class OrderResponse(BaseModel):
    id: str
    orderNumber: str
    status: str
    paymentMethod: str
    paymentStatus: str
    itemsTotal: float
    shippingFee: float
    totalAmount: float
    recipientName: str
    recipientPhone: str
    shippingAddress: str
    shippingCity: Optional[str] = None
    shippingState: Optional[str] = None
    shippingPostalCode: Optional[str] = None
    notes: Optional[str] = None
    items: list[OrderItemResponse]
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True


class OrderListItem(BaseModel):
    id: str
    orderNumber: str
    status: str
    totalAmount: float
    itemCount: int
    firstItemImage: str
    createdAt: datetime

    class Config:
        from_attributes = True
