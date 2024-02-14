from fastapi import APIRouter, HTTPException, Depends
from pymongo import MongoClient
from bson import ObjectId
from models.item import Item, ItemDB
from database.db import db
from models.user import User


route2 = APIRouter()

@route2.post("/register/", tags = ["Login & Authentication"])
async def new_user(user: User):
    user_dict = user.dict()
    db.users.insert_one(dict(user_dict))
    return user_dict

