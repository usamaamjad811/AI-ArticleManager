"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';


interface Article {
  title: string;
  content: string;
}

interface ArticleFormProps {
  article?: Article;
  articleId?: string;
  isEditing?: boolean;
}

export default function ArticleForm({ article, articleId, isEditing = false }: ArticleFormProps) {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, content };

    try {
      if (isEditing && articleId) {
        await axios.put(`http://127.0.0.1:8000/articles/${articleId}`, payload);
      } else {
        await axios.post('http://127.0.0.1:8000/articles/', payload);
      }
      router.push('/articles');
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="border p-2 rounded"
        rows={5}
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {isEditing ? 'Update' : 'Create'} Article
      </button>
    </form>
  );
}