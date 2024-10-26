// src/app/components/ArticleList.js

import Link from 'next/link';

const ArticleList = ({ articles }) => (
  <div className="grid gap-4">
    {articles.map(article => (
      <Link key={article._id} href={`/articles/${article._id}`}>
        <div className="p-4 border rounded shadow cursor-pointer hover:bg-gray-100">
          <h2 className="font-bold">{article.title}</h2>
          <p>{article.content.slice(0, 1000)}...</p>
        </div>
      </Link>
    ))}
  </div>
);

export default ArticleList;
