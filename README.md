# AI Article Manager

AI Article Manager is a full-stack web application that allows users to manage articles with the power of AI. Users can create, edit, view, and delete articles. The application is built with a FastAPI backend, MongoDB database, and a React/Next.js frontend. This project is containerized using Docker for easy deployment.

## Project Structure
project-root/ ├── app/ # Backend (FastAPI) │ ├── main.py # FastAPI entry point │ ├── crud.py # CRUD operations for articles │ ├── database.py # MongoDB connection setup │ ├── schemas.py # Pydantic models for data validation │ └── requirements.txt # Backend dependencies ├── frontend/ # Frontend (React/Next.js) │ ├── src/ │ │ ├── app/ # Application components │ │ ├── pages/ # Next.js pages │ └── package.json # Frontend dependencies ├── Dockerfile # Dockerfile for FastAPI backend ├── docker-compose.yml # Docker Compose configuration for FastAPI and MongoDB └── README.md # Project documentation


## Technologies Used

- **Backend**: FastAPI, MongoDB, Pydantic (for data validation)
- **Frontend**: React, Next.js, Tailwind CSS
- **Containerization**: Docker, Docker Compose
- **Other Services**: OpenAI API, Pinecone Vector Database

---

## Getting Started

Follow the instructions below to set up and run the project locally or in a Docker container.

### Prerequisites

- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js 14+](https://nodejs.org/) and npm
- [Docker](https://www.docker.com/products/docker-desktop)

### Environment Variables

Create a `.env` file in the `app` directory with the following environment variables:

```plaintext
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=article-management
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key


Setting Up the Backend (FastAPI)
1. Install Dependencies
Navigate to the backend directory and install dependencies:

cd app
pip install -r requirements.txt

2. Run the Backend Server
Start the FastAPI server:

uvicorn main:app --reload --host 0.0.0.0 --port 8000
Access the API documentation at http://localhost:8000/docs.

Setting Up the Frontend (React/Next.js)
1. Install Dependencies
Navigate to the frontend directory and install dependencies:

cd frontend
npm install


2. Run the Frontend Server
Start the Next.js development server:
npm run dev
Access the frontend at http://localhost:3000.


Docker Setup
To simplify deployment, the project includes a Dockerfile and docker-compose.yml configuration.

1. Build and Start Containers
Run the following command from the root of the project to build and start both the FastAPI backend and MongoDB containers:
docker-compose up --build

2. Accessing the Application
Backend API: http://localhost:8000/docs
Frontend: http://localhost:3000
3. Stop Containers
To stop the containers, press Ctrl + C or run:
docker-compose down

Key Endpoints
GET /articles/: Retrieve a list of articles.
GET /articles/{id}: Retrieve a specific article by ID.
POST /articles/: Create a new article.
PUT /articles/{id}: Update an article by ID.
DELETE /articles/{id}: Delete an article by ID.
POST /articles/{id}/summarize: Generate a summary for an article using the GPT-4 API.
POST /articles/{id}/embed: Generate and store article embeddings.
GET /articles/search: Find similar articles using Pinecone.


Project Features
Full-Stack Functionality: Complete CRUD operations for articles.
AI-Powered Summarization: Integrates OpenAI API to summarize article content.
Vector Search: Uses Pinecone to store and search for article embeddings.


Troubleshooting
Database Connection: Ensure MongoDB is properly configured in the .env file.
API Key Issues: Make sure OpenAI and Pinecone API keys are valid.
Docker Errors: Check Docker logs with docker-compose logs for debugging.

Contributing
Feel free to contribute to this project by opening issues or submitting pull requests. Please follow the standard coding guidelines and ensure your changes are well-documented.


