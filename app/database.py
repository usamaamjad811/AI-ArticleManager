# app/database.py
import motor.motor_asyncio

# MongoDB connection URL
MONGO_URI = "mongodb+srv://dev:DJgMpxz8oXvLN0ma@article-management.pcflq.mongodb.net/?retryWrites=true&w=majority&appName=article-management"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client['article-management-db']
articles_collection = db['articles']

# Print confirmation message when connected
print("Connected to MongoDB database: article-management-db")