# models/category.py
from typing import List
from enum import Enum
from pydantic import BaseModel

class AnswerEnum(str, Enum):
    yes = "yes"
    no = "no"

class Answer(BaseModel):
    value: AnswerEnum

class Question(BaseModel):
    text: str
    answers: List[Answer]

class QuestionDB(Question):
    id: str

class Section(BaseModel):
    name: str
    description: str
    questions: List[Question] = []
    questions_ids: List[str] = []  # Corrected attribute name

class SectionDB(Section):
    id: str

class IndustrialCategory(BaseModel):
    name: str
    description: str
    sections: List[Section] = []

class IndustrialCategoryDB(IndustrialCategory):
    id: str
