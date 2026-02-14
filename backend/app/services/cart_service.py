from sqlmodel import Session, select
from datetime import datetime
from typing import Optional
from app.models import Cart, CartItem, Product, ProductColor, ProductSize
from app.schemas import CartResponse, CartItemResponse, AddToCartRequest
from app.core.exceptions import (
    CartItemNotFoundError,
    ProductNotFoundError,
    OutOfStockError,
    NotFoundError,
)


class CartService:
    def __init__(self, session: Session):
        self.session = session

    def get_or_create_cart(
        self, session_id: Optional[str] = None, user_id: Optional[str] = None
    ) -> Cart:
        if user_id:
            cart = self.session.exec(
                select(Cart).where(Cart.user_id == user_id)
            ).first()
            if not cart:
                cart = Cart(user_id=user_id)
                self.session.add(cart)
                self.session.commit()
                self.session.refresh(cart)
            return cart

        if session_id:
            cart = self.session.exec(
                select(Cart).where(
                    Cart.session_id == session_id, Cart.user_id.is_(None)
                )
            ).first()
            if not cart:
                cart = Cart(session_id=session_id)
                self.session.add(cart)
                self.session.commit()
                self.session.refresh(cart)
            return cart

        cart = Cart()
        self.session.add(cart)
        self.session.commit()
        self.session.refresh(cart)
        return cart

    def get_cart(
        self, session_id: Optional[str] = None, user_id: Optional[str] = None
    ) -> CartResponse:
        cart = self.get_or_create_cart(session_id=session_id, user_id=user_id)
        return self._build_cart_response(cart)

    def add_item(
        self,
        request: AddToCartRequest,
        session_id: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> CartResponse:
        cart = self.get_or_create_cart(session_id=session_id, user_id=user_id)

        product = self.session.exec(
            select(Product).where(Product.id == request.productId)
        ).first()
        if not product:
            raise ProductNotFoundError()

        size = self.session.exec(
            select(ProductSize).where(
                ProductSize.id == request.sizeId,
                ProductSize.product_id == request.productId,
            )
        ).first()
        if not size:
            raise NotFoundError("Size not found")
        if size.stock < request.quantity:
            raise OutOfStockError()

        existing_item = self.session.exec(
            select(CartItem).where(
                CartItem.cart_id == cart.id,
                CartItem.product_id == request.productId,
                CartItem.color_id == request.colorId,
                CartItem.size_id == request.sizeId,
            )
        ).first()

        if existing_item:
            new_quantity = existing_item.quantity + request.quantity
            if new_quantity > size.stock:
                raise OutOfStockError()
            existing_item.quantity = min(new_quantity, 10)
            existing_item.updated_at = datetime.utcnow()
        else:
            new_item = CartItem(
                cart_id=cart.id,
                product_id=request.productId,
                color_id=request.colorId,
                size_id=request.sizeId,
                quantity=request.quantity,
            )
            self.session.add(new_item)

        cart.updated_at = datetime.utcnow()
        self.session.commit()
        self.session.refresh(cart)

        return self._build_cart_response(cart)

    def update_item(
        self,
        item_id: str,
        quantity: int,
        session_id: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> CartResponse:
        cart = self.get_or_create_cart(session_id=session_id, user_id=user_id)

        item = self.session.exec(
            select(CartItem).where(
                CartItem.id == item_id, CartItem.cart_id == cart.id
            )
        ).first()

        if not item:
            raise CartItemNotFoundError()

        if quantity == 0:
            self.session.delete(item)
        else:
            size = self.session.exec(
                select(ProductSize).where(ProductSize.id == item.size_id)
            ).first()
            if size and quantity > size.stock:
                raise OutOfStockError()

            item.quantity = min(quantity, 10)
            item.updated_at = datetime.utcnow()

        cart.updated_at = datetime.utcnow()
        self.session.commit()
        self.session.refresh(cart)

        return self._build_cart_response(cart)

    def remove_item(
        self,
        item_id: str,
        session_id: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> CartResponse:
        return self.update_item(
            item_id, 0, session_id=session_id, user_id=user_id
        )

    def clear_cart(
        self, session_id: Optional[str] = None, user_id: Optional[str] = None
    ) -> CartResponse:
        cart = self.get_or_create_cart(session_id=session_id, user_id=user_id)

        for item in cart.items:
            self.session.delete(item)

        cart.updated_at = datetime.utcnow()
        self.session.commit()
        self.session.refresh(cart)

        return self._build_cart_response(cart)

    def _build_cart_response(self, cart: Cart) -> CartResponse:
        items = []
        subtotal = 0.0
        item_count = 0

        for item in cart.items:
            product = self.session.exec(
                select(Product).where(Product.id == item.product_id)
            ).first()
            if not product:
                continue

            color = self.session.exec(
                select(ProductColor).where(ProductColor.id == item.color_id)
            ).first()

            size = self.session.exec(
                select(ProductSize).where(ProductSize.id == item.size_id)
            ).first()

            main_image = next(
                (img for img in product.images if img.is_main),
                product.images[0] if product.images else None,
            )

            item_total = product.price * item.quantity
            subtotal += item_total
            item_count += item.quantity

            items.append(
                CartItemResponse(
                    id=item.id,
                    productId=product.id,
                    productName=product.name,
                    productImage=main_image.url if main_image else "",
                    colorId=item.color_id,
                    colorName=color.name if color else "",
                    sizeId=item.size_id,
                    size=size.size if size else "",
                    price=product.price,
                    quantity=item.quantity,
                )
            )

        return CartResponse(
            id=cart.id,
            sessionId=cart.session_id,
            items=items,
            itemCount=item_count,
            subtotal=subtotal,
            createdAt=cart.created_at,
            updatedAt=cart.updated_at,
        )
