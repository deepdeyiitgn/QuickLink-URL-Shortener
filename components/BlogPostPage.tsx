import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlogContext } from '../contexts/BlogContext';
// FIX: Corrected import path for AuthContext
import { AuthContext } from '../contexts/AuthContext';
import { LoadingIcon } from './icons/IconComponents';
import BlogPostItem from './BlogPostItem';
import NotFoundPage from './NotFoundPage';

interface BlogPostPageProps {
    postId: string;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ postId }) => {
    const blog = useContext(BlogContext);
    
    // Set up view tracking for the post
    useEffect(() => {
        if (postId && blog?.incrementView) {
            const viewedKey = `viewed-${postId}`;
            // Only count the view if it hasn't been counted in this session
            if (!sessionStorage.getItem(viewedKey)) {
                blog.incrementView(postId);
                sessionStorage.setItem(viewedKey, 'true');
            }
        }
    }, [postId, blog]);

    const post = blog?.posts.find(p => p.id === postId);

    // Set document title for SEO
    useEffect(() => {
        if (post) {
            document.title = `${post.title} | QuickLink Blog`;
        }
        // Cleanup function to reset title when component unmounts
        return () => {
            document.title = 'Top URL Shortener, QR Generator & Scanner API | Free Blog for JEE 2027 Prep by Deep Dey - QuickLink';
        };
    }, [post]);

    if (blog?.loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <LoadingIcon className="h-12 w-12 animate-spin text-brand-primary" />
            </div>
        );
    }
    
    if (!post) {
        return <NotFoundPage />;
    }

    return (
        <div className="max-w-4xl mx-auto">
             <Link to="/blog" className="text-brand-primary hover:underline mb-8 inline-block">&larr; Back to Blog</Link>
            <BlogPostItem post={post} />
        </div>
    );
};

export default BlogPostPage;