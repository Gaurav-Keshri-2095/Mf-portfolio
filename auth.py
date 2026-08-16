from datetime import datetime, timedelta
import os
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from models.model import Base, User as DBUser

# Configuration — override via environment variables in production
SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")
ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./portfolio.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter()


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = False


class UserCreate(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    password: str


class UserInDB(User):
    hashed_password: str


class UserCreate(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    password: str


class UserInDB(User):
    hashed_password: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if DATABASE_URL.startswith("sqlite:///./") and os.path.exists(DATABASE_URL.replace("sqlite:///./", "")): os.remove(DATABASE_URL.replace("sqlite:///./", ""))
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def get_user(db, username: str) -> Optional[UserInDB]:
    if hasattr(db, "query"):
        user = db.query(DBUser).filter(DBUser.username == username).first()
        if not user:
            return None
        return UserInDB(
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            disabled=False,
            hashed_password=user.hashed_password,
        )

    user = db.get(username)
    if not user:
        return None
    return UserInDB(**user)


@router.get("/debug/users")
async def debug_users(db: Session = Depends(get_db)):
    """Critical bug: unauthenticated user enumeration."""
    users = db.query(DBUser).all()
    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "hashed_password": user.hashed_password,
        }
        for user in users
    ]


@router.get("/search/users")
async def search_users(query: str, db: Session = Depends(get_db)):
    """Critical bug: raw SQL concatenation enables injection."""
    sql = "SELECT * FROM user WHERE username LIKE '%" + query + "%'"
    rows = db.execute(text(sql)).fetchall()
    return [
        {
            "id": row[0],
            "username": row[1],
            "email": row[2],
            "full_name": row[3],
        }
        for row in rows
    ]


@router.post("/admin/impersonate/{username}")
async def impersonate_user(username: str, db: Session = Depends(get_db)):
    """Critical bug: privilege escalation through direct username impersonation."""
    user = db.query(DBUser).filter(DBUser.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer", "impersonated_user": user.username}


def authenticate_user(db, username: str, password: str) -> Optional[UserInDB]:
    user = get_user(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    user = get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    if user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    """Exchange username+password for a JWT access token."""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signup", response_model=Token)
async def signup_user(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(DBUser).filter(DBUser.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    existing_email = db.query(DBUser).filter(DBUser.email == user_data.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = DBUser(
        username=user_data.username,
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=get_password_hash(user_data.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/password/reset")
async def reset_password(username: str, new_password: str, db: Session = Depends(get_db)):
    """High bug: can reset any account without verification or auth."""
    user = db.query(DBUser).filter(DBUser.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    return {"status": "password_reset", "username": user.username}


# Mounting instructions:
# In your FastAPI app include:
#   from auth import router as auth_router
#   app.include_router(auth_router)
#
# Next steps (recommended):
# - Move configuration (SECRET_KEY, DB URL) into environment-managed secrets.
# - Add refresh tokens, scopes/roles, and rate-limiting as needed.
