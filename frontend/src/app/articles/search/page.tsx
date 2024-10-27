"use client";
import { useState } from 'react';
import HomeButton from "../../components/HomeButton";

export default function Search() {
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(''); // Clear previous response

    try {
      const res = await fetch('http://localhost:8000/ai-article-search/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // Function to read each chunk
      const readStream = async () => {
        let done = false;
        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          setResponse((prev) => prev + decoder.decode(value, { stream: true }));
        }
      };

      await readStream();
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve response. Please try again.');
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
        height: '100vh',
        backgroundColor: '#e0e5ec',
      }}
    >
      <div
        style={{
          padding: '20px',
          maxWidth: '600px',
          width: '100%',
          backgroundColor: '#f5f7fa',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ color: '#333', textAlign: 'center' }}>AI Article Search</h1>
          <HomeButton />
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
              backgroundColor: '#007BFF',
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
              backgroundColor: '#e9f7ef',
              border: '1px solid #c3e6cb',
              borderRadius: '5px',
              whiteSpace: 'pre-wrap', // Preserves line breaks
            }}
          >
            <h2 style={{ color: '#155724' }}>Response</h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
