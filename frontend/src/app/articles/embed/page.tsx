"use client";
import { useState } from 'react';
import HomeButton from "../../components/HomeButton";

export default function EmbedArticles() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const embedArticles = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch("http://localhost:8000/embed-articles/");
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage("Failed to embed articles.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '2rem auto',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    ><HomeButton />
      <h1 style={{ fontSize: '1.8rem', color: '#333' }}>Embed Articles</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Click the button below to embed articles into Pinecone.
      </p>
      <button
        onClick={embedArticles}
        disabled={loading}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          backgroundColor: loading ? '#888' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          transition: 'background-color 0.3s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {loading ? (
          <>
            <div
              style={{
                border: '3px solid #fff',
                borderRadius: '50%',
                borderTop: '3px solid transparent',
                width: '20px',
                height: '20px',
                marginRight: '10px',
                animation: 'spin 1s linear infinite',
              }}
            ></div>
            Embedding...
          </>
        ) : (
          'Embed Articles'
        )}
      </button>
      {message && (
        <p
          style={{
            marginTop: '1.5rem',
            color: message.includes('successfully') ? '#28a745' : '#dc3545',
            fontWeight: 'bold',
          }}
        >
          {message}
        </p>
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
