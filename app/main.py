# app/main.py
from fastapi import FastAPI, HTTPException
from langchain_community.chains.pebblo_retrieval.enforcement_filters import PINECONE
from torch.jit.frontend import pretty_node_names

from app.schemas import Article
from app.crud import (
    get_all_articles, get_article_by_id, create_article, update_article, delete_article
)
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
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
import aiofiles
from langchain.schema.runnable import RunnablePassthrough, RunnableParallel
from dotenv import load_dotenv, find_dotenv
import json

load_dotenv(find_dotenv())
openai.api_key = os.getenv("OPENAI_API_KEY")
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))

cloud = os.environ.get('PINECONE_CLOUD') or 'aws'
region = os.environ.get('PINECONE_REGION') or 'us-east-1'
spec = ServerlessSpec(cloud=cloud, region=region)

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


# embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
# text = TextLoader("/home/usama.amjad@vaival.tech/Documents/Extra Work/AI-ArticleManager/articles.txt").load()
# splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
# docs = splitter.split_documents(text)
# print(docs[0])
# print(docs[1])
# total_docs = f"Total length of docs {len(docs[1:5])}"
#
# index_name = "ai-article-manager"
#
# if index_name not in pc.list_indexes().names():
#     pc.create_index(
#         name=index_name,
#         dimension=embeddings.dimension,
#         metric="cosine",
#         spec=spec
#     )
#     # Wait for index to be ready
#     while not pc.describe_index(index_name).status['ready']:
#         time.sleep(1)
#
# # See that it is empty
# print("Index before upsert:")
# print(pc.Index(index_name).describe_index_stats())
# print("\n")
#
# namespace = "wondervector5000"
#
# docsearch = PineconeVectorStore.from_documents(
#     documents=docs,
#     index_name=index_name,
#     embedding=embeddings,
#     namespace=namespace
# )
#
# time.sleep(5)
#
#
# retriever = docsearch.as_retriever(search_kwargs={"k": 5})
#
# template = """
# You are an AI Article Manager. You have been asked to provide the most relevant article based on the user's question and the given context.
# Remember: Your goal is to provide the most accurate and relevant answer based on the user's question and the given context. If you cannot find a suitable match, it's better to admit that than to provide incorrect information.
# Question: {question}
# Context: {context}
# """
# prompt = ChatPromptTemplate.from_template(template)
# llm = ChatOpenAI(model="gpt-4o", temperature=0)
# chain = (
#         RunnableParallel({"context": retriever,
#                           "question": RunnablePassthrough()})
#         | prompt
#         | llm
#         | StrOutputParser()
# )
# Question = "What is Dockerization?"
# response = chain.invoke(Question)
# print(response)


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


@app.get("/embed-articles/")
async def read_articles():
    articles = await get_all_articles()
    print("Articles", articles)

    # Define the file path for the text file
    file_path = "articles.txt"

    # Write articles to a text file asynchronously
    async with aiofiles.open(file_path, "w") as file:
        for article in articles:
            await file.write(f"{article}\n\n")  # Writes each article with a newline for separation

    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
    text = TextLoader(file_path).load()
    print("Text", text)
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
    docs = splitter.split_documents(text)
    print(docs[0])
    print(docs[1])
    total_docs = f"Total length of docs {len(docs[1:5])}"
    print(total_docs)

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
    return {
        "message": "Articles embedded and stored in Pinecone successfully",
    }


@app.get("/list-indexes/")
async def list_indexes():
    try:
        # Get all indexes
        indexes = pc.list_indexes().names()

        # Get simplified, serializable information for each index
        index_details = {}
        for index_name in indexes:
            index = pc.Index(index_name)
            stats = index.describe_index_stats()

            # Convert namespace data to a serializable format
            namespace_info = {}
            if hasattr(stats, 'namespaces'):
                for ns_name, ns_data in stats.namespaces.items():
                    namespace_info[ns_name] = {
                        'vector_count': ns_data.get('vector_count', 0)
                    }

            # Store only serializable data
            index_details[index_name] = {
                "total_vectors": getattr(stats, 'total_vector_count', 0),
                "namespaces": namespace_info,
                # Access the dimension attribute directly without calling it
                "dimension": pc.describe_index(index_name).dimension
            }

        return {
            "status": "success",
            "available_indexes": list(indexes),
            "index_details": index_details
        }
    except Exception as e:
        print(f"Detailed error: {str(e)}")  # For debugging
        return {
            "status": "error",
            "message": str(e),
            "available_indexes": list(pc.list_indexes().names())
        }

# New endpoint to perform similarity search across all indexes
@app.get("/query-similarity/")
async def query_similarity():
    try:
        print("Query Vector")
        embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
        index_name = 'ai-article-manager'

        # check if index already exists (it shouldn't if this is first time)
        if index_name not in pc.list_indexes().names():
            pc.create_index(
                name=index_name,
                dimension=embeddings.dimension,
                metric="cosine",
                spec=spec
            )

            # wait for index to be initialized
            while not pc.describe_index(index_name).status['ready']:
                time.sleep(1)

        # connect to index
        index = pc.Index(index_name)
        time.sleep(1)

        # view and retrieve index stats
        index_stats = index.describe_index_stats()

        # Convert index_stats to a JSON-compatible format if necessary
        index_stats_json = json.loads(json.dumps(index_stats, default=str))

        # returning index stats as JSON response
        return {
            "status": "success",
            "index_name": index_name,
            "index_details": index_stats_json
        }

    except Exception as e:
        print(f"Detailed error: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        }
@app.post("/articles/{id}/summarize")
async def summarize_article(id: str):
    try:
        # Get the article content
        article = await get_article_by_id(id)
        # print("Article",article)
        if article is None:
            raise HTTPException(status_code=404, detail="Article not found")

        # Initialize ChatOpenAI
        llm = ChatOpenAI(model="gpt-4o-2024-08-06", temperature=0)

        # Create the summarization prompt
        template = """
        Always start your reply with a greeting and end with a closing.
        Please provide a detail summary of the following article. 
        The summary should capture the main points and key insights.
        Write your answer in the bullet points.
        Give the details in 4-5 paragraphs.
        Article Content:
        {content}

        Please provide the summary in 2-3 paragraphs.
        """

        prompt = ChatPromptTemplate.from_template(template)

        # Create the chain
        chain = (
                prompt
                | llm
                | StrOutputParser()
        )

        # Generate summary
        summary = chain.invoke({"content": article["content"]})
        print("Summary", summary)

        return {
            "message": "Summary generated successfully",
            "data": {
                "article_id": id,
                "title": article["title"],
                "summary": summary
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
