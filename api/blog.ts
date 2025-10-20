// Vercel Serverless Function: /api/blog
// Handles CRUD for blog posts

import { connectToDatabase } from './lib/mongodb';
// FIX: Corrected import path for types
import type { BlogPost, Comment } from '../types';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { db } = await connectToDatabase();
        const postsCollection = db.collection('blog_posts');
        const usersCollection = db.collection('users');

        if (req.method === 'GET') {
            const { userId } = req.query;
            const user = userId ? await usersCollection.findOne({ id: userId }) : null;
            const query = (user && (user.isAdmin || user.canModerate)) ? {} : { status: 'approved' };
            const posts = await postsCollection.find(query).sort({ isPinned: -1, createdAt: -1 }).toArray();
            return res.status(200).json(posts);
        }

        if (req.method === 'POST') {
            const postData: Omit<BlogPost, 'id' | 'createdAt' | 'status'> = req.body;
            const user = await usersCollection.findOne({ id: postData.userId });
            if (!user) return res.status(403).json({ error: "User not found." });

            const newPost: BlogPost = {
                ...postData,
                id: `post_${Date.now()}`,
                createdAt: Date.now(),
                status: user.isAdmin ? 'approved' : 'pending',
                userProfilePictureUrl: user.profilePictureUrl || undefined,
            };
            await postsCollection.insertOne(newPost);
            return res.status(201).json(newPost);
        }

        if (req.method === 'PUT') {
            const { postId, action, userId, comment, ...updateData } = req.body;
            if (!postId || !action) return res.status(400).json({ error: "Post ID and action are required." });
            
            const user = userId ? await usersCollection.findOne({ id: userId }) : null;
            if (!user) return res.status(403).json({ error: "User action not permitted." });

            let updateOperation;
            switch(action) {
                case 'toggle_like':
                    const post = await postsCollection.findOne({ id: postId });
                    const isLiked = post.likes.includes(userId);
                    updateOperation = isLiked ? { $pull: { likes: userId } } : { $push: { likes: userId } };
                    break;
                case 'add_comment':
                    const newComment: Comment = { ...comment, id: `comment_${Date.now()}`, createdAt: Date.now() };
                    updateOperation = { $push: { comments: newComment } };
                    break;
                case 'increment_share':
                    updateOperation = { $inc: { shares: 1 } };
                    break;
                case 'toggle_pin':
                    if (!user.isAdmin) return res.status(403).json({ error: "Unauthorized" });
                    const postToPin = await postsCollection.findOne({ id: postId });
                    updateOperation = { $set: { isPinned: !postToPin.isPinned }};
                    break;
                case 'approve_post':
                    if (!user.isAdmin && !user.canModerate) return res.status(403).json({ error: "Unauthorized" });
                    updateOperation = { $set: { status: 'approved' }};
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid action.' });
            }

            await postsCollection.updateOne({ id: postId }, updateOperation);
            const updatedPost = await postsCollection.findOne({ id: postId });
            return res.status(200).json(updatedPost);
        }

        if (req.method === 'DELETE') {
            const { postId, userId } = req.body;
            const user = await usersCollection.findOne({ id: userId });
            const post = await postsCollection.findOne({ id: postId });
            if (!user || !post) return res.status(404).json({ error: "Not found" });
            
            if (!user.isAdmin && !user.canModerate && user.id !== post.userId) {
                return res.status(403).json({ error: "You do not have permission to delete this post." });
            }
            await postsCollection.deleteOne({ id: postId });
            return res.status(200).json({ success: true });
        }

        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end('Method Not Allowed');
    } catch (error: any) {
        console.error('Error with /api/blog:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}