from sqlmodel import Session, select
from app.models import Product, ProductImage, ProductColor, ProductSize
from app.schemas import ProductResponse, ProductListItemResponse
from app.core.exceptions import ProductNotFoundError


class ProductService:
    def __init__(self, session: Session):
        self.session = session

    def get_products(
        self,
        category: str | None = None,
        page: int = 1,
        page_size: int = 24,
        search: str | None = None,
        sort: str | None = None,
    ) -> tuple[list[ProductListItemResponse], int]:
        query = select(Product)

        if category:
            query = query.where(Product.category == category)

        if search:
            query = query.where(Product.name.ilike(f"%{search}%"))

        # Get total count
        total = len(self.session.exec(query).all())

        # Apply sorting
        if sort == "price-asc":
            query = query.order_by(Product.price.asc())
        elif sort == "price-desc":
            query = query.order_by(Product.price.desc())
        else:
            query = query.order_by(Product.created_at.desc())

        # Apply pagination
        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)

        products = self.session.exec(query).all()

        result = []
        for product in products:
            # Get main image
            main_image = next(
                (img for img in product.images if img.is_main),
                product.images[0] if product.images else None,
            )

            result.append(
                ProductListItemResponse(
                    id=product.id,
                    slug=product.slug,
                    name=product.name,
                    subtitle=product.subtitle,
                    price=product.price,
                    originalPrice=product.original_price,
                    category=product.category,
                    imageUrl=main_image.url if main_image else "",
                    colorCount=len(product.colors),
                )
            )

        return result, total

    def get_product_by_slug(self, slug: str) -> ProductResponse:
        query = select(Product).where(Product.slug == slug)
        product = self.session.exec(query).first()

        if not product:
            raise ProductNotFoundError()

        return ProductResponse(
            id=product.id,
            slug=product.slug,
            name=product.name,
            subtitle=product.subtitle,
            description=product.description,
            price=product.price,
            originalPrice=product.original_price,
            category=product.category,
            images=[
                {
                    "id": img.id,
                    "url": img.url,
                    "alt": img.alt,
                    "isMain": img.is_main,
                }
                for img in sorted(product.images, key=lambda x: x.sort_order)
            ],
            colors=[
                {
                    "id": color.id,
                    "name": color.name,
                    "code": color.code,
                    "imageUrl": color.image_url,
                }
                for color in sorted(product.colors, key=lambda x: x.sort_order)
            ],
            sizes=[
                {"id": size.id, "size": size.size, "stock": size.stock}
                for size in sorted(product.sizes, key=lambda x: x.sort_order)
            ],
            createdAt=product.created_at,
            updatedAt=product.updated_at,
        )

    def get_product_by_id(self, product_id: str) -> Product:
        query = select(Product).where(Product.id == product_id)
        product = self.session.exec(query).first()

        if not product:
            raise ProductNotFoundError()

        return product
