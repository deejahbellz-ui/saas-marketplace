from fastapi import FastAPI

app = FastAPI()

# temporary in-memory storage
items = []
next_id = 1

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.get("/items")
def get_items():
    return items

@app.post("/items")
def create_item(name: str, price: float):
    global next_id
    item = {"id": next_id, "name": name, "price": price}
    items.append(item)
    next_id += 1
    return item