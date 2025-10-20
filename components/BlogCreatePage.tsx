
import React from 'react';
// FIX: Changed single quotes to double quotes for the import.
import { Link } from "react-router-dom";
import BlogCreatePost from './BlogCreatePost';

const BlogCreatePage: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4 animate-aurora">Share Your Story</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Create a new post to share with the QuickLink community.
                </p>
                 <Link to="/blog" className="text-brand-primary hover:underline mt-4 inline-block">&larr; Back to Blog</Link>
            </div>
            <BlogCreatePost />
        </div>
    );
};

export default BlogCreatePage;