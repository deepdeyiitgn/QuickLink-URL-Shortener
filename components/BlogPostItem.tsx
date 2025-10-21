
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost, AuthContextType } from '../types';
import { AuthContext } from '../contexts/AuthContext';
import { BlogContext } from '../contexts/BlogContext';
import { timeAgo } from '../utils/time';
import { HeartIcon, ChatBubbleIcon, ShareIcon, PinIcon, CheckIcon, TrashIcon } from './icons/IconComponents';
import BlogUserBadge from './BlogUserBadge';
import BlogCommentSection from './BlogCommentSection';

interface BlogPostItemProps {
    post: BlogPost;
}

const BlogPostItem: React.FC<BlogPostItemProps> = ({ post }) => {
    const auth = useContext(AuthContext) as AuthContextType;
    const blog = useContext(BlogContext);
    const { currentUser } = auth || {};

    const isLiked = currentUser && post.likes.includes(currentUser.id);
    const isOwner = currentUser && (currentUser.id === post.userId || currentUser.isAdmin || currentUser.canModerate);

    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in" id={`post-${post.id}`}>
            {post.isPinned && <div className="flex items-center gap-2 text-xs font-semibold text-yellow-400 mb-3"><PinIcon className="h-4 w-4" /> PINNED POST</div>}
            
            <div className="flex items-center gap-3 mb-4">
                {post.userProfilePictureUrl ? (
                    <img src={post.userProfilePictureUrl} alt={post.userName} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                    <div className="h-10 w-10 bg-brand-secondary rounded-full flex items-center justify-center font-bold text-white">
                        {post.userName.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{post.userName}</span>
                        <BlogUserBadge badge={post.userBadge} />
                    </div>
                    <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
                </div>
            </div>

            <Link to={`/blog/post/${post.id}`}><h2 className="text-3xl font-bold text-white hover:text-brand-primary transition-colors">{post.title}</h2></Link>

            <div className="mt-4 prose prose-invert prose-p:text-gray-300 prose-pre:bg-black/30 prose-pre:text-gray-300 max-w-none">
                {post.postType === 'html' ? (
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                    <pre className="whitespace-pre-wrap font-sans">{post.content}</pre>
                )}
            </div>
            
            {post.imageUrls && post.imageUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {post.imageUrls.map((url, idx) => <img key={idx} src={url} alt={`Post image ${idx+1}`} className="rounded-lg w-full object-cover" />)}
                </div>
            )}
            
            {post.audioUrl && <audio src={post.audioUrl} controls className="mt-4 w-full" />}
            
            <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-gray-400">
                <div className="flex items-center gap-4">
                    <button onClick={() => blog?.toggleLike(post.id)} disabled={!currentUser} className={`flex items-center gap-1.5 hover:text-pink-500 disabled:opacity-50 ${isLiked ? 'text-pink-500' : ''}`}>
                        <HeartIcon className="h-5 w-5" />
                        <span className="text-sm">{post.likes.length}</span>
                    </button>
                    <div className="flex items-center gap-1.5">
                        <ChatBubbleIcon className="h-5 w-5" />
                        <span className="text-sm">{post.comments.length}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {currentUser && (currentUser.isAdmin || currentUser.canModerate) && post.status === 'pending' && (
                        <button onClick={() => blog?.approvePost(post.id)} className="p-1.5 hover:bg-green-500/20 rounded-full text-green-400"><CheckIcon className="h-4 w-4" /></button>
                    )}
                    {currentUser?.isAdmin && (
                        <button onClick={() => blog?.togglePinPost(post.id)} className="p-1.5 hover:bg-yellow-500/20 rounded-full text-yellow-400"><PinIcon className="h-4 w-4" /></button>
                    )}
                    {isOwner && (
                        <button onClick={() => window.confirm('Are you sure?') && blog?.deletePost(post.id)} className="p-1.5 hover:bg-red-500/20 rounded-full text-red-400"><TrashIcon className="h-4 w-4" /></button>
                    )}
                    <button onClick={() => blog?.incrementShares(post.id)} className="p-1.5 hover:bg-white/20 rounded-full"><ShareIcon className="h-5 w-5" /></button>
                </div>
            </div>
            
            <BlogCommentSection postId={post.id} comments={post.comments} />
        </div>
    );
};

export default BlogPostItem;