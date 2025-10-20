import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
// FIX: Corrected import path for types
import type { BlogPost, Comment, BlogContextType as IBlogContextType, AuthContextType } from '../types';
// FIX: Corrected import path for AuthContext
import { AuthContext } from './AuthContext';
import { api } from '../api';


export const BlogContext = createContext<IBlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    // FIX: Cast context to the correct type to resolve property errors
    const auth = useContext(AuthContext) as AuthContextType;

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedPosts = await api.getPosts(auth?.currentUser?.id);
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
        await api.createPost(newPostData);
        await fetchPosts();
    };
    
    const toggleLike = async (postId: string) => {
        if (!auth?.currentUser) return;
        const updatedPost = await api.updatePost({ postId, action: 'toggle_like', userId: auth.currentUser.id });
        setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
    };
    
    const addComment = async (postId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
        const updatedPost = await api.updatePost({ postId, action: 'add_comment', comment: commentData, userId: auth?.currentUser?.id });
        setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
    };

    const incrementShares = async (postId: string) => {
        const updatedPost = await api.updatePost({ postId, action: 'increment_share' });
        setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
    };
    
    const incrementView = async (postId: string) => {
        // Optimistically update UI
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, views: (p.views || 0) + 1 } : p));
        // Then send request to server
        try {
            await api.updatePost({ postId, action: 'increment_view' });
        } catch (error) {
            // If it fails, log the error. The UI will be corrected on the next full fetch.
            console.error("Failed to increment view count on server:", error);
        }
    };

    const deletePost = async (postId: string) => {
        if (!auth?.currentUser) return;
        try {
            await api.deletePost(postId, auth.currentUser.id);
            setPosts(prev => prev.filter(p => p.id !== postId));
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };
    
    const togglePinPost = async (postId: string) => {
        if (!auth?.currentUser?.isAdmin) return;
        try {
            await api.updatePost({ postId, action: 'toggle_pin', userId: auth.currentUser.id });
            await fetchPosts();
        } catch (error) {
            console.error("Failed to pin post:", error);
        }
    };

    const approvePost = async (postId: string) => {
        if (!auth?.currentUser?.isAdmin && !auth?.currentUser?.canModerate) return;
        try {
            const updatedPost = await api.updatePost({ postId, action: 'approve_post', userId: auth.currentUser.id });
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