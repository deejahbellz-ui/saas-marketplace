from sqlmodel import SQLModel, Field
from typing import Optional

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str
    hashed_password: str

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    price: float
    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")
    image_url: Optional[str] = None

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    buyer_id: int = Field(foreign_key="user.id")
    product_id: int = Field(foreign_key="product.id")
    quantity: int = 1