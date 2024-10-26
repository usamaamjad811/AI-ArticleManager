# AI Article Manager 🤖📚

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)

AI Article Manager is a powerful full-stack web application that leverages artificial intelligence to help users manage their articles efficiently. Built with modern technologies, it offers seamless article management with AI-powered features like automatic summarization and semantic search capabilities.

## ✨ Features

- 📝 Complete CRUD operations for articles
- 🤖 AI-powered article summarization using GPT-4
- 🔍 Semantic search using vector embeddings
- 🎯 Similar article recommendations
- 🚀 Fast and responsive user interface
- 🔒 Data validation and type safety
- 🐳 Containerized deployment

## 🏗️ Architecture

```
project-root/
├── app/                  # Backend (FastAPI)
│   ├── main.py          # FastAPI entry point
│   ├── crud.py          # CRUD operations
│   ├── database.py      # MongoDB setup
│   ├── schemas.py       # Pydantic models
│   └── requirements.txt # Backend dependencies
├── frontend/            # Frontend (React/Next.js)
│   ├── src/
│   │   ├── app/        # Application components
│   │   └── pages/      # Next.js pages
│   ├── Dockerfile      # Frontend Dockerfile
│   └── package.json    # Frontend dependencies
├── Dockerfile  # Docker # Backend Dockerfile
├── docker-compose.yml  # Docker Compose config
└── README.md          # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 14+
- Docker and Docker Compose
- MongoDB database
- OpenAI API key
- Pinecone API key

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-article-manager.git
cd ai-article-manager
```

2. Create `.env` file in the `app` directory:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=article-management
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

### Development Setup

#### Backend (FastAPI)

```bash
cd app
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

### 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# Stop services
docker-compose down
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/articles/` | List all articles |
| GET | `/articles/{id}` | Get article by ID |
| POST | `/articles/` | Create new article |
| PUT | `/articles/{id}` | Update article |
| DELETE | `/articles/{id}` | Delete article |
| POST | `/articles/{id}/summarize` | Generate AI summary |
| POST | `/articles/{id}/embed` | Generate embeddings |
| GET | `/articles/search` | Search similar articles |

## 💻 Tech Stack

### Backend
- FastAPI for high-performance API
- MongoDB for document storage
- Pydantic for data validation
- OpenAI API for AI features
- Pinecone for vector search

### Frontend
- React for UI components
- Next.js for SSR and routing
- Tailwind CSS for styling
- Axios for API calls

### DevOps
- Docker for containerization
- Docker Compose for orchestration

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Verify MongoDB URI in `.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Key Errors**
   - Validate OpenAI API key
   - Confirm Pinecone API key
   - Check for proper environment variable loading

3. **Docker Issues**
   - Run `docker-compose logs` for detailed logs
   - Ensure all required ports are available
   - Verify Docker daemon is running

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- Pinecone for vector search capabilities
- FastAPI team for the amazing framework
- MongoDB team for the robust database

## 📧 Contact

Project Link: [https://github.com/yourusername/ai-article-manager](https://github.com/yourusername/ai-article-manager)

---

⭐️ If you find this project useful, please consider giving it a star!
