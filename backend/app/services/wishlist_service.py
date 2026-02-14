from sqlmodel import Session, select
from app.models import Product, WishlistItem
from app.schemas.wishlist import WishlistItemResponse, WishlistResponse
from app.core.exceptions import NotFoundError, BadRequestError


class WishlistService:
    def __init__(self, session: Session):
        self.session = session

    def get_wishlist(self, user_id: str) -> WishlistResponse:
        items = self.session.exec(
            select(WishlistItem)
            .where(WishlistItem.user_id == user_id)
            .order_by(WishlistItem.created_at.desc())
        ).all()

        result = []
        for item in items:
            product = self.session.exec(
                select(Product).where(Product.id == item.product_id)
            ).first()
            if not product:
                continue

            main_image = next(
                (img for img in product.images if img.is_main),
                product.images[0] if product.images else None,
            )

            result.append(
                WishlistItemResponse(
                    id=item.id,
                    productId=product.id,
                    productName=product.name,
                    productImage=main_image.url if main_image else "",
                    productSlug=product.slug,
                    price=product.price,
                    createdAt=item.created_at,
                )
            )

        return WishlistResponse(items=result, count=len(result))

    def add_item(self, user_id: str, product_id: str) -> WishlistItemResponse:
        product = self.session.exec(
            select(Product).where(Product.id == product_id)
        ).first()
        if not product:
            raise NotFoundError("商品不存在")

        existing = self.session.exec(
            select(WishlistItem).where(
                WishlistItem.user_id == user_id,
                WishlistItem.product_id == product_id,
            )
        ).first()
        if existing:
            raise BadRequestError("商品已在收藏清單中")

        item = WishlistItem(user_id=user_id, product_id=product_id)
        self.session.add(item)
        self.session.commit()
        self.session.refresh(item)

        main_image = next(
            (img for img in product.images if img.is_main),
            product.images[0] if product.images else None,
        )

        return WishlistItemResponse(
            id=item.id,
            productId=product.id,
            productName=product.name,
            productImage=main_image.url if main_image else "",
            productSlug=product.slug,
            price=product.price,
            createdAt=item.created_at,
        )

    def remove_item(self, user_id: str, product_id: str) -> None:
        item = self.session.exec(
            select(WishlistItem).where(
                WishlistItem.user_id == user_id,
                WishlistItem.product_id == product_id,
            )
        ).first()
        if not item:
            raise NotFoundError("收藏項目不存在")

        self.session.delete(item)
        self.session.commit()

    def is_wishlisted(self, user_id: str, product_id: str) -> bool:
        item = self.session.exec(
            select(WishlistItem).where(
                WishlistItem.user_id == user_id,
                WishlistItem.product_id == product_id,
            )
        ).first()
        return item is not None
