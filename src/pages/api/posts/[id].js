import { fetchFromCache } from '../../../lib/redis';
import { fetchPost, fetchPostComments } from '../../../lib/fetch-posts';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    // Validate the ID is a number
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    // Use Promise.all to fetch post and comments in parallel with Redis caching
    const [post, comments] = await Promise.all([
      fetchFromCache(`post-${id}`, () => fetchPost(id), 600), // TTL: 10 minutes
      fetchFromCache(`post-${id}-comments`, () => fetchPostComments(id), 300) // TTL: 5 minutes
    ]);

    // Return combined data
    res.status(200).json({
      post,
      comments,
      _meta: {
        cached: true,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(`Error fetching post details:`, error);
    res.status(500).json({ message: 'Failed to fetch post details', error: error.message });
  }
}