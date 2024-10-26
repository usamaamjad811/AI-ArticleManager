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
  const [article, setArticle] = useState<Article | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/articles/${params.id}`);
        setArticle(response.data.data);
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    }
    fetchArticle();
  }, [params.id]);

  if (!article) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Article</h1>
      <ArticleForm article={article} articleId={params.id} isEditing />
    </div>
  );
}
