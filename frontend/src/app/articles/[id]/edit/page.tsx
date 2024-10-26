"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ArticleForm from '../../../components/ArticleForm';

interface Article {
  title: string;
  content: string;
}

interface EditArticlePageProps {
  params: { id: string };
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const [article, setArticle] = useState<Article | undefined>(undefined);
  const [loading, setLoading] = useState(true); // Loading state for spinner
  const router = useRouter();

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/articles/${params.id}`);
        setArticle(response.data.data);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    }
    fetchArticle();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          style={{
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Article</h1>
      <ArticleForm article={article} articleId={params.id} isEditing />
    </div>
  );
}
