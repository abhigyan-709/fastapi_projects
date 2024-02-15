# routes/category.py
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
        # Ensure the section has questions
        questions = section.questions if section.questions else []
        # Create an empty list to store question IDs
        question_ids = []

        # Create questions
        for question in questions:
            question_result = db_client[db.db_name]["question"].insert_one(question.dict())
            question_ids.append(str(question_result.inserted_id))

        # Add question IDs to the section
        section.questions_ids = question_ids  # Corrected attribute name
        # Create the section
        section_result = db_client[db.db_name]["section"].insert_one(section.dict())
        section_ids.append(str(section_result.inserted_id))

    # Add section IDs to the industrial category
    industrial_category_dict["section_ids"] = section_ids

    # Create the industrial category
    result = db_client[db.db_name]["industrial_category"].insert_one(industrial_category_dict)
    industrial_category_db = IndustrialCategoryDB(**industrial_category.dict(), id=str(result.inserted_id))
    return industrial_category_db
