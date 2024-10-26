# app/main.py
from fastapi import FastAPI, HTTPException
from langchain_community.chains.pebblo_retrieval.enforcement_filters import PINECONE

from app.schemas import Article
from app.crud import (
    get_all_articles, get_article_by_id, create_article, update_article, delete_article
)
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from dotenv import load_dotenv, find_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain_openai.chat_models import ChatOpenAI
from langchain.schema.output_parser import StrOutputParser
from fastapi import FastAPI, HTTPException, status, Depends
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
import time
from langchain.schema.runnable import RunnablePassthrough, RunnableParallel
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
openai.api_key = os.getenv("OPENAI_API_KEY")
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
print(pc)


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

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
text = TextLoader("/home/usama.amjad@vaival.tech/Documents/Extra Work/AI-ArticleManager/app/Data.txt").load()
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
docs = splitter.split_documents(text)
print(docs[0])
print(docs[1])
total_docs = f"Total length of docs {len(docs[1:5])}"

cloud = os.environ.get('PINECONE_CLOUD') or 'aws'
region = os.environ.get('PINECONE_REGION') or 'us-east-1'
spec = ServerlessSpec(cloud=cloud, region=region)

index_name = "ai-article-manager"

if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=embeddings.dimension,
        metric="cosine",
        spec=spec
    )
    # Wait for index to be ready
    while not pc.describe_index(index_name).status['ready']:
        time.sleep(1)

# See that it is empty
print("Index before upsert:")
print(pc.Index(index_name).describe_index_stats())
print("\n")

namespace = "wondervector5000"

docsearch = PineconeVectorStore.from_documents(
    documents=docs,
    index_name=index_name,
    embedding=embeddings,
    namespace=namespace
)

time.sleep(5)


# db = FAISS.from_documents(docs, embeddings)
# db.save_local("Test")
# new_db = FAISS.load_local(
#     "Test", embeddings, allow_dangerous_deserialization=True
# )

# Define the path to the FAISS index
# index_path = "faiss_index"
#
# # Check if the FAISS index already exists
# if os.path.exists(index_path):
#     print("Loading FAISS index...")
#     new_db = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)
# else:
#     print("Creating FAISS index...")
#     db = FAISS.from_documents(docs, embeddings)
#     db.save_local(index_path)
#     new_db = db
#

retriever = docsearch.as_retriever(search_kwargs={"k": 5})


template = """
You are an AI Article Manager. You have been asked to provide the most relevant article based on the user's question and the given context.
Remember: Your goal is to provide the most accurate and relevant answer based on the user's question and the given context. If you cannot find a suitable match, it's better to admit that than to provide incorrect information.
Question: {question}
Context: {context}
"""
prompt = ChatPromptTemplate.from_template(template)
llm = ChatOpenAI(model="gpt-4o", temperature=0)
chain = (
    RunnableParallel({"context": retriever,
                     "question": RunnablePassthrough()})
    | prompt
    | llm
    | StrOutputParser()
)
Question = "What is the best way to manage articles?"
response = chain.invoke(Question)
print(response)

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