from database import Base, SessionLocal, engine
from models import User
from auth import hash_password


Base.metadata.create_all(bind=engine)


db = SessionLocal()


ADMIN_EMAIL = "admin@society.com"
ADMIN_PASSWORD = "admin123"


existing_admin = db.query(User).filter(
    User.email == ADMIN_EMAIL
).first()


if existing_admin:
    print("Admin already exists.")

else:
    admin = User(
        name="Society Admin",
        email=ADMIN_EMAIL,
        password_hash=hash_password(ADMIN_PASSWORD),
        role="admin",
    )

    db.add(admin)
    db.commit()

    print("Admin created successfully.")


db.close()

print()
print("Admin Email:", ADMIN_EMAIL)
print("Admin Password:", ADMIN_PASSWORD)