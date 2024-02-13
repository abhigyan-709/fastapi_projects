from fastapi import APIRouter, HTTPException
from config.db import db
from models.news import CategoryModel
from bson import json_util
import json

route3 = APIRouter()

@route3.post("/categories/", tags = ["News Category"])
async def categories(category : CategoryModel):
    category_dict = category.dict()
    db.categories.insert_one(dict(category_dict))
    return category_dict


@route3.get("/category_details/{id}", tags=["News Category"])
async def get_category_details(id: int):
    category = db.categories.find_one({"id": id})
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return json.loads(json_util.dumps(category))
