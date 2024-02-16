# models/user.py
from typing import Optional

from pydantic import BaseModel, EmailStr

class User(BaseModel):
    first_name: str
    last_name: str
    city: str
    username: str
    email: EmailStr
    password: str

    class Config:
        orm_mode = True
