# app/database.py
import motor.motor_asyncio
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# MongoDB connection URL
MONGO_URI = os.getenv("MONGO_URI")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client['article-management-db']
articles_collection = db['articles']

# Print confirmation message when connected
print("Connected to MongoDB database: article-management-db")