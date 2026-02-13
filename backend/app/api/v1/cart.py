from fastapi import APIRouter, Depends, Header
from sqlmodel import Session
from uuid import uuid4
from app.db.session import get_session
from app.services.cart_service import CartService
from app.schemas import CartResponse, AddToCartRequest, UpdateCartItemRequest

router = APIRouter()


def get_session_id(x_session_id: str | None = Header(None)) -> str:
    return x_session_id or str(uuid4())


@router.get("", response_model=CartResponse)
def get_cart(
    session_id: str = Depends(get_session_id),
    session: Session = Depends(get_session),
):
    service = CartService(session)
    return service.get_cart(session_id)


@router.post("/items", response_model=CartResponse)
def add_to_cart(
    request: AddToCartRequest,
    session_id: str = Depends(get_session_id),
    session: Session = Depends(get_session),
):
    service = CartService(session)
    return service.add_item(session_id, request)


@router.put("/items/{item_id}", response_model=CartResponse)
def update_cart_item(
    item_id: str,
    request: UpdateCartItemRequest,
    session_id: str = Depends(get_session_id),
    session: Session = Depends(get_session),
):
    service = CartService(session)
    return service.update_item(session_id, item_id, request.quantity)


@router.delete("/items/{item_id}", response_model=CartResponse)
def remove_cart_item(
    item_id: str,
    session_id: str = Depends(get_session_id),
    session: Session = Depends(get_session),
):
    service = CartService(session)
    return service.remove_item(session_id, item_id)


@router.delete("", response_model=CartResponse)
def clear_cart(
    session_id: str = Depends(get_session_id),
    session: Session = Depends(get_session),
):
    service = CartService(session)
    return service.clear_cart(session_id)
