
import React, { useState, useContext } from 'react';
// FIX: Corrected import path for types
import { Comment, AuthContextType } from '../types';
// FIX: Corrected import path for AuthContext
import { AuthContext } from '../contexts/AuthContext';
import { BlogContext } from '../contexts/BlogContext';
import { LoadingIcon } from './icons/IconComponents';
import BlogUserBadge from './BlogUserBadge';
import { timeAgo } from '../utils/time';
import { getUserBadge } from '../utils/userHelper';

interface BlogCommentSectionProps {
    postId: string;
    comments: Comment[];
}

const BlogCommentSection: React.FC<BlogCommentSectionProps> = ({ postId, comments }) => {
    // FIX: Cast context to the correct type to resolve property errors
    const auth = useContext(AuthContext) as AuthContextType;
    const blog = useContext(BlogContext);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth?.currentUser || !blog || !newComment.trim()) return;

        setIsLoading(true);
        await blog.addComment(postId, {
            userId: auth.currentUser.id,
            userName: auth.currentUser.name,
            userBadge: getUserBadge(auth.currentUser), // Badge is stored but we'll prefer the dynamic one
            text: newComment,
        });
        setNewComment('');
        setIsLoading(false);
    };

    return (
        <div className="mt-6 pt-4 border-t border-white/20 space-y-4">
            <h4 className="font-semibold text-lg text-white mb-2">Comments ({comments.length})</h4>
            
            {auth?.currentUser && (
                <form onSubmit={handleSubmit} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-brand-primary rounded-full flex-shrink-0 flex items-center justify-center font-bold text-brand-dark">
                        {auth?.currentUser?.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            rows={2}
                            className="block w-full rounded-md border-0 bg-black/30 py-2 px-3 text-brand-light shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary text-sm resize-y"
                        />
                        <button type="submit" disabled={isLoading || !newComment.trim()} className="mt-2 px-4 py-1.5 text-xs font-semibold text-brand-dark bg-brand-light rounded-md hover:bg-gray-300 disabled:opacity-50">
                            {isLoading ? <LoadingIcon className="h-4 w-4 animate-spin" /> : 'Post Comment'}
                        </button>
                    </div>
                </form>
            )}

            {/* Existing Comments */}
            <div className="space-y-4">
                {comments.slice().sort((a, b) => b.createdAt - a.createdAt).map(comment => {
                    // Dynamically find the user and their badge
                    const commenter = auth?.users.find(u => u.id === comment.userId);
                    const dynamicBadge = getUserBadge(commenter || null);

                    return (
                        <div key={comment.id} className="flex items-start gap-3">
                            <div className="w-9 h-9 bg-brand-secondary rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white">
                                {(commenter?.name || comment.userName).charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-grow bg-black/20 p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-white">{commenter?.name || comment.userName}</span>
                                    <BlogUserBadge badge={dynamicBadge} />
                                </div>
                                <p className="text-sm text-gray-300 mt-1">{comment.text}</p>
                                <p className="text-xs text-gray-500 mt-2">{timeAgo(comment.createdAt)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BlogCommentSection;