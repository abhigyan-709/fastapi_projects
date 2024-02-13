# config/dependencies/dependencies.py

from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from services.token_service import decode_token

security = HTTPBearer()

def get_current_user(token: HTTPAuthorizationCredentials = Security(security)):
    try:
        token_data = decode_token(token.credentials)
        return token_data
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid Token")
