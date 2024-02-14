from pydantic import BaseModel
from bson import ObjectId

class Item(BaseModel):
    name: str
    description: str

class ItemDB(Item):
    id: str

    class Config:
        orm_mode = True
