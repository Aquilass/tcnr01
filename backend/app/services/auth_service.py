from datetime import datetime

import jwt
from sqlmodel import Session, select

from app.core.exceptions import BadRequestError
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)
from app.models import Cart, CartItem, User
from app.schemas import (
    ChangePasswordRequest,
    TokenResponse,
    UserRegisterRequest,
    UserResponse,
    UserUpdateRequest,
)


class AuthService:
    def __init__(self, session: Session):
        self.session = session

    def register(self, request: UserRegisterRequest, session_id: str | None = None) -> TokenResponse:
        existing = self.session.exec(
            select(User).where(User.email == request.email)
        ).first()
        if existing:
            raise BadRequestError("Email already registered")

        if len(request.password) < 6:
            raise BadRequestError("Password must be at least 6 characters")

        user = User(
            email=request.email,
            password_hash=get_password_hash(request.password),
            first_name=request.first_name,
            last_name=request.last_name,
        )
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)

        if session_id:
            self._merge_cart(session_id, user.id)

        return TokenResponse(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )

    def login(self, email: str, password: str, session_id: str | None = None) -> TokenResponse:
        user = self.session.exec(
            select(User).where(User.email == email)
        ).first()
        if not user or not verify_password(password, user.password_hash):
            raise BadRequestError("Invalid email or password")
        if not user.is_active:
            raise BadRequestError("Account is inactive")

        if session_id:
            self._merge_cart(session_id, user.id)

        return TokenResponse(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )

    def refresh_token(self, refresh_token_str: str) -> TokenResponse:
        try:
            payload = decode_token(refresh_token_str)
        except jwt.ExpiredSignatureError:
            raise BadRequestError("Refresh token expired")
        except jwt.InvalidTokenError:
            raise BadRequestError("Invalid refresh token")

        if payload.get("type") != "refresh":
            raise BadRequestError("Invalid token type")

        user_id = payload.get("sub")
        user = self.session.exec(select(User).where(User.id == user_id)).first()
        if not user or not user.is_active:
            raise BadRequestError("User not found or inactive")

        return TokenResponse(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )

    def get_user(self, user: User) -> UserResponse:
        return UserResponse(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            phone=user.phone,
            address_line1=user.address_line1,
            address_line2=user.address_line2,
            city=user.city,
            state=user.state,
            postal_code=user.postal_code,
            country=user.country,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

    def update_user(self, user: User, request: UserUpdateRequest) -> UserResponse:
        update_data = request.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user, key, value)
        user.updated_at = datetime.utcnow()
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return self.get_user(user)

    def change_password(self, user: User, request: ChangePasswordRequest) -> None:
        if not verify_password(request.current_password, user.password_hash):
            raise BadRequestError("Current password is incorrect")
        if len(request.new_password) < 6:
            raise BadRequestError("New password must be at least 6 characters")
        user.password_hash = get_password_hash(request.new_password)
        user.updated_at = datetime.utcnow()
        self.session.add(user)
        self.session.commit()

    def _merge_cart(self, session_id: str, user_id: str) -> None:
        anon_cart = self.session.exec(
            select(Cart).where(Cart.session_id == session_id, Cart.user_id.is_(None))
        ).first()
        if not anon_cart or not anon_cart.items:
            return

        user_cart = self.session.exec(
            select(Cart).where(Cart.user_id == user_id)
        ).first()
        if not user_cart:
            user_cart = Cart(user_id=user_id)
            self.session.add(user_cart)
            self.session.commit()
            self.session.refresh(user_cart)

        for anon_item in anon_cart.items:
            existing = self.session.exec(
                select(CartItem).where(
                    CartItem.cart_id == user_cart.id,
                    CartItem.product_id == anon_item.product_id,
                    CartItem.color_id == anon_item.color_id,
                    CartItem.size_id == anon_item.size_id,
                )
            ).first()
            if existing:
                existing.quantity = min(existing.quantity + anon_item.quantity, 10)
                existing.updated_at = datetime.utcnow()
            else:
                new_item = CartItem(
                    cart_id=user_cart.id,
                    product_id=anon_item.product_id,
                    color_id=anon_item.color_id,
                    size_id=anon_item.size_id,
                    quantity=min(anon_item.quantity, 10),
                )
                self.session.add(new_item)
            self.session.delete(anon_item)

        self.session.delete(anon_cart)
        user_cart.updated_at = datetime.utcnow()
        self.session.commit()
