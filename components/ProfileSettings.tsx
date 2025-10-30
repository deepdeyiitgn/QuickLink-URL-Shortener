
import React, { useState, useContext, useRef } from 'react';
// FIX: Corrected import path for AuthContext
import { AuthContext } from '../contexts/AuthContext';
import { LoadingIcon, UploadIcon, CheckIcon } from './icons/IconComponents';
import { AuthContextType } from '../types';

// Helper: create a square center-cropped blob from a File
async function getSquareCroppedBlob(file: File, outputSize?: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            try {
                const min = Math.min(img.naturalWidth, img.naturalHeight);
                const sx = Math.round((img.naturalWidth - min) / 2);
                const sy = Math.round((img.naturalHeight - min) / 2);
                const canvas = document.createElement('canvas');
                const size = outputSize ?? min;
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('Canvas not supported');
                ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
                canvas.toBlob((blob) => {
                    URL.revokeObjectURL(url);
                    if (!blob) reject(new Error('Could not create blob'));
                    else resolve(blob);
                }, 'image/jpeg', 0.92);
            } catch (err) {
                URL.revokeObjectURL(url);
                reject(err);
            }
        };
        img.onerror = (e) => {
            URL.revokeObjectURL(url);
            reject(new Error('Image load error'));
        };
        img.src = url;
    });
}

const ProfileSettings: React.FC = () => {
    // FIX: Cast context to the correct type to resolve property errors
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser, updateUserProfile } = auth || {};
    
    const [name, setName] = useState(currentUser?.name ?? '');
    const [profilePicture, setProfilePicture] = useState<string | null>(currentUser?.profilePictureUrl ?? null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!currentUser) return null;
    
    const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const MAX_SIZE = 5 * 1024 * 1024;
            if (file.size > MAX_SIZE) { setError('Profile picture must be 5MB or smaller.'); return; }

            try {
                setIsLoading(true);
                setError('');
                // Create square center-cropped blob before upload
                // eslint-disable-next-line no-undef
                const blob = await getSquareCroppedBlob(file, 800);
                const form = new FormData();
                form.append('file', blob, file.name);

                // show temporary preview
                const tempUrl = URL.createObjectURL(blob);
                setProfilePicture(tempUrl);

                const res = await fetch('/api/upload/profile', { method: 'POST', body: form });
                const data = await res.json();
                if (!res.ok) { setError(data?.error || 'Upload failed'); URL.revokeObjectURL(tempUrl); return; }

                const imgObj = data.image || (data.images && data.images[0]) || null;
                const url = imgObj ? (imgObj.url || imgObj.filePath || imgObj.fileUrl || imgObj.name || imgObj.file) : null;
                if (url) { setProfilePicture(url); URL.revokeObjectURL(tempUrl); }
                else { setError('Upload succeeded but no URL returned.'); URL.revokeObjectURL(tempUrl); }
            } catch (err: any) {
                console.error('Profile upload error:', err);
                setError(err?.message || 'Upload failed');
            } finally { setIsLoading(false); }
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!updateUserProfile) return;
        
        setIsLoading(true);
        setIsSuccess(false);
        setError('');

        try {
            await updateUserProfile({
                name: name,
                profilePictureUrl: profilePicture || undefined
            });
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
        } catch (err: any) {
            console.error("Profile update failed:", err);
            setError(err.message || "Failed to update profile. The image might be too large.");
        } finally {
            setIsLoading(false);
        }
    };

    const hasChanges = name !== (currentUser.name ?? '') || profilePicture !== (currentUser.profilePictureUrl ?? null);

    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">Profile Settings</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6 items-start">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center gap-4">
                    {profilePicture ? (
                        <img src={profilePicture} alt="Profile Preview" className="h-32 w-32 rounded-full object-cover border-2 border-brand-primary" />
                    ) : (
                        <div className="h-32 w-32 rounded-full bg-brand-secondary flex items-center justify-center text-5xl font-bold text-white">
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm bg-white/10 rounded-md hover:bg-white/20">
                        <UploadIcon className="h-4 w-4" />
                        Change Picture
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handlePictureUpload} accept="image/*" className="hidden" />
                </div>
                
                {/* Name and Save Section */}
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <label htmlFor="profileName" className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                        <input
                            id="profileName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full rounded-md border-0 bg-black/30 py-2 px-3 text-brand-light shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="profileEmail" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            id="profileEmail"
                            type="email"
                            value={currentUser.email}
                            disabled
                            className="block w-full rounded-md border-0 bg-black/50 py-2 px-3 text-gray-400 shadow-sm ring-1 ring-inset ring-white/10"
                        />
                    </div>
                     <button type="submit" disabled={isLoading || !hasChanges} className="w-full sm:w-auto flex justify-center items-center gap-2 rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_15px_rgba(0,229,255,0.5)] hover:bg-brand-primary/80 disabled:opacity-50 transition-all">
                        {isLoading ? <LoadingIcon className="animate-spin h-5 w-5" /> : (isSuccess ? <CheckIcon className="h-5 w-5" /> : 'Save Changes')}
                    </button>
                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;
