from typing import List
from pydantic import BaseModel

class Section(BaseModel):
    name: str
    description: str

class IndustrialCategory(BaseModel):
    name: str
    description: str
    sections: List[Section] = []

class IndustrialCategoryDB(IndustrialCategory):
    id: str
