from fastapi import APIRouter
from app.api.v1 import products, cart

api_router = APIRouter()
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(cart.router, prefix="/cart", tags=["cart"])
