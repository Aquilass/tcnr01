from sqlmodel import Session, select
from datetime import datetime
from uuid import uuid4
import random
import string
from typing import Optional

from app.models import Cart, CartItem, Product, ProductColor, ProductSize
from app.models.order import Order, OrderItem
from app.schemas.order import (
    CreateOrderRequest,
    OrderResponse,
    OrderItemResponse,
    OrderListItem,
)
from app.core.exceptions import NotFoundError, BadRequestError


class OrderService:
    def __init__(self, session: Session):
        self.session = session

    def _generate_order_number(self) -> str:
        date_str = datetime.utcnow().strftime("%Y%m%d")
        random_part = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return f"ORD-{date_str}-{random_part}"

    def _get_cart(
        self, session_id: Optional[str] = None, user_id: Optional[str] = None
    ) -> Optional[Cart]:
        if user_id:
            return self.session.exec(
                select(Cart).where(Cart.user_id == user_id)
            ).first()
        if session_id:
            return self.session.exec(
                select(Cart).where(
                    Cart.session_id == session_id, Cart.user_id.is_(None)
                )
            ).first()
        return None

    def create_order(
        self,
        request: CreateOrderRequest,
        session_id: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> OrderResponse:
        cart = self._get_cart(session_id=session_id, user_id=user_id)
        if not cart or not cart.items:
            raise BadRequestError("購物車是空的，無法建立訂單")

        # Build order items with product snapshots
        order_items: list[OrderItem] = []
        items_total = 0.0

        for cart_item in cart.items:
            product = self.session.exec(
                select(Product).where(Product.id == cart_item.product_id)
            ).first()
            if not product:
                continue

            color = self.session.exec(
                select(ProductColor).where(ProductColor.id == cart_item.color_id)
            ).first()

            size = self.session.exec(
                select(ProductSize).where(ProductSize.id == cart_item.size_id)
            ).first()

            main_image = next(
                (img for img in product.images if img.is_main),
                product.images[0] if product.images else None,
            )

            item_total = product.price * cart_item.quantity
            items_total += item_total

            order_items.append(
                OrderItem(
                    product_id=product.id,
                    product_slug=product.slug,
                    product_name=product.name,
                    product_image=main_image.url if main_image else "",
                    color_id=cart_item.color_id,
                    color_name=color.name if color else "",
                    size_id=cart_item.size_id,
                    size=size.size if size else "",
                    price=product.price,
                    quantity=cart_item.quantity,
                )
            )

        if not order_items:
            raise BadRequestError("購物車中的商品已無效")

        shipping_fee = 0.0 if items_total >= 3000 else 120.0
        total_amount = items_total + shipping_fee

        order = Order(
            order_number=self._generate_order_number(),
            session_id=session_id,
            user_id=user_id,
            status="confirmed",
            payment_method=request.payment_method,
            payment_status="paid",
            items_total=items_total,
            shipping_fee=shipping_fee,
            total_amount=total_amount,
            recipient_name=request.recipient_name,
            recipient_phone=request.recipient_phone,
            shipping_address=request.shipping_address,
            shipping_city=request.shipping_city,
            shipping_state=request.shipping_state,
            shipping_postal_code=request.shipping_postal_code,
            notes=request.notes,
        )
        self.session.add(order)
        self.session.flush()

        for item in order_items:
            item.order_id = order.id
            self.session.add(item)

        # Clear cart
        for cart_item in cart.items:
            self.session.delete(cart_item)
        cart.updated_at = datetime.utcnow()

        self.session.commit()
        self.session.refresh(order)

        return self._build_order_response(order)

    def get_orders(self, user_id: str) -> list[OrderListItem]:
        orders = self.session.exec(
            select(Order)
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
        ).all()

        result = []
        for order in orders:
            first_image = ""
            item_count = 0
            for item in order.items:
                item_count += item.quantity
                if not first_image and item.product_image:
                    first_image = item.product_image

            result.append(
                OrderListItem(
                    id=order.id,
                    orderNumber=order.order_number,
                    status=order.status,
                    totalAmount=order.total_amount,
                    itemCount=item_count,
                    firstItemImage=first_image,
                    createdAt=order.created_at,
                )
            )
        return result

    def get_order(
        self,
        order_id: str,
        session_id: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> OrderResponse:
        order = self.session.exec(
            select(Order).where(Order.id == order_id)
        ).first()

        if not order:
            raise NotFoundError("訂單不存在")

        # Verify ownership
        if user_id and order.user_id == user_id:
            pass  # authorized
        elif session_id and order.session_id == session_id:
            pass  # authorized
        else:
            raise NotFoundError("訂單不存在")

        return self._build_order_response(order)

    def _build_order_response(self, order: Order) -> OrderResponse:
        items = [
            OrderItemResponse(
                id=item.id,
                productId=item.product_id,
                productSlug=item.product_slug,
                productName=item.product_name,
                productImage=item.product_image,
                colorId=item.color_id,
                colorName=item.color_name,
                sizeId=item.size_id,
                size=item.size,
                price=item.price,
                quantity=item.quantity,
            )
            for item in order.items
        ]

        return OrderResponse(
            id=order.id,
            orderNumber=order.order_number,
            status=order.status,
            paymentMethod=order.payment_method,
            paymentStatus=order.payment_status,
            itemsTotal=order.items_total,
            shippingFee=order.shipping_fee,
            totalAmount=order.total_amount,
            recipientName=order.recipient_name,
            recipientPhone=order.recipient_phone,
            shippingAddress=order.shipping_address,
            shippingCity=order.shipping_city,
            shippingState=order.shipping_state,
            shippingPostalCode=order.shipping_postal_code,
            notes=order.notes,
            items=items,
            createdAt=order.created_at,
            updatedAt=order.updated_at,
        )
