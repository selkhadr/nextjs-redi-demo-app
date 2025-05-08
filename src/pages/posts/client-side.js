import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout.js';

export default function ClientSidePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchTime, setFetchTime] = useState(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const startTime = performance.now();
        const response = await fetch('/api/posts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        setPosts(data);
        setFetchTime(performance.now() - startTime);
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
      <div className="container">
        <h1>Loading posts...</h1>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout title="Error">
      <div className="container">
        <h1>Error loading posts</h1>
        <p>{error}</p>
      </div>
    </Layout>
  );

  return (
    <Layout title="Posts List - Client Rendered">
      <div className="container">
        <h1>Posts List (Client-side Rendered)</h1>
        
        <div className="performance-metrics">
          <h3>Performance Metrics:</h3>
          <p>Client-side fetch time: {fetchTime.toFixed(2)} ms</p>
        </div>

        <div className="posts-grid">
          {posts.slice(0, 10).map(post => (
            <div key={post.id} className="post-card">
              <h2>{post.title}</h2>
              <p>{post.body.substring(0, 100)}...</p>
              <Link href={`/posts/${post.id}`} className="view-button">
                View Details
              </Link>
            </div>
          ))}
        </div>
        
        <div className="navigation">
          <Link href="/">
            View Server-side Rendered Posts
          </Link>
        </div>
      </div>
    </Layout>
  );
}