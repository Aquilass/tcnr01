from fastapi import APIRouter
from app.api.v1 import products, cart, auth, orders, wishlist

api_router = APIRouter()
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(cart.router, prefix="/cart", tags=["cart"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(wishlist.router, prefix="/wishlist", tags=["wishlist"])
