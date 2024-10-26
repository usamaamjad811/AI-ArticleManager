// src/app/articles/new/page.tsx
"use client";
import ArticleForm from '../../components/ArticleForm';

export default function NewArticlePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Article</h1>
      <ArticleForm />
    </div>
  );
}
