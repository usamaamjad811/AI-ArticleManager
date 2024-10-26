# app/crud.py
from app.database import articles_collection
from app.schemas import Article
from bson import ObjectId

# Helper function to convert MongoDB document to JSON-friendly format
def article_helper(article) -> dict:
    return {
        "_id": str(article["_id"]),
        "title": article["title"],
        "content": article["content"],
    }

async def get_all_articles():
    articles = await articles_collection.find().to_list(100)
    return [article_helper(article) for article in articles]

async def get_article_by_id(article_id: str):
    article = await articles_collection.find_one({"_id": ObjectId(article_id)})
    return article_helper(article) if article else None

async def create_article(article: Article):
    new_article = await articles_collection.insert_one(article.dict())
    return await get_article_by_id(new_article.inserted_id)

async def update_article(article_id: str, article: Article):
    await articles_collection.update_one(
        {"_id": ObjectId(article_id)}, {"$set": article.dict()}
    )
    return await get_article_by_id(article_id)

async def delete_article(article_id: str):
    result = await articles_collection.delete_one({"_id": ObjectId(article_id)})
    return {"status": "deleted"} if result.deleted_count == 1 else None
