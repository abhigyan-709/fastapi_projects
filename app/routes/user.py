from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from database.db import db
from models.user import User
from models.token import Token, TokenData
from typing import Optional, Union
from pymongo import MongoClient
import secrets
from bson import ObjectId
from fastapi.responses import JSONResponse

route2 = APIRouter()
SECRET_KEY = secrets.token_urlsafe(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create an instance of CryptContext for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire, "sub": data["username"]})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    return username

@route2.post("/token", response_model=Token, tags=["Login & Authentication"])
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db_client: MongoClient = Depends(db.get_client)
):
    user_from_db = db_client[db.db_name]["user"].find_one({"username": form_data.username})
    
    if user_from_db and verify_password(form_data.password, user_from_db['password']):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"username": form_data.username},
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

    raise HTTPException(
        status_code=401,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )



@route2.post("/register/", tags=["Login & Authentication"])
async def register(user: User, db_client: MongoClient = Depends(db.get_client)):
    user_dict = user.dict()
    # Hash the password before storing it in the database
    user_dict['password'] = get_password_hash(user.password)
    result = db_client[db.db_name]["user"].insert_one(user_dict)
    
    # Convert ObjectId to string
    user_dict["_id"] = str(result.inserted_id)

    # Return response with the user data
    return JSONResponse(content=user_dict, status_code=201)

