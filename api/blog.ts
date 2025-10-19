// Vercel Serverless Function: /api/blog
// Handles CRUD for blog posts and interactions.

import { connectToDatabase } from './lib/mongodb.js';
import type { BlogPost, Comment, User } from '../types';

// Simple list of keywords for moderation. In a real app, this would be more sophisticated.
const BLOCKED_KEYWORDS = ['badword', 'spam', 'crypto scam', 'inappropriate', 'explicit'];

const containsBlockedKeywords = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return BLOCKED_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { db } = await connectToDatabase();
        const blogCollection = db.collection('blog');
        const usersCollection = db.collection('users');

        if (req.method === 'GET') {
            const { userId } = req.query;
            let userIsAdmin = false;

            if (userId) {
                const user = await usersCollection.findOne({ id: userId });
                if (user && user.isAdmin) {
                    userIsAdmin = true;
                }
            }

            const query = userIsAdmin ? {} : { status: 'approved' };
            const posts = await blogCollection.find(query).sort({ isPinned: -1, createdAt: -1 }).toArray();
            return res.status(200).json(posts);
        }

        if (req.method === 'POST') {
            const newPost: Omit<BlogPost, 'id' | 'createdAt' | 'status'> = req.body;
            if (!newPost || !newPost.title || !newPost.content || !newPost.userId) {
                return res.status(400).json({ error: 'Invalid post data provided.' });
            }

            const author = await usersCollection.findOne({ id: newPost.userId });
            const hasBlockedContent = containsBlockedKeywords(newPost.title) || containsBlockedKeywords(newPost.content);

            const postToInsert: BlogPost = {
                ...newPost,
                id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
                createdAt: Date.now(),
                isPinned: false,
                status: hasBlockedContent ? 'pending' : 'approved',
                userProfilePictureUrl: author?.profilePictureUrl || undefined,
            };
            await blogCollection.insertOne(postToInsert);
            return res.status(201).json(postToInsert);
        }

        if (req.method === 'PUT') {
            const { postId, action, userId, comment } = req.body;
            if (!postId || !action) {
                return res.status(400).json({ error: 'postId and action are required.' });
            }

            const post = await blogCollection.findOne({ id: postId });
            if (!post) {
                return res.status(404).json({ error: 'Post not found.' });
            }

            const requestingUser = userId ? await usersCollection.findOne({ id: userId }) : null;
            const isOwner = requestingUser?.isAdmin;
            const isModerator = requestingUser?.canModerate;

            let updateOperation = {};

            switch (action) {
                case 'toggle_like':
                    if (!userId) return res.status(400).json({ error: 'userId is required for like action.' });
                    const isLiked = post.likes.includes(userId);
                    updateOperation = isLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } };
                    break;
                case 'add_comment':
                    if (!comment) return res.status(400).json({ error: 'comment object is required.' });
                    const newComment: Comment = {
                        ...comment,
                        id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
                        createdAt: Date.now(),
                    };
                    updateOperation = { $push: { comments: newComment } };
                    break;
                case 'increment_share':
                    updateOperation = { $inc: { shares: 1 } };
                    break;
                case 'toggle_pin':
                    if (!isOwner) return res.status(403).json({ error: 'You do not have permission to pin posts.' });
                    updateOperation = { $set: { isPinned: !post.isPinned } };
                    break;
                 case 'approve_post':
                    if (!isOwner && !isModerator) return res.status(403).json({ error: 'You do not have permission to approve posts.' });
                    updateOperation = { $set: { status: 'approved' } };
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid action.' });
            }

            const result = await blogCollection.updateOne({ id: postId }, updateOperation);
            
            if (result.modifiedCount >= 0) {
                const updatedPost = await blogCollection.findOne({ id: postId });
                return res.status(200).json(updatedPost);
            } else {
                 return res.status(500).json({ error: 'Failed to update post.' });
            }
        }
        
        if (req.method === 'DELETE') {
            const { postId, userId } = req.body;
            if (!postId || !userId) {
                return res.status(400).json({ error: 'postId and userId are required for deletion.' });
            }
            const postToDelete = await blogCollection.findOne({ id: postId });
            if (!postToDelete) {
                return res.status(404).json({ error: 'Post not found.' });
            }
            const requestingUser = await usersCollection.findOne({ id: userId });
            
            // Allow deletion if user is admin, a moderator, OR if the post is pending and it's their own post
            const canDelete = requestingUser?.isAdmin || requestingUser?.canModerate || (postToDelete.status === 'pending' && postToDelete.userId === userId);

            if (!canDelete) {
                return res.status(403).json({ error: 'You do not have permission to delete this post.' });
            }

            const result = await blogCollection.deleteOne({ id: postId });
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Post not found during deletion.' });
            }

            return res.status(200).json({ success: true, message: 'Post deleted successfully.' });
        }

        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any)
{
        console.error('Error with /api/blog:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}