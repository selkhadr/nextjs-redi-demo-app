import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { fetchFromCache } from '../../lib/redis';
import { fetchPost, fetchPostComments } from '../../lib/fetch-posts';
import Layout from '../../components/Layout.js';

export default function PostDetail({ post, comments }) {
  const router = useRouter();
  
  return (
    <Layout title={post.title}>
      <div className="container" style={{ backgroundColor: 'white', color: '#5e095e' }}>
        <div className="post-detail">
          <h1 style={{ color: '#5e095e' }}>{post.title}</h1>
          <p className="post-body" style={{ color: '#733b73' }}>{post.body}</p>
          
          <div className="comments-section" style={{ 
            backgroundColor: '#dab1da',
            border: '1px solid #733b73',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '30px'
          }}>
            <h2 style={{ color: '#5e095e' }}>Comments ({comments.length})</h2>
            {comments.map(comment => (
              <div key={comment.id} className="comment" style={{
                backgroundColor: 'white',
                border: '1px solid #733b73',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px'
              }}>
                <h3 style={{ color: '#5e095e', marginTop: '0' }}>{comment.name}</h3>
                <p className="email" style={{ color: '#733b73', fontStyle: 'italic' }}>{comment.email}</p>
                <p style={{ color: '#733b73' }}>{comment.body}</p>
              </div>
            ))}
          </div>
          
          <div className="navigation" style={{ marginTop: '30px', textAlign: 'center' }}>
            <Link href="/">
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
                Back to Posts
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const { id } = params;
    const [post, comments] = await Promise.all([
      fetchFromCache(`post-${id}`, () => fetchPost(id), 600),
      fetchFromCache(`post-${id}-comments`, () => fetchPostComments(id), 300)
    ]);
    
    return {
      props: {
        post,
        comments
      }
    };
  } catch (error) {
    console.error(`Failed to fetch post details: ${error.message}`);
    return {
      notFound: true
    };
  }
}