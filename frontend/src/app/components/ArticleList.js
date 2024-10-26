"use client"; // Ensure this is a Client Component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import HomeButton from '../components/HomeButton';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(null); // Track which article is being summarized
  const [summaries, setSummaries] = useState({}); // Store summaries by article ID

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/articles/');
        setArticles(response.data.data); // Adjust based on your API response
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleDelete = async (articleId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/articles/${articleId}`);
      setArticles(articles.filter(article => article._id !== articleId));
      setSuccess('Article deleted successfully!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleSummarizeArticle = async (articleId) => {
    setSummarizing(articleId);
    setSuccess('');
    try {
      const response = await axios.post(`http://127.0.0.1:8000/articles/${articleId}/summarize`);
      setSummaries((prev) => ({
        ...prev,
        [articleId]: response.data.data.summary,
      }));
      setSuccess('Summary generated successfully!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSuccess('Failed to generate summary');
    } finally {
      setSummarizing(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <HomeButton /> {/* Add Home button here */}
      <h1 className="text-2xl font-bold mb-4">Articles</h1>
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {loading ? (
        <div className="flex justify-center items-center h-64">
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
      ) : articles.length === 0 ? (
        <p className="text-gray-500">No articles to display.</p>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <div key={article._id} className="p-4 border rounded shadow hover:bg-gray-100">
              <Link href={`/articles/${article._id}`}>
                <div className="cursor-pointer">
                  <h2 className="font-bold">{article.title}</h2>
                  <p>{article.content.slice(0, 100)}...</p>
                </div>
              </Link>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleDelete(article._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
                <Link href={`/articles/${article._id}/edit`}>
                  <button className="text-blue-500">Edit</button>
                </Link>
                <button
                  onClick={() => handleSummarizeArticle(article._id)}
                  className={`text-yellow-500 ${summarizing === article._id ? 'opacity-50' : ''}`}
                  disabled={summarizing === article._id}
                >
                  {summarizing === article._id ? 'Summarizing...' : 'Summarize'}
                </button>
              </div>
              {summaries[article._id] && (
                <div className="mt-4 border p-4 rounded shadow">
                  <h2 className="text-xl font-bold mb-2">Summary</h2>
                  <p>{summaries[article._id]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleList;
