"use client";
import { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface ApiResponse {
  status: string;
  question: string;
  response: string;
  index_details: Record<string, unknown>;
}

export default function Search() {
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post<ApiResponse>('http://localhost:8000/ai-article-search/', {
        question,
      });
      setResponse(res.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || 'Failed to retrieve response. Please try again.');
      } else {
        setError('An unexpected error occurred.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        backgroundColor: '#e0e5ec', // Subtle background color for the whole page
      }}
    >
      <div
        style={{
          padding: '20px',
          maxWidth: '600px',
          width: '100%', // Responsive width
          backgroundColor: '#f5f7fa', // Light background color for the form
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ color: '#333', textAlign: 'center' }}>AI Article Search</h1>
        <form onSubmit={handleSearch}>
          <label style={{ fontWeight: 'bold', color: '#555' }}>
            Enter your question:
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What is the best way to manage articles?"
            required
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px',
              width: '100%',
              backgroundColor: '#007BFF', // Blue button
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {loading && <p style={{ color: '#007BFF', textAlign: 'center' }}>Loading...</p>}

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {response && (
          <div
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#e9f7ef', // Light green background for response
              border: '1px solid #c3e6cb',
              borderRadius: '5px',
            }}
          >
            <h2 style={{ color: '#155724' }}>Response</h2>
            <p>
              <strong>Question:</strong> {response.question}
            </p>
            <p>
              <strong>Answer:</strong> {response.response}
            </p>
            <details>
              <summary style={{ color: '#155724' }}>Index Details</summary>
              <pre>{JSON.stringify(response.index_details, null, 2)}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
