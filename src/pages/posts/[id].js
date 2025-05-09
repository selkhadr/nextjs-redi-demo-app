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
      <div className="container">
        <div className="post-detail">
          <h1>{post.title}</h1>
          <p className="post-body">{post.body}</p>
          
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
            <Link href="/" className="nav-button">
              Back to Posts
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
