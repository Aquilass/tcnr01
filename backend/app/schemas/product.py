from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProductImageResponse(BaseModel):
    id: str
    url: str
    alt: str
    isMain: bool

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_custom(cls, obj):
        return cls(
            id=obj.id,
            url=obj.url,
            alt=obj.alt,
            isMain=obj.is_main,
        )


class ProductColorResponse(BaseModel):
    id: str
    name: str
    code: str
    imageUrl: str

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_custom(cls, obj):
        return cls(
            id=obj.id,
            name=obj.name,
            code=obj.code,
            imageUrl=obj.image_url,
        )


class ProductSizeResponse(BaseModel):
    id: str
    size: str
    stock: int

    class Config:
        from_attributes = True


class ProductResponse(BaseModel):
    id: str
    slug: str
    name: str
    subtitle: str
    description: str
    price: float
    originalPrice: Optional[float] = None
    category: str
    images: list[ProductImageResponse]
    colors: list[ProductColorResponse]
    sizes: list[ProductSizeResponse]
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_custom(cls, obj):
        return cls(
            id=obj.id,
            slug=obj.slug,
            name=obj.name,
            subtitle=obj.subtitle,
            description=obj.description,
            price=obj.price,
            originalPrice=obj.original_price,
            category=obj.category,
            images=[ProductImageResponse.from_orm_custom(img) for img in sorted(obj.images, key=lambda x: x.sort_order)],
            colors=[ProductColorResponse.from_orm_custom(color) for color in sorted(obj.colors, key=lambda x: x.sort_order)],
            sizes=[ProductSizeResponse.from_attributes(size) for size in sorted(obj.sizes, key=lambda x: x.sort_order)],
            createdAt=obj.created_at,
            updatedAt=obj.updated_at,
        )


class ProductListItemResponse(BaseModel):
    id: str
    slug: str
    name: str
    subtitle: str
    price: float
    originalPrice: Optional[float] = None
    category: str
    imageUrl: str
    colorCount: int

    class Config:
        from_attributes = True
