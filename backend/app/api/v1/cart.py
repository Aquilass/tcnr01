from typing import Optional

from fastapi import APIRouter, Depends, Header
from sqlmodel import Session

from app.core.deps import get_current_user_optional, get_session_id
from app.db.session import get_session
from app.models.user import User
from app.schemas import AddToCartRequest, CartResponse, UpdateCartItemRequest
from app.services.cart_service import CartService

router = APIRouter()


@router.get("", response_model=CartResponse)
def get_cart(
    session_id: str = Depends(get_session_id),
    user: Optional[User] = Depends(get_current_user_optional),
    session: Session = Depends(get_session),
):
    service = CartService(session)
    return service.get_cart(
        session_id=session_id if not user else None,
        user_id=user.id if user else None,
    )


@router.post("/items", response_model=CartResponse)
def add_to_cart(
    request: AddToCartRequest,
    session_id: str = Depends(get_session_id),
    user: Optional[User] = Depends(get_current_user_optional),
    session: Session = Depends(get_session),
):
    service = CartService(session)
    return service.add_item(
        request,
        session_id=session_id if not user else None,
        user_id=user.id if user else None,
    )


@router.put("/items/{item_id}", response_model=CartResponse)
def update_cart_item(
    item_id: str,
    request: UpdateCartItemRequest,
    session_id: str = Depends(get_session_id),
    user: Optional[User] = Depends(get_current_user_optional),
    session: Session = Depends(get_session),
):
    service = CartService(session)
    return service.update_item(
        item_id,
        request.quantity,
        session_id=session_id if not user else None,
        user_id=user.id if user else None,
    )


@router.delete("/items/{item_id}", response_model=CartResponse)
def remove_cart_item(
    item_id: str,
    session_id: str = Depends(get_session_id),
    user: Optional[User] = Depends(get_current_user_optional),
    session: Session = Depends(get_session),
):
    service = CartService(session)
    return service.remove_item(
        item_id,
        session_id=session_id if not user else None,
        user_id=user.id if user else None,
    )


@router.delete("", response_model=CartResponse)
def clear_cart(
    session_id: str = Depends(get_session_id),
    user: Optional[User] = Depends(get_current_user_optional),
    session: Session = Depends(get_session),
):
    service = CartService(session)
    return service.clear_cart(
        session_id=session_id if not user else None,
        user_id=user.id if user else None,
    )
