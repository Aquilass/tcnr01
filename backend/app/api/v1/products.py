from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
from app.db.session import get_session
from app.services.product_service import ProductService
from app.schemas import ProductResponse, ProductListItemResponse

router = APIRouter()


@router.get("", response_model=dict)
def get_products(
    category: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(24, ge=1, le=100),
    session: Session = Depends(get_session),
):
    service = ProductService(session)
    products, total = service.get_products(category, page, page_size)
    total_pages = (total + page_size - 1) // page_size

    return {
        "data": products,
        "total": total,
        "page": page,
        "pageSize": page_size,
        "totalPages": total_pages,
    }


@router.get("/{slug}", response_model=ProductResponse)
def get_product(
    slug: str,
    session: Session = Depends(get_session),
):
    service = ProductService(session)
    return service.get_product_by_slug(slug)
