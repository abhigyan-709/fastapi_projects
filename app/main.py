# app/main.py

from fastapi import FastAPI, Depends
# from routes.item import route as item_router  # Correct import
from database.db import db
from routes.user import route2
from routes.category import industrial_route
from routes.user_response import user_response_route
from routes.user import route2, get_current_user  # Import the dependency

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Industrial Carbon Emission Calculator API",
              description="All in ONE advanced Calculator with User Management.",
              version="1.1.0",
    #           servers=[
    #     {"url": "https://auth.globaltamasha.in", "description": "Staging environment"},
    #     {"url": "https://auth.globaltamasha.com", "description": "Production environment"},
    # ],
    docs_url="/docs",
    contact={
        "name": "Developed by Abhigyan Kumar",
    },
    
    swagger_ui_parameters={"syntaxHighlight.theme": "obsidian"})


app.openapi_version = "3.0.2"



# Allow all origins for CORS (update this to a specific origin in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(
    industrial_route,
    dependencies=[Depends(get_current_user)],  # Add the dependency here
)
app.include_router(
    user_response_route,
    dependencies=[Depends(get_current_user)],  # Add the dependency here
)


app.include_router(route2)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
