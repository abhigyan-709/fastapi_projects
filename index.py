from routes.input import route
from routes.login import route2
from routes.news import route3
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials, HTTPBearer, HTTPAuthorizationCredentials
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
import requests
from config.dependencies.dependencies import get_current_user 

app = FastAPI(title="GTOneAPI", docs_url=None, redoc_url=None, openapi_url=None)


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(route, dependencies=[Depends(get_current_user)])
app.include_router(route2)
app.include_router(route3, dependencies=[Depends(get_current_user)])





@app.get("/docs")
async def get_documentation():
    return get_swagger_ui_html(openapi_url="/openapi.json", title="GTOneAPI")


@app.get("/openapi.json")
async def openapi():
    return get_openapi(title="GTOneAPI - Development Release", version="0.0.1", routes=app.routes)


custom_openapi = {
    "info": {
        "version": "0.0.1",
        "title": "GTOneAPI - Development Release"
    },
    "servers": ["Powered by MongoDB & AWS"],
    "openapi": "0.0.1"
}


def custom_openapi_schema():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=custom_openapi["info"]["title"],
        version=custom_openapi["info"]["version"],
        description=app.description,
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi_schema
