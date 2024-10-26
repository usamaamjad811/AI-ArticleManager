"use client";
import React, { useEffect, useState } from 'react';
import ArticleList from '../components/ArticleList';
import axios from 'axios';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/articles/');
        setArticles(response.data.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    }
    fetchArticles();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Article Manager</h1>
      <ArticleList/>
    </div>
  );
}
