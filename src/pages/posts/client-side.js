import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout.js';

export default function ClientSidePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  if (loading) return (
    <Layout title="Loading Posts...">
      <div className="container" style={{ backgroundColor: 'white', color: '#5e095e' }}>
        <h1>Loading posts...</h1>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout title="Error">
      <div className="container" style={{ backgroundColor: 'white', color: '#5e095e' }}>
        <h1>Error loading posts</h1>
        <p>{error}</p>
      </div>
    </Layout>
  );

  return (
    <Layout title="Posts List - Client Rendered">
      <div className="container" style={{ backgroundColor: 'white', color: '#5e095e' }}>
        <h1 style={{ color: 'black' }}>Posts List (Client-side Rendered)</h1>

        <div className="posts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {posts.slice(0, 10).map(post => (
            <div key={post.id} className="post-card" style={{
              backgroundColor: '#dab1da',
              border: '1px solid #733b73',
              borderRadius: '8px',
              padding: '15px',
              transition: 'transform 0.2s ease'
            }}>
              <h2 style={{ color: '#5e095e' }}>{post.title}</h2>
              <p style={{ color: '#733b73' }}>{post.body.substring(0, 100)}...</p>
              <Link href={`/posts/${post.id}`}>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: '#5e095e',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  View Details
                </span>
              </Link>
            </div>
          ))}
        </div>
        <div className="navigation" style={{ marginTop: '30px', textAlign: 'center' }}>
          <Link href="/">
            <span style={{
              display: 'inline-block',
              backgroundColor: '#5e095e',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '6px',
              fontWeight: 'bold',
              textDecoration: 'none',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.2s ease, transform 0.2s ease'
            }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#733b73'; e.target.style.transform = 'scale(1.05)'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = '#5e095e'; e.target.style.transform = 'scale(1)'; }}>
              View Server-side Rendered Posts
            </span>
          </Link>
        </div>

      </div>
    </Layout>
  );
}
