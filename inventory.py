items = []
next_id = 1

def add_item():
    global next_id
    name = input("Item name: ")
    price = float(input("Price: "))
    items.append({"id": next_id, "name": name, "price": price})
    next_id += 1
    print("Added.")

def list_items():
    if not items:
        print("No items yet.")
    for item in items:
        print(f"{item['id']}: {item['name']} - ${item['price']}")

def delete_item():
    item_id = int(input("ID to delete: "))
    global items
    items = [i for i in items if i["id"] != item_id]
    print("Deleted (if it existed).")

def main():
    while True:
        choice = input("\n(a)dd, (l)ist, (d)elete, (q)uit: ").strip().lower()
        if choice == "a":
            add_item()
        elif choice == "l":
            list_items()
        elif choice == "d":
            delete_item()
        elif choice == "q":
            break
        else:
            print("Invalid choice.")

if __name__ == "__main__":
    main()