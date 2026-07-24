from backend.core.security import get_password_hash

password = "Admin@123"

print(get_password_hash(password))