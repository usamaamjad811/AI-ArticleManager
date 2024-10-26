"use client";
import axios from 'axios';


interface Article {
  title: string;
  content: string;
}

// Fetch article data
async function fetchArticle(id: string): Promise<Article | null> {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/articles/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

interface ArticleDetailPageProps {
  params: { id: string };
}

// Define the component with an async function to fetch data
export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const article = await fetchArticle(params.id);

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-700">{article.content}</p>
    </div>
  );
}