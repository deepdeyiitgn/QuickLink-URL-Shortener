import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
// FIX: Corrected import path for types
import type { BlogPost, Comment, BlogContextType as IBlogContextType, AuthContextType } from '../types';
// FIX: Corrected import path for AuthContext
import { AuthContext } from './AuthContext';

const blogApi = {
    getPosts: async (userId?: string): Promise<BlogPost[]> => {
        const res = await fetch(`/api/blog?userId=${userId || ''}`);
        if (!res.ok) return [];
        return res.json();
    },
    createPost: async (post: Omit<BlogPost, 'id' | 'createdAt' | 'status'>): Promise<BlogPost> => {
        const res = await fetch('/api/blog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post),
        });
        if (!res.ok) throw new Error('Failed to create post');
        return res.json();
    },
    updatePost: async (update: any): Promise<BlogPost> => {
         const res = await fetch('/api/blog', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to update post');
        }
        return res.json();
    },
    deletePost: async (postId: string, userId: string): Promise<void> => {
        const res = await fetch('/api/blog', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, userId }),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to delete post');
        }
    }
};


export const BlogContext = createContext<IBlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    // FIX: Cast context to the correct type to resolve property errors
    const auth = useContext(AuthContext) as AuthContextType;

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedPosts = await blogApi.getPosts(auth?.currentUser?.id);
            setPosts(fetchedPosts);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    }, [auth?.currentUser?.id]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const addPost = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'isPinned' | 'status' | 'userProfilePictureUrl' | 'views'>) => {
        const newPostData: Omit<BlogPost, 'id' | 'createdAt' | 'status'> = {
            ...postData,
            likes: [],
            comments: [],
            shares: 0,
            isPinned: false,
            views: 0,
        };
        await blogApi.createPost(newPostData);
        await fetchPosts();
    };
    
    const toggleLike = async (postId: string) => {
        if (!auth?.currentUser) return;
        const updatedPost = await blogApi.updatePost({ postId, action: 'toggle_like', userId: auth.currentUser.id });
        setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
    };
    
    const addComment = async (postId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
        const updatedPost = await blogApi.updatePost({ postId, action: 'add_comment', comment: commentData, userId: auth?.currentUser?.id });
        setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
    };

    const incrementShares = async (postId: string) => {
        const updatedPost = await blogApi.updatePost({ postId, action: 'increment_share' });
        setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
    };
    
    const incrementView = async (postId: string) => {
        // Optimistically update UI
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, views: (p.views || 0) + 1 } : p));
        // Then send request to server
        try {
            await blogApi.updatePost({ postId, action: 'increment_view' });
        } catch (error) {
            // If it fails, log the error. The UI will be corrected on the next full fetch.
            console.error("Failed to increment view count on server:", error);
        }
    };

    const deletePost = async (postId: string) => {
        if (!auth?.currentUser) return;
        try {
            await blogApi.deletePost(postId, auth.currentUser.id);
            setPosts(prev => prev.filter(p => p.id !== postId));
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };
    
    const togglePinPost = async (postId: string) => {
        if (!auth?.currentUser?.isAdmin) return;
        try {
            await blogApi.updatePost({ postId, action: 'toggle_pin', userId: auth.currentUser.id });
            await fetchPosts();
        } catch (error) {
            console.error("Failed to pin post:", error);
        }
    };

    const approvePost = async (postId: string) => {
        if (!auth?.currentUser?.isAdmin && !auth?.currentUser?.canModerate) return;
        try {
            const updatedPost = await blogApi.updatePost({ postId, action: 'approve_post', userId: auth.currentUser.id });
            setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
        } catch (error) {
            console.error("Failed to approve post:", error);
        }
    };

    const value: IBlogContextType = {
        posts,
        loading,
        addPost,
        toggleLike,
        addComment,
        incrementShares,
        incrementView,
        deletePost,
        togglePinPost,
        approvePost,
    };

    return (
        <BlogContext.Provider value={value}>
            {children}
        </BlogContext.Provider>
    );
};