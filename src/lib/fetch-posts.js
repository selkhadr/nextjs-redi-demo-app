const API_BASE_URL = process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';

export async function fetchPosts() {
  const response = await fetch(`${API_BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
}

export async function fetchPost(id) {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch post ${id}`);
  }
  return response.json();
}

export async function fetchPostComments(id) {
  const response = await fetch(`${API_BASE_URL}/posts/${id}/comments`);
  if (!response.ok) {
    throw new Error(`Failed to fetch comments for post ${id}`);
  }
  return response.json();
}