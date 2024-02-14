# routes/industrial.py
from fastapi import APIRouter, HTTPException, Depends
from pymongo import MongoClient
from bson import ObjectId
from models.category import IndustrialCategory, IndustrialCategoryDB, Section
from database.db import db
from routes.user import get_current_user

industrial_route = APIRouter()

@industrial_route.post("/industrial_categories/", response_model=IndustrialCategoryDB, tags=["Industry"])
async def create_industrial_category(
    industrial_category: IndustrialCategory,
    current_user: str = Depends(get_current_user),
    db_client: MongoClient = Depends(db.get_client)
):
    # Extract sections from the request
    sections = industrial_category.sections
    industrial_category_dict = industrial_category.dict(exclude={"sections"})

    # Create an empty list to store section IDs
    section_ids = []

    # Create sections
    for section in sections:
        section_result = db_client[db.db_name]["section"].insert_one(section.dict())
        section_ids.append(str(section_result.inserted_id))

    # Add section IDs to the industrial category
    industrial_category_dict["section_ids"] = section_ids

    # Create the industrial category
    result = db_client[db.db_name]["industrial_category"].insert_one(industrial_category_dict)
    industrial_category_db = IndustrialCategoryDB(**industrial_category.dict(), id=str(result.inserted_id))
    return industrial_category_db

@industrial_route.get("/industrial_categories/{industrial_category_id}", response_model=IndustrialCategoryDB, tags=["Industry"])
async def read_industrial_category(
    industrial_category_id: str,
    db_client: MongoClient = Depends(db.get_client)
):
    industrial_category = db_client[db.db_name]["industrial_category"].find_one({"_id": ObjectId(industrial_category_id)})
    if industrial_category:
        return IndustrialCategoryDB(**industrial_category, id=str(industrial_category["_id"]))
    raise HTTPException(status_code=404, detail="Industrial Category not found")

@industrial_route.put("/industrial_categories/{industrial_category_id}", response_model=IndustrialCategoryDB, tags=["Industry"])
async def update_industrial_category(
    industrial_category_id: str,
    industrial_category: IndustrialCategory,
    db_client: MongoClient = Depends(db.get_client)
):
    # Extract sections from the request
    sections = industrial_category.sections
    industrial_category_dict = industrial_category.dict(exclude={"sections"})

    # Create an empty list to store section IDs
    section_ids = []

    # Update or create sections
    for section in sections:
        section_id = section.get("id")
        if section_id:
            # If section has an ID, update it
            db_client[db.db_name]["section"].update_one(
                {"_id": ObjectId(section_id)},
                {"$set": section.dict()}
            )
            section_ids.append(section_id)
        else:
            # If section doesn't have an ID, create it
            section_result = db_client[db.db_name]["section"].insert_one(section.dict())
            section_ids.append(str(section_result.inserted_id))

    # Add section IDs to the industrial category
    industrial_category_dict["section_ids"] = section_ids

    # Update the industrial category
    result = db_client[db.db_name]["industrial_category"].update_one(
        {"_id": ObjectId(industrial_category_id)},
        {"$set": industrial_category_dict}
    )
    if result.modified_count == 1:
        return IndustrialCategoryDB(**industrial_category.dict(), id=industrial_category_id)
    raise HTTPException(status_code=404, detail="Industrial Category not found")

@industrial_route.delete("/industrial_categories/{industrial_category_id}", tags=["Industry"])
async def delete_industrial_category(
    industrial_category_id: str,
    db_client: MongoClient = Depends(db.get_client)
):
    # Delete associated sections
    industrial_category = db_client[db.db_name]["industrial_category"].find_one({"_id": ObjectId(industrial_category_id)})
    if industrial_category:
        section_ids = industrial_category.get("section_ids", [])
        db_client[db.db_name]["section"].delete_many({"_id": {"$in": [ObjectId(sid) for sid in section_ids]}})

    # Delete industrial category
    result = db_client[db.db_name]["industrial_category"].delete_one({"_id": ObjectId(industrial_category_id)})
    if result.deleted_count == 1:
        return {"message": "Industrial Category deleted successfully"}
    raise HTTPException(status_code=404, detail="Industrial Category not found")
