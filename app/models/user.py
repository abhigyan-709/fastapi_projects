from pydantic import BaseModel

class User(BaseModel):
    first_name: str
    last_name: str
    city: str
    username: str
    email: str
    password: str
