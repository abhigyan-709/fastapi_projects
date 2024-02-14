from fastapi import APIRouter, HTTPException, Depends
from pymongo import MongoClient
from bson import ObjectId
from models.item import Item, ItemDB
from database.db import db


route = APIRouter()


@route.post("/items/", response_model=Item)
async def create_item(item: Item, db_client: MongoClient = Depends(db.get_client)):
    item_dict = item.dict()
    result = db_client[db.db_name]["item"].insert_one(item_dict)
    return {**item.dict(), "id": str(result.inserted_id)}

@route.get("/items/{item_id}", response_model=ItemDB)
async def read_item(item_id: str, db_client: MongoClient = Depends(db.get_client)):
    item = db_client[db.db_name]["item"].find_one({"_id": ObjectId(item_id)})
    if item:
        return ItemDB(**item)
    raise HTTPException(status_code=404, detail="Item not found")

@route.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: str, item: Item, db_client: MongoClient = Depends(db.get_client)):
    item_dict = item.dict()
    result = db_client[db.db_name]["item"].update_one({"_id": ObjectId(item_id)}, {"$set": item_dict})
    if result.modified_count == 1:
        return {**item.dict(), "id": item_id}
    raise HTTPException(status_code=404, detail="Item not found")

@route.delete("/items/{item_id}")
async def delete_item(item_id: str, db_client: MongoClient = Depends(db.get_client)):
    result = db_client[db.db_name]["item"].delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 1:
        return {"message": "Item deleted successfully"}
    raise HTTPException(status_code=404, detail="Item not found")
