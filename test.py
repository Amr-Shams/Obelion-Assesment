import requests

BASE_URL = "http://localhost:3000"

def register_user(email, password, name, is_admin=False):
    response = requests.post(f"{BASE_URL}/api/register", json={
        "email": email,
        "password": password,
        "name": name,
    })
    print("Register User:", response.json())
    return response

def login_user(email, password):
    response = requests.post(f"{BASE_URL}/api/login", json={
        "email": email,
        "password": password
    })
    print("Login User:", response.json())
    return response.json().get("token")

def get_books():
    response = requests.get(f"{BASE_URL}/api/books")
    print("Get Books:", response.json())
    return response

def add_book(token, title, author, published_year):
    response = requests.post(f"{BASE_URL}/api/books", json={
        "title": title,
        "author": author,
        "isbn": "123456789012",
        "quantity": 1,
        "updatedAt": "2021-01-01T00:00:00.000Z",
        "createdAt": "2021-01-01T00:00:00.000Z",
    }, headers={
        "Authorization": f"Bearer {token}"
    })
    print("Add Book:", response.json())
    return response

# model Book {
#   id        Int      @id @default(autoincrement())
#   title     String
#   author    String
#   isbn      String   @unique
#   quantity  Int
#   createdAt DateTime @default(now())
#   updatedAt DateTime @updatedAt
#   borrows   Borrow[]
# }
if __name__ == "__main__":
    # Register a new user
    # register_user("test@example.com", "password123", "Test User")

    # Login with the new user
    token = login_user("test1@example.com", "password123")

    # Get all books (public endpoint)
    get_books()

    # Add a new book (requires authentication and admin role)
    add_book(token, "New Book12", "Author Name11", 202211)