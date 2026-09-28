import os
import shutil
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import SQLModel, Session, select
from database import engine, get_session
from models import Product, User, Order
from auth import hash_password, verify_password, create_access_token, decode_access_token
from jose import JWTError

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "").strip().lower()

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://saas-marketplace-delta.vercel.app"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

@app.get("/")
def health_check():
    return {"status": "ok"}

# ---- Auth dependencies ----
def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:
    try:
        payload = decode_access_token(token)
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = session.exec(select(User).where(User.email == email)).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def is_admin_user(user: User) -> bool:
    return bool(ADMIN_EMAIL) and user.email.strip().lower() == ADMIN_EMAIL

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if not is_admin_user(current_user):
        raise HTTPException(status_code=403, detail="Admin only")
    return current_user

# ---- Registration ----
@app.post("/register")
def register(email: str, password: str, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(email=email, hashed_password=hash_password(password))
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"id": user.id, "email": user.email}

# ---- Login ----
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {"email": current_user.email, "is_admin": is_admin_user(current_user)}

# ---- Items (adding is admin only) ----
@app.get("/items")
def get_items(session: Session = Depends(get_session)):
    return session.exec(select(Product)).all()

@app.post("/items")
def create_item(name: str, price: float, image_url: str = None, session: Session = Depends(get_session), admin: User = Depends(require_admin)):
    item = Product(name=name, price=price, owner_id=admin.id, image_url=image_url)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

# ---- Orders ----
@app.post("/orders")
def create_order(product_id: int, quantity: int = 1, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    order = Order(buyer_id=current_user.id, product_id=product_id, quantity=quantity)
    session.add(order)
    session.commit()
    session.refresh(order)
    return order

@app.get("/orders")
def get_my_orders(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    return session.exec(select(Order).where(Order.buyer_id == current_user.id)).all()

@app.get("/admin/orders")
def all_orders(session: Session = Depends(get_session), admin: User = Depends(require_admin)):
    result = []
    for o in session.exec(select(Order)).all():
        buyer = session.get(User, o.buyer_id)
        product = session.get(Product, o.product_id)
        result.append({
            "id": o.id,
            "buyer_email": buyer.email if buyer else "unknown",
            "product_name": product.name if product else "deleted product",
            "price": product.price if product else 0,
            "quantity": o.quantity,
        })
    return result

# ---- Image upload (admin only) ----
@app.post("/upload")
def upload_image(file: UploadFile = File(...), admin: User = Depends(require_admin)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "url": f"https://saas-marketplace-ngmm.onrender.com/uploads/{file.filename}"}