# app/main.py
from fastapi import FastAPI, HTTPException
from app.schemas import Article
from app.crud import (
    get_all_articles, get_article_by_id, create_article, update_article, delete_article
)
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
openai.api_key = os.getenv("OPENAI_API_KEY")


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AI-ArticleManger APIs are working...."}

@app.get("/articles/")
async def read_articles():
    articles = await get_all_articles()
    return {
        "message": "Articles retrieved successfully",
        "data": articles
    }

@app.get("/articles/{id}")
async def read_article(id: str):
    article = await get_article_by_id(id)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return {
        "message": "Article retrieved successfully",
        "data": article
    }

@app.post("/articles/")
async def create_new_article(article: Article):
    new_article = await create_article(article)
    return {
        "message": "Article created successfully",
        "data": new_article
    }

@app.put("/articles/{id}")
async def update_existing_article(id: str, article: Article):
    updated_article = await update_article(id, article)
    if updated_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return {
        "message": "Article updated successfully",
        "data": updated_article
    }

@app.delete("/articles/{id}")
async def delete_existing_article(id: str):
    deleted_status = await delete_article(id)
    if deleted_status is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return {
        "message": "Article deleted successfully",
        "data": deleted_status
    }