from fastapi import APIRouter
from services.token_service import create_access_token
route2 = APIRouter()


@route2.post("/login/", tags=["Login & Authentication"])
async def login(username: str, password: str):
    # Verify credentials
    # If credentials are valid, generate a token
    access_token = create_access_token({"username": username})
    return {"access_token": access_token}