from fastapi import APIRouter, Depends, Header
from sqlmodel import Session

from app.core.deps import get_current_user_required, get_session_id
from app.db.session import get_session
from app.models.user import User
from app.schemas import (
    ChangePasswordRequest,
    RefreshTokenRequest,
    TokenResponse,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
    UserUpdateRequest,
)
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
def register(
    request: UserRegisterRequest,
    x_session_id: str | None = Header(None),
    session: Session = Depends(get_session),
):
    service = AuthService(session)
    return service.register(request, session_id=x_session_id)


@router.post("/login", response_model=TokenResponse)
def login(
    request: UserLoginRequest,
    x_session_id: str | None = Header(None),
    session: Session = Depends(get_session),
):
    service = AuthService(session)
    return service.login(request.email, request.password, session_id=x_session_id)


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(
    request: RefreshTokenRequest,
    session: Session = Depends(get_session),
):
    service = AuthService(session)
    return service.refresh_token(request.refresh_token)


@router.get("/me", response_model=UserResponse)
def get_me(
    user: User = Depends(get_current_user_required),
    session: Session = Depends(get_session),
):
    service = AuthService(session)
    return service.get_user(user)


@router.put("/me", response_model=UserResponse)
def update_me(
    request: UserUpdateRequest,
    user: User = Depends(get_current_user_required),
    session: Session = Depends(get_session),
):
    service = AuthService(session)
    return service.update_user(user, request)


@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    user: User = Depends(get_current_user_required),
    session: Session = Depends(get_session),
):
    service = AuthService(session)
    service.change_password(user, request)
    return {"message": "Password changed successfully"}
