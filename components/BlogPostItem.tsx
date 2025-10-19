import React, { useContext, useState } from 'react';
import { BlogPost } from '../types';
import { AuthContext } from '../contexts/AuthContext';
import { BlogContext } from '../contexts/BlogContext';
import { HeartIcon, ChatBubbleIcon, ShareIcon, PinIcon, TrashIcon, WarningIcon } from './icons/IconComponents';
import BlogUserBadge from './BlogUserBadge';
import BlogCommentSection from './BlogCommentSection';
import { timeAgo } from '../utils/time';

interface BlogPostProps {
    post: BlogPost;
}

const BlogPostItem: React.FC<BlogPostProps> = ({ post }) => {
    const auth = useContext(AuthContext);
    const blog = useContext(BlogContext);
    const [showComments, setShowComments] = useState(false);

    const isLiked = auth?.currentUser && post.likes.includes(auth.currentUser.id);
    const isOwner = auth?.currentUser?.isAdmin;

    const handleLike = () => {
        if (auth?.currentUser && blog?.toggleLike) {
            blog.toggleLike(post.id);
        } else {
            auth?.openAuthModal('login');
        }
    };
    
    const handleCommentClick = () => {
        if (!auth?.currentUser) {
            auth?.openAuthModal('login');
        } else {
            setShowComments(prev => !prev);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: `Check out this post on QuickLink: "${post.title}"`,
                url: window.location.href,
            }).then(() => {
                blog?.incrementShares(post.id);
            });
        } else {
            // Fallback for desktop
            navigator.clipboard.writeText(window.location.href + `#post-${post.id}`);
            alert('Link copied to clipboard!');
            blog?.incrementShares(post.id);
        }
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            blog?.deletePost(post.id);
        }
    };

    const handlePin = () => {
        blog?.togglePinPost(post.id);
    };

    return (
        <article id={`post-${post.id}`} className="relative glass-card p-6 md:p-8 rounded-2xl animate-fade-in">
            {isOwner && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button onClick={handlePin} title={post.isPinned ? "Unpin Post" : "Pin Post"} className="p-2 rounded-full bg-black/30 hover:bg-white/10 transition-colors">
                        <PinIcon className={`h-5 w-5 ${post.isPinned ? 'text-yellow-400 fill-yellow-400/50' : 'text-gray-400 hover:text-yellow-300'}`} />
                    </button>
                    <button onClick={handleDelete} title="Delete Post" className="p-2 rounded-full bg-black/30 hover:bg-white/10 transition-colors">
                        <TrashIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                    </button>
                </div>
            )}
            <header className="flex items-center gap-3 mb-4">
                {post.userProfilePictureUrl ? (
                    <img src={post.userProfilePictureUrl} alt={`${post.userName}'s profile`} className="w-12 h-12 rounded-full object-cover border-2 border-brand-primary" />
                ) : (
                    <div className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center font-bold text-white text-xl">
                        {post.userName.charAt(0).toUpperCase()}
                    </div>
                )}
                
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">{post.userName}</h3>
                        <BlogUserBadge badge={post.userBadge} />
                        {post.isPinned && <span title="Pinned Post"><PinIcon className="h-4 w-4 text-yellow-400" /></span>}
                    </div>
                    <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
                </div>
            </header>

            {isOwner && post.status === 'pending' && (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2 text-sm text-yellow-300">
                    <WarningIcon className="h-5 w-5" />
                    <span>This post is pending approval and is only visible to you.</span>
                </div>
            )}
            
            <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-pre:bg-black/30 prose-pre:text-gray-300">
                <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
                
                {post.imageUrls && post.imageUrls.length > 0 && (
                    <div className={`my-4 grid gap-2 ${post.imageUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {post.imageUrls.map((url, index) => (
                             <img key={index} src={url} alt={`${post.title} - Image ${index + 1}`} className="w-full h-auto max-h-96 object-cover rounded-lg" />
                        ))}
                    </div>
                )}

                {post.audioUrl && (
                    <div className="my-4">
                        <audio controls src={post.audioUrl} className="w-full">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            <footer className="mt-6 pt-4 border-t border-white/20 flex items-center gap-6 text-gray-400">
                <button onClick={handleLike} className={`flex items-center gap-2 hover:text-white transition-colors ${isLiked ? 'text-red-500' : ''}`}>
                    <HeartIcon className={`h-6 w-6 ${isLiked ? 'fill-current' : 'fill-none'}`} />
                    <span className="text-sm font-semibold">{post.likes.length}</span>
                </button>
                <button onClick={handleCommentClick} className="flex items-center gap-2 hover:text-white transition-colors">
                    <ChatBubbleIcon className="h-6 w-6" />
                    <span className="text-sm font-semibold">{post.comments.length}</span>
                </button>
                 <button onClick={handleShare} className="flex items-center gap-2 hover:text-white transition-colors">
                    <ShareIcon className="h-6 w-6" />
                    <span className="text-sm font-semibold">{post.shares}</span>
                </button>
            </footer>

            {showComments && <BlogCommentSection postId={post.id} comments={post.comments} />}
        </article>
    );
};

export default BlogPostItem;