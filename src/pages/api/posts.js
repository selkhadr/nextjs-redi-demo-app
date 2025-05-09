import { fetchFromCache } from '../../lib/redis';
import { fetchPosts } from '../../lib/fetch-posts';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const bypassCache = req.query.bypassCache === 'true';

  try {
    const posts = bypassCache
      ? await fetchPosts()
      : await fetchFromCache('all-posts', fetchPosts, 300);

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
}

