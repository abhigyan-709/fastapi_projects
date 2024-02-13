from pydantic import BaseModel, constr, validator, Field
from datetime import date, datetime, time
from uuid import UUID, uuid4
import bson

class User(BaseModel):
    username: str
    password: str
    name: str
    surname: str
    email: str
    gender: str
    mobileNumber: int
    dob: str


