import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
// FIX: Corrected import path for types
import { BlogPost, AuthContextType } from '../types';
// FIX: Corrected import path for AuthContext
import { AuthContext } from '../contexts/AuthContext';
import { BlogContext } from '../contexts/BlogContext';
import { HeartIcon, ChatBubbleIcon, ShareIcon, PinIcon, TrashIcon, WarningIcon, EyeIcon } from './icons/IconComponents';
import BlogUserBadge from './BlogUserBadge';
import BlogCommentSection from './BlogCommentSection';
import { timeAgo } from '../utils/time';
import { getUserBadge } from '../utils/userHelper';

interface BlogPostProps {
    post: BlogPost;
}

const BlogPostItem: React.FC<BlogPostProps> = ({ post }) => {
    // FIX: Cast context to the correct type to resolve property errors
    const auth = useContext(AuthContext) as AuthContextType;
    const blog = useContext(BlogContext);
    const [showComments, setShowComments] = useState(false);

    const author = auth?.users.find(u => u.id === post.userId);
    const authorName = author?.name || post.userName;
    const authorProfilePic = author?.profilePictureUrl || post.userProfilePictureUrl;
    const authorBadge = getUserBadge(author || null);

    const isLiked = auth?.currentUser && post.likes.includes(auth.currentUser.id);
    const isOwner = auth?.currentUser?.isAdmin;
    const isModerator = auth?.currentUser?.canModerate;
    const isAuthor = auth?.currentUser?.id === post.userId;

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
        const postUrl = `${window.location.origin}/blog/post/${post.alias || post.id}`;
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: `Check out this post on QuickLink: "${post.title}"`,
                url: postUrl,
            }).then(() => {
                blog?.incrementShares(post.id);
            });
        } else {
            // Fallback for desktop
            navigator.clipboard.writeText(postUrl);
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

    // Determine if the current user can delete this post
    const canDelete = isOwner || isModerator || (isAuthor && post.status === 'pending');
    
    // Check if the current view is the individual post page
    const isIndividualPostPage = window.location.pathname.endsWith(`/blog/post/${post.alias || post.id}`);

    return (
        <article id={`post-${post.id}`} className="relative glass-card p-6 md:p-8 rounded-2xl animate-fade-in">
            {(isOwner || canDelete) && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    {isOwner && (
                        <button onClick={handlePin} title={post.isPinned ? "Unpin Post" : "Pin Post"} className="p-2 rounded-full bg-black/30 hover:bg-white/10 transition-colors">
                            <PinIcon className={`h-5 w-5 ${post.isPinned ? 'text-yellow-400 fill-yellow-400/50' : 'text-gray-400 hover:text-yellow-300'}`} />
                        </button>
                    )}
                    {canDelete && (
                        <button onClick={handleDelete} title="Delete Post" className="p-2 rounded-full bg-black/30 hover:bg-white/10 transition-colors">
                            <TrashIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                        </button>
                    )}
                </div>
            )}
            <header className="flex items-center gap-3 mb-4">
                {authorProfilePic ? (
                    <img src={authorProfilePic} alt={`${authorName}'s profile`} className="w-12 h-12 rounded-full object-cover border-2 border-brand-primary" />
                ) : (
                    <div className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center font-bold text-white text-xl">
                        {authorName.charAt(0).toUpperCase()}
                    </div>
                )}
                
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">{authorName}</h3>
                        <BlogUserBadge badge={authorBadge} />
                        {post.isPinned && <span title="Pinned Post"><PinIcon className="h-4 w-4 text-yellow-400" /></span>}
                    </div>
                    <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
                </div>
            </header>

            {post.status === 'pending' && (isOwner || isModerator || isAuthor) && (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2 text-sm text-yellow-300">
                    <WarningIcon className="h-5 w-5" />
                    <span>This post is pending approval. {isAuthor ? 'You can see it, but it is not public yet.' : 'It is only visible to admins/moderators.'}</span>
                </div>
            )}
            
            <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-pre:bg-black/30 prose-pre:text-gray-300">
                <h2 className="text-3xl font-bold mb-4">
                    <Link to={`/blog/post/${post.alias || post.id}`} className="hover:text-brand-primary transition-colors">{post.title}</Link>
                </h2>
                
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
                
                {isIndividualPostPage ? (
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                    <>
                        <div dangerouslySetInnerHTML={{ __html: post.content.length > 300 ? `${post.content.substring(0, 300)}...` : post.content }} />
                        {post.content.length > 300 && <Link to={`/blog/post/${post.alias || post.id}`} className="text-brand-primary hover:underline">Read more</Link>}
                    </>
                )}
            </div>

            <footer className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-gray-400">
                <div className="flex items-center gap-4">
                    <button onClick={handleLike} className="flex items-center gap-1.5 hover:text-white transition-colors">
                        <HeartIcon className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-red-500' : ''}`} />
                        <span className="text-sm">{post.likes.length}</span>
                    </button>
                    <button onClick={handleCommentClick} className="flex items-center gap-1.5 hover:text-white transition-colors">
                        <ChatBubbleIcon className="h-5 w-5" />
                        <span className="text-sm">{post.comments.length}</span>
                    </button>
                    <div className="flex items-center gap-1.5">
                        <EyeIcon className="h-5 w-5" />
                        <span className="text-sm">{post.views || 0}</span>
                    </div>
                </div>
                <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <ShareIcon className="h-5 w-5" />
                    <span className="text-sm">{post.shares}</span>
                </button>
            </footer>

            {showComments && <BlogCommentSection postId={post.id} comments={post.comments} />}
        </article>
    );
};

export default BlogPostItem;