import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { fetchFromCache } from '../../lib/redis';
import { fetchPost, fetchPostComments } from '../../lib/fetch-posts';
import Layout from '../../components/Layout.js';

export default function PostDetail({ post, comments, renderTime }) {
  const router = useRouter();
  const [clientTime, setClientTime] = useState(null);

  useEffect(() => {
    // Measure client-side render time
    const startTime = performance.now();
    setClientTime(performance.now() - startTime);
  }, []);

  // If the page is still generating via SSR
  if (router.isFallback) {
    return (
      <Layout title="Loading...">
        <div className="container">
          <h1>Loading...</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={post.title}>
      <div className="container">
        <div className="post-detail">
          <h1>{post.title}</h1>
          <p className="post-body">{post.body}</p>
          
          <div className="performance-metrics">
            <h3>Performance Metrics:</h3>
            <p>Server-side render time: {renderTime.toFixed(2)} ms</p>
            {clientTime && <p>Client-side hydration time: {clientTime.toFixed(2)} ms</p>}
          </div>
          
          <div className="comments-section">
            <h2>Comments ({comments.length})</h2>
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <h3>{comment.name}</h3>
                <p className="email">{comment.email}</p>
                <p>{comment.body}</p>
              </div>
            ))}
          </div>
          
          <div className="navigation">
            <Link href="/">
              <a className="nav-button">Back to Posts</a>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const startTime = process.hrtime();
  
  try {
    const { id } = params;
    
    // Fetch post and comments in parallel with Redis caching
    const [post, comments] = await Promise.all([
      fetchFromCache(`post-${id}`, () => fetchPost(id), 600), // TTL: 10 minutes
      fetchFromCache(`post-${id}-comments`, () => fetchPostComments(id), 300) // TTL: 5 minutes
    ]);
    
    const endTime = process.hrtime(startTime);
    const renderTime = endTime[0] * 1000 + endTime[1] / 1000000; // Convert to milliseconds
    
    return {
      props: {
        post,
        comments,
        renderTime
      }
    };
  } catch (error) {
    console.error(`Failed to fetch post details: ${error.message}`);
    
    // Return not found page on error
    return {
      notFound: true
    };
  }
}