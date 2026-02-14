from typing import Optional

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.core.deps import get_current_user_optional, get_current_user_required, get_session_id
from app.db.session import get_session
from app.models.user import User
from app.schemas.order import CreateOrderRequest, OrderResponse, OrderListItem
from app.services.order_service import OrderService

router = APIRouter()


@router.post("", response_model=OrderResponse)
def create_order(
    request: CreateOrderRequest,
    session_id: str = Depends(get_session_id),
    user: Optional[User] = Depends(get_current_user_optional),
    session: Session = Depends(get_session),
):
    service = OrderService(session)
    return service.create_order(
        request,
        session_id=session_id if not user else None,
        user_id=user.id if user else None,
    )


@router.get("", response_model=list[OrderListItem])
def get_orders(
    user: User = Depends(get_current_user_required),
    session: Session = Depends(get_session),
):
    service = OrderService(session)
    return service.get_orders(user.id)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: str,
    session_id: str = Depends(get_session_id),
    user: Optional[User] = Depends(get_current_user_optional),
    session: Session = Depends(get_session),
):
    service = OrderService(session)
    return service.get_order(
        order_id,
        session_id=session_id if not user else None,
        user_id=user.id if user else None,
    )
