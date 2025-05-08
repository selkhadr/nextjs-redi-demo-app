import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchFromCache } from '../lib/redis';
import { fetchPosts } from '../lib/fetch-posts';
import Layout from '../components/Layout.js';

export default function Home({ initialPosts, renderTime }) {
  const [clientTime, setClientTime] = useState(null);

  useEffect(() => {
    const startTime = performance.now();
    setClientTime(performance.now() - startTime);
  }, []);

  return (
    <Layout title="Posts List - Server Rendered">
      <div className="container">
        <h1>Posts List (Server-side Rendered)</h1>
        
        <div className="performance-metrics">
          <h3>Performance Metrics:</h3>
          <p>Server-side render time: {renderTime.toFixed(2)} ms</p>
          {clientTime && <p>Client-side hydration time: {clientTime.toFixed(2)} ms</p>}
        </div>

        <div className="posts-grid">
          {initialPosts.slice(0, 10).map(post => (
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
          <Link href="/posts/client-side" className="nav-button">
            View Client-side Rendered Posts
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const startTime = process.hrtime();
  
  const posts = await fetchFromCache('all-posts', fetchPosts, 300);
  
  const endTime = process.hrtime(startTime);
  const renderTime = endTime[0] * 1000 + endTime[1] / 1000000;
  
  return {
    props: {
      initialPosts: posts,
      renderTime
    }
  };
}