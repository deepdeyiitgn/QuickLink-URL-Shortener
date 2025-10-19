import React, { useContext, useState, useMemo } from 'react';
import { BlogContext } from '../contexts/BlogContext';
import { AuthContext } from '../contexts/AuthContext';
import { LoadingIcon } from './icons/IconComponents';
import BlogCreatePost from './BlogCreatePost';
import BlogPostItem from './BlogPostItem';
import AboutBlog from './AboutBlog';
import HowToUseBlog from './HowToUseBlog';

const BlogPage: React.FC = () => {
    const blog = useContext(BlogContext);
    const auth = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('newest');

    const filteredAndSortedPosts = useMemo(() => {
        if (!blog?.posts) return [];
        
        const filtered = blog.posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.userName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered.sort((a, b) => {
            switch (sortOption) {
                case 'oldest': return a.createdAt - b.createdAt;
                case 'likes': return b.likes.length - a.likes.length;
                case 'newest':
                default:
                    return b.createdAt - a.createdAt;
            }
        });
    }, [blog?.posts, searchTerm, sortOption]);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4 animate-aurora">QuickLink Blog</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    News, thoughts, and updates from our community. Share your story!
                </p>
            </div>

            {auth?.currentUser && <BlogCreatePost />}

            {/* Search and Sort Controls */}
            <div className="max-w-4xl mx-auto glass-card p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search by keyword or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full flex-grow rounded-md border-0 bg-black/30 py-2 px-3 text-brand-light shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm"
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label htmlFor="sort-posts" className="text-sm text-gray-400 whitespace-nowrap">Sort by:</label>
                    <select
                        id="sort-posts"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="block w-full rounded-md border-0 bg-black/30 py-2 pl-3 pr-8 text-brand-light shadow-sm ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="likes">Most Liked</option>
                    </select>
                </div>
            </div>


            {blog?.loading ? (
                <div className="flex justify-center items-center py-20">
                    <LoadingIcon className="h-12 w-12 animate-spin text-brand-primary" />
                </div>
            ) : filteredAndSortedPosts.length > 0 ? (
                <div className="space-y-8 max-w-4xl mx-auto">
                    {filteredAndSortedPosts.map(post => (
                        <BlogPostItem key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 glass-card rounded-2xl max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold text-white">No Posts Found</h2>
                    <p className="text-gray-400 mt-2">
                        {searchTerm ? "Try adjusting your search or sort criteria." : "Be the first one to share something with the community!"}
                    </p>
                </div>
            )}
            
            <div className="mt-16 grid gap-12 md:grid-cols-2">
                <AboutBlog />
                <HowToUseBlog />
            </div>
        </div>
    );
};

export default BlogPage;