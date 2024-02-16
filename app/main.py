# app/main.py

from fastapi import FastAPI, Depends
from routes.item import route as item_router  # Correct import
from database.db import db
from routes.user import route2
from routes.category import industrial_route
from routes.user_response import user_response_route
from routes.user import route2, get_current_user  # Import the dependency

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()



# Allow all origins for CORS (update this to a specific origin in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    item_router,
    prefix="/api",
    dependencies=[Depends(get_current_user)],  # Add the dependency here
)

app.include_router(
    industrial_route,
    dependencies=[Depends(get_current_user)],  # Add the dependency here
)
app.include_router(
    user_response_route,
    prefix="/user_rseponse",
    dependencies=[Depends(get_current_user)],  # Add the dependency here
)


app.include_router(route2)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
