from fastapi import APIRouter, HTTPException,Header,Depends
from models.input import User
from config.db import db
from bson import json_util
from bson.binary import Binary
import json


route = APIRouter()


@route.post("/register/", tags = ["Login & Authentication"])
async def new_user(user: User):
    user_dict = user.dict()
    db.users.insert_one(dict(user_dict))
    return user_dict

@route.get("/user_details/{username}", tags=["Get User Details"])
async def get_user_details(username: str):
    user = db.users.find_one({"username": username})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return json.loads(json_util.dumps(user))