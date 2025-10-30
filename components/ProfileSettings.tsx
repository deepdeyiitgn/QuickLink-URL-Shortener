import React, { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';

// Helper: create a square center-cropped blob from a File
async function getSquareCroppedBlob(file: File, outputSize = 800): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const min = Math.min(img.naturalWidth, img.naturalHeight);
        const sx = Math.round((img.naturalWidth - min) / 2);
        const sy = Math.round((img.naturalHeight - min) / 2);
        const canvas = document.createElement('canvas');
        const size = outputSize;
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

// Upload direct to ImageKit (client-side, using public key)
// It posts FormData to ImageKit's upload API and returns the JSON response.
async function uploadToImageKit(blob: Blob, fileName: string, folder = '/profiles') {
  // Read public key from common env names (adjust depending on your build tool)
  const PUBLIC_KEY = (process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY || process.env.VITE_IMAGEKIT_PUBLIC_KEY || process.env.IMAGEKIT_PUBLIC_KEY);
  const urlEndpoint = (process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT || process.env.VITE_IMAGEKIT_URL_ENDPOINT || process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/lfgkhrnab');
  if (!PUBLIC_KEY) {
    throw new Error('ImageKit public key missing in env');
  }

  const form = new FormData();
  form.append('file', blob);
  form.append('fileName', fileName);
  form.append('folder', folder);
  form.append('publicKey', PUBLIC_KEY);

  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: form
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error('ImageKit upload failed: ' + text);
  }
  return res.json();
}

export default function ProfileSettingsMinimal({ currentUser, updateUserProfile }: any) {
  const [profilePicture, setProfilePicture] = useState<string | null>(currentUser?.profilePictureUrl ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    const MAX = 5 * 1024 * 1024;
    if (file.size > MAX) {
      setError('Profile image must be 5MB or smaller.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      // Create square center-cropped blob (mandatory 1:1 circle for profile)
      const cropped = await getSquareCroppedBlob(file, 800);
      const tempUrl = URL.createObjectURL(cropped);
      setProfilePicture(tempUrl); // show preview immediately

      // Upload directly to ImageKit
      const uploadResult = await uploadToImageKit(cropped, `profile_${Date.now()}_${file.name}`, '/profiles');
      const imageUrl = uploadResult?.url || (uploadResult?.response && uploadResult.response.url) || null;
      if (!imageUrl) {
        setError('Upload succeeded but no URL returned.');
        return;
      }

      // Inform parent / backend to store URL
      if (updateUserProfile) {
        await updateUserProfile({ profilePictureUrl: imageUrl });
      }
      setProfilePicture(imageUrl);
      // revoke temp if needed handled by browser eventually
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Upload failed');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-2xl">
      <h2 className="text-3xl font-bold text-white mb-6">Profile Settings</h2>
      <div className="flex items-center gap-4">
        <div className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-200 border-2 border-white/20">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
          )}
        </div>
        <div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="profile-upload" />
          <label htmlFor="profile-upload" className="inline-block cursor-pointer px-4 py-2 bg-white/10 rounded-md">Change Photo</label>
          {isLoading && <div className="text-sm mt-2">Uploading...</div>}
          {error && <div className="text-sm text-red-400 mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;
