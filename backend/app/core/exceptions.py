from fastapi import HTTPException, status


class NotFoundError(HTTPException):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class BadRequestError(HTTPException):
    def __init__(self, detail: str = "Bad request"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


class OutOfStockError(HTTPException):
    def __init__(self, detail: str = "Product size is out of stock"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


class CartItemNotFoundError(NotFoundError):
    def __init__(self):
        super().__init__(detail="Cart item not found")


class ProductNotFoundError(NotFoundError):
    def __init__(self):
        super().__init__(detail="Product not found")
