# app/schemas.py
from pydantic import BaseModel
from typing import Optional

class Article(BaseModel):
    title: str
    content: str

class ArticleInDB(Article):
    _id: str
