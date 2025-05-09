import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchFromCache } from '../lib/redis';
import { fetchPosts } from '../lib/fetch-posts';
import Layout from '../components/Layout.js';

export default function Home({ initialPosts }) {
  return (
    <Layout title="Posts List - Server Rendered">
      <div className="container">
        <h1>Posts List (Server-side Rendered)</h1>

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
  const posts = await fetchFromCache('all-posts', fetchPosts, 300);

  return {
    props: {
      initialPosts: posts,
    }
  };
}
