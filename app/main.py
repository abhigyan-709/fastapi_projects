# app/main.py

from fastapi import FastAPI
from routes.item import route as item_router  # Correct import
from database.db import db
from routes.user import route2

app = FastAPI()

app.include_router(item_router, prefix="/api")  # Correct usage
app.include_router(route2)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
