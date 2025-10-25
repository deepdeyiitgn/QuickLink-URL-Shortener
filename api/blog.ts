import { connectToDatabase } from './lib/mongodb.js';
import type { BlogPost, Comment, User } from '../types';
import type { Filter, UpdateFilter } from 'mongodb';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { db } = await connectToDatabase();
        const postsCollection = db.collection<BlogPost>('blog_posts');
        const usersCollection = db.collection<User>('users');

        if (req.method === 'GET') {
            const { userId } = req.query;
            const user = userId ? await usersCollection.findOne({ id: userId }) : null;
            const query: Filter<BlogPost> = (user && (user.isAdmin || user.canModerate)) ? {} : { status: 'approved' };
            const posts = await postsCollection.find(query).sort({ isPinned: -1, createdAt: -1 }).toArray();
            return res.status(200).send(JSON.stringify(posts));
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
                views: 0,
            };
            await postsCollection.insertOne(newPost);
            return res.status(201).json(newPost);
        }

        if (req.method === 'PUT') {
            const { postId, action, userId, comment, ...updateData } = req.body;
            if (!postId || !action) return res.status(400).json({ error: "Post ID and action are required." });
            
            const post = await postsCollection.findOne({ id: postId });
            if (!post) return res.status(404).json({ error: 'Post not found.' });

            let updateOperation: UpdateFilter<BlogPost> | null = null;
            
            switch(action) {
                case 'toggle_like':
                    const user = userId ? await usersCollection.findOne({ id: userId }) : null;
                    if (!user) return res.status(403).json({ error: "User action not permitted." });
                    const isLiked = post.likes.includes(userId);
                    updateOperation = isLiked ? { $pull: { likes: userId } } : { $push: { likes: userId } };
                    break;
                case 'add_comment':
                     const commentUser = userId ? await usersCollection.findOne({ id: userId }) : null;
                     if (!commentUser) return res.status(403).json({ error: "User action not permitted." });
                    const newComment: Comment = {
                        ...comment,
                        id: `comment_${Date.now()}`,
                        createdAt: Date.now(),
                    };
                    updateOperation = { $push: { comments: newComment as any } };
                    break;
                case 'increment_share':
                    updateOperation = { $inc: { shares: 1 } };
                    break;
                case 'increment_view':
                    updateOperation = { $inc: { views: 1 } };
                    break;
                case 'toggle_pin':
                    const pinUser = userId ? await usersCollection.findOne({ id: userId }) : null;
                    if (!pinUser || !pinUser.isAdmin) return res.status(403).json({ error: "Unauthorized" });
                    updateOperation = { $set: { isPinned: !post.isPinned } };
                    break;
                case 'approve_post':
                    const modUser = userId ? await usersCollection.findOne({ id: userId }) : null;
                    if (!modUser || (!modUser.isAdmin && !modUser.canModerate)) return res.status(403).json({ error: "Unauthorized" });
                    updateOperation = { $set: { status: 'approved' } };
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid action.' });
            }
            
            if (updateOperation) {
                await postsCollection.updateOne({ id: postId }, updateOperation as any);
            }
            
            const updatedPost = await postsCollection.findOne({ id: postId });
            return res.status(200).json(updatedPost);
        }
        
        if (req.method === 'DELETE') {
            const { postId, userId } = req.body;
            const postToDelete = await postsCollection.findOne({ id: postId });
            const user = await usersCollection.findOne({ id: userId });

            if (!user || !postToDelete) return res.status(404).json({ error: "Not found." });

            if (postToDelete.userId !== userId && !user.isAdmin && !user.canModerate) {
                 return res.status(403).json({ error: "You are not authorized to delete this post." });
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