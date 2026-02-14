from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.core.deps import get_current_user_required
from app.db.session import get_session
from app.models.user import User
from app.schemas.wishlist import AddWishlistRequest, WishlistItemResponse, WishlistResponse
from app.services.wishlist_service import WishlistService

router = APIRouter()


@router.get("", response_model=WishlistResponse)
def get_wishlist(
    user: User = Depends(get_current_user_required),
    session: Session = Depends(get_session),
):
    service = WishlistService(session)
    return service.get_wishlist(user.id)


@router.post("", response_model=WishlistItemResponse)
def add_to_wishlist(
    request: AddWishlistRequest,
    user: User = Depends(get_current_user_required),
    session: Session = Depends(get_session),
):
    service = WishlistService(session)
    return service.add_item(user.id, request.productId)


@router.delete("/{product_id}")
def remove_from_wishlist(
    product_id: str,
    user: User = Depends(get_current_user_required),
    session: Session = Depends(get_session),
):
    service = WishlistService(session)
    service.remove_item(user.id, product_id)
    return {"message": "已從收藏清單移除"}
