import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BlogContext } from '../contexts/BlogContext';
import { AuthContext } from '../contexts/AuthContext';
import { LoadingIcon } from './icons/IconComponents';
import BlogCreatePost from './BlogCreatePost';
import BlogPostItem from './BlogPostItem';
import AboutBlog from './AboutBlog';
import HowToUseBlog from './HowToUseBlog';
import AdComponent from './AdComponent'; // Import AdComponent

const BlogPage: React.FC = () => {
    const blog = useContext(BlogContext);
    const auth = useContext(AuthContext);

    const AD_INTERVAL = 3; // Show an ad every 3 posts

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4 animate-aurora">Community Blog</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Updates, stories, and insights from the QuickLink community.
                </p>
            </div>
            
            {auth?.currentUser && (
                <div className="max-w-4xl mx-auto">
                    <Link to="/blog/create" className="text-brand-primary font-semibold hover:underline">
                        + Create a New Post
                    </Link>
                </div>
            )}
            
            <div className="max-w-4xl mx-auto space-y-8">
                {blog?.loading ? (
                    <div className="text-center py-20">
                        <LoadingIcon className="h-10 w-10 animate-spin text-brand-primary mx-auto" />
                    </div>
                ) : blog && blog.posts.length > 0 ? (
                    blog.posts.map((post, index) => (
                        <React.Fragment key={post.id}>
                            <BlogPostItem post={post} />
                            {(index + 1) % AD_INTERVAL === 0 && (
                                <div className="my-8">
                                    <AdComponent type="in-feed" />
                                </div>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <div className="text-center py-20 glass-card rounded-2xl">
                        <h2 className="text-xl font-semibold text-white">No Posts Yet</h2>
                        <p className="text-gray-500 mt-2">Be the first to share something with the community!</p>
                    </div>
                )}
            </div>

            <div className="mt-16 grid gap-12 md:grid-cols-2 max-w-4xl mx-auto">
                <AboutBlog />
                <HowToUseBlog />
            </div>
        </div>
    );
};

export default BlogPage;
