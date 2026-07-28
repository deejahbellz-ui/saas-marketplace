from fastapi import FastAPI, Depends
from sqlmodel import SQLModel, Session, select
from database import engine, get_session
from models import Product

app = FastAPI()

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.get("/items")
def get_items(session: Session = Depends(get_session)):
    items = session.exec(select(Product)).all()
    return items

@app.post("/items")
def create_item(name: str, price: float, session: Session = Depends(get_session)):
    item = Product(name=name, price=price)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item