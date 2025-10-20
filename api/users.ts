// api/users.ts
import { connectToDatabase } from './lib/mongodb.js';
import type { User, BlogPost } from '../types';
import { getUserBadge } from '../utils/userHelper';

export default async function handler(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { db } = await connectToDatabase();
        const usersCollection = db.collection<User>('users');
        const postsCollection = db.collection<BlogPost>('blog_posts');

        const { userId, action } = req.query;

        if (req.method === 'GET') {
            const users = await usersCollection.find({}, { projection: { passwordHash: 0 } }).toArray();
            return res.status(200).json(users);
        }

        if (req.method === 'PUT') {
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required.' });
            }

            // Handle propagation of user profile changes
            if (action === 'propagate_changes') {
                const { name, profilePictureUrl } = req.body;
                const user = await usersCollection.findOne({ id: userId });
                if (!user) return res.status(404).json({ error: 'User not found.' });

                const userBadge = getUserBadge(user);

                // Update all posts by this user
                await postsCollection.updateMany(
                    { userId: userId },
                    { $set: { 
                        userName: name, 
                        userProfilePictureUrl: profilePictureUrl,
                        userBadge: userBadge
                    }}
                );

                // Update all comments by this user
                await postsCollection.updateMany(
                    { "comments.userId": userId },
                    { $set: { 
                        "comments.$[elem].userName": name,
                        "comments.$[elem].userBadge": userBadge
                    }},
                    { arrayFilters: [{ "elem.userId": userId }] }
                );
                
                return res.status(200).json({ success: true, message: 'User changes propagated.' });
            }

            // Handle regular user data updates
            const updateData = req.body;
            if (!updateData) {
                return res.status(400).json({ error: 'Update data is required.' });
            }
            
            // Prevent certain fields from being updated directly
            delete updateData.id;
            delete updateData.email;
            delete updateData.passwordHash;

            const finalUpdateData = { ...updateData, lastActive: Date.now() };

            const result = await usersCollection.findOneAndUpdate(
                { id: userId },
                { $set: finalUpdateData },
                { returnDocument: 'after', projection: { passwordHash: 0 } }
            );

            if (!result) {
                return res.status(404).json({ error: 'User not found.' });
            }
            
            return res.status(200).json(result);
        }

        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).end('Method Not Allowed');

    } catch (error: any) {
        console.error('Error with /api/users:', error);
        return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
    }
}