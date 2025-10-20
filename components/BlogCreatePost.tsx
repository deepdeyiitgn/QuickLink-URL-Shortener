import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: Corrected import path for AuthContext
import { AuthContext } from '../contexts/AuthContext';
import { BlogContext } from '../contexts/BlogContext';
import { LoadingIcon, UploadIcon, MicrophoneIcon, XIcon } from './icons/IconComponents';
// FIX: Corrected import path for types
import type { User, UserBadge, AuthContextType } from '../types';
import { getUserBadge } from '../utils/userHelper';

type PostType = 'normal' | 'html';

const BlogCreatePost: React.FC = () => {
    // FIX: Cast context to the correct type to resolve property errors
    const auth = useContext(AuthContext) as AuthContextType;
    const blog = useContext(BlogContext);
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [alias, setAlias] = useState('');
    const [content, setContent] = useState('');
    const [postType, setPostType] = useState<PostType>('normal');
    const [images, setImages] = useState<string[]>([]);
    const [audio, setAudio] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            if (images.length + files.length > 2) {
                setError("You can upload a maximum of 2 images.");
                return;
            }
            setAudio(null);
            if (audioInputRef.current) audioInputRef.current.value = '';

            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImages(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };
    
    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImages([]);
            if (imageInputRef.current) imageInputRef.current.value = '';
            const reader = new FileReader();
            reader.onloadend = () => {
                setAudio(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
        if (imageInputRef.current) imageInputRef.current.value = '';
    };
    
    const insertTag = (tag: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);
        const newText = `${content.substring(0, start)}<${tag}>${selectedText}</${tag}>${content.substring(end)}`;
        
        setContent(newText);
        textarea.focus();
        setTimeout(() => textarea.setSelectionRange(start + tag.length + 2, end + tag.length + 2), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth?.currentUser || !blog) return;

        if (!title.trim() || !content.trim()) {
            setError('Title and content are required.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await blog.addPost({
                userId: auth.currentUser.id,
                userName: auth.currentUser.name,
                userBadge: getUserBadge(auth.currentUser),
                title,
                content,
                postType,
                imageUrls: images,
                audioUrl: audio,
                alias: alias.trim() ? alias.trim() : undefined,
            });
            navigate('/blog');
        } catch (err: any) {
            setError(err.message || 'Failed to create post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAlias = e.target.value
          .toLowerCase()
          .replace(/\s+/g, '-') // Replace spaces with -
          .replace(/[^a-z0-9-]/g, ''); // Remove all non-alphanumeric characters except hyphens
        setAlias(newAlias);
    };

    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl mb-8 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Create a New Post</h2>
                
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post Title"
                    className="block w-full rounded-md border-0 bg-black/30 py-2.5 px-3 text-brand-light shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-lg"
                    required
                />
                
                <div>
                    <label htmlFor="alias" className="block text-sm font-medium text-gray-300 mb-1">Custom URL Alias (Optional)</label>
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-white/20 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-primary sm:text-sm bg-black/30">
                        <span className="flex select-none items-center pl-3 text-gray-500 whitespace-nowrap">{`${window.location.origin}/blog/post/`}</span>
                        <input 
                            type="text" 
                            id="alias" 
                            value={alias} 
                            onChange={handleAliasChange} 
                            placeholder="my-awesome-post" 
                            className="block flex-1 border-0 bg-transparent py-2.5 pl-1 text-brand-light placeholder:text-gray-500 focus:ring-0" 
                        />
                    </div>
                </div>


                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-300">Post Type:</span>
                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" name="postType" value="normal" checked={postType === 'normal'} onChange={() => setPostType('normal')} className="text-brand-primary focus:ring-brand-primary bg-black/30 border-white/30" />
                            <span className="text-sm">Normal</span>
                        </label>
                         <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" name="postType" value="html" checked={postType === 'html'} onChange={() => setPostType('html')} className="text-brand-primary focus:ring-brand-primary bg-black/30 border-white/30" />
                            <span className="text-sm">HTML</span>
                        </label>
                    </div>
                </div>
                
                <div className={`${postType === 'normal' ? 'flex' : 'hidden'} p-2 bg-black/30 rounded-t-md border-b border-white/20 items-center gap-2`}>
                    <button type="button" onClick={() => insertTag('b')} className="px-3 py-1 text-sm bg-white/10 rounded font-bold hover:bg-white/20">B</button>
                    <button type="button" onClick={() => insertTag('i')} className="px-3 py-1 text-sm bg-white/10 rounded italic hover:bg-white/20">I</button>
                    <button type="button" onClick={() => insertTag('pre')} className="px-3 py-1 text-sm bg-white/10 rounded font-mono hover:bg-white/20">&lt;/&gt;</button>
                </div>
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={postType === 'html' ? "Enter your full HTML code here..." : "Share your thoughts..."}
                    rows={6}
                    className={`block w-full border-0 bg-black/30 py-2.5 px-3 text-brand-light shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm resize-y ${postType === 'normal' ? 'rounded-b-md' : 'rounded-md'}`}
                    required
                />

                <div className="grid sm:grid-cols-2 gap-4">
                     <label htmlFor="image-upload" className={`cursor-pointer w-full text-center px-4 py-3 text-sm font-semibold text-gray-300 bg-white/10 rounded-md hover:bg-white/20 transition-colors flex items-center justify-center gap-2 ${audio || images.length >= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <UploadIcon className="h-5 w-5"/>
                        {images.length > 0 ? `Add another Image (${images.length}/2)` : 'Upload Image(s)'}
                    </label>
                    <input ref={imageInputRef} id="image-upload" type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={!!audio || images.length >= 2} />

                    <label htmlFor="audio-upload" className={`cursor-pointer w-full text-center px-4 py-3 text-sm font-semibold text-gray-300 bg-white/10 rounded-md hover:bg-white/20 transition-colors flex items-center justify-center gap-2 ${images.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <MicrophoneIcon className="h-5 w-5"/>
                        {audio ? 'Change Audio' : 'Upload Audio'}
                    </label>
                    <input ref={audioInputRef} id="audio-upload" type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" disabled={images.length > 0} />
                </div>
                
                {images.length > 0 && (
                     <div className="flex items-center gap-4 flex-wrap">
                         {images.map((imgSrc, index) => (
                             <div key={index} className="relative">
                                <img src={imgSrc} alt={`Preview ${index + 1}`} className="h-20 w-20 object-cover rounded-md" />
                                <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                                    <XIcon className="h-4 w-4" />
                                </button>
                             </div>
                         ))}
                     </div>
                )}
                 {audio && (
                     <div className="flex items-center gap-2">
                         <audio src={audio} controls className="h-10" />
                         <button type="button" onClick={() => {setAudio(null); if (audioInputRef.current) audioInputRef.current.value = '';}} className="text-xs text-red-400 hover:underline">Remove Audio</button>
                     </div>
                )}


                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_15px_rgba(0,229,255,0.5)] hover:bg-brand-primary/80 disabled:opacity-50 transition-all">
                    {isLoading ? <LoadingIcon className="animate-spin h-5 w-5" /> : 'Submit Post'}
                </button>
            </form>
        </div>
    );
};

export default BlogCreatePost;