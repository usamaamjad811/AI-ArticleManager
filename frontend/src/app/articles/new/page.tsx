// src/app/articles/new/page.tsx
"use client";

import { useEffect, useState } from 'react';
import ArticleForm from '../../components/ArticleForm';
import HomeButton from "../../components/HomeButton";

export default function NewArticlePage() {
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Simulate a short delay before showing the page
    const timer = setTimeout(() => setLoading(false), 1000); // 1-second delay
    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

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
          <HomeButton /> {/* Add Home button here */}
      <h1 className="text-2xl font-bold mb-4">Create New Article here</h1>
      <ArticleForm />
    </div>
  );
}
