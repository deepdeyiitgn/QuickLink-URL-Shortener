import React, { useState, useRef } from 'react';
import Cropper from 'react-easy-crop';

// Helper: get cropped image blob from an image source and crop pixels (react-easy-crop output)
async function getCroppedImg(imageSrc: string, pixelCrop: any, outputType = 'image/jpeg') {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), outputType, 0.92);
  });
}

// Upload direct to ImageKit (client-side)
async function uploadToImageKit(blob: Blob, fileName: string, folder = '/blog') {
  const PUBLIC_KEY = (process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY || process.env.VITE_IMAGEKIT_PUBLIC_KEY || process.env.IMAGEKIT_PUBLIC_KEY);
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

export default function BlogCreatePostMinimal({ addPost }: any) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const MAX_FILES = 2;
  const MAX_SIZE = 5 * 1024 * 1024;

  const handleImageFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (images.length + files.length > MAX_FILES) {
      setError('You can upload a maximum of 2 images.');
      return;
    }

    const uploadedUrls: string[] = [];
    try {
      setIsLoading(true);
      setError(null);
      for (const f of Array.from(files)) {
        const file = f as File;
        if (!file.type.startsWith('image/')) {
          setError('Only image files allowed');
          continue;
        }
        if (file.size > MAX_SIZE) {
          setError('Each file must be 5MB or smaller.');
          continue;
        }

        // optional: allow free cropping modal in future. For now, upload the original (or resize if big)
        // We'll create an object URL and upload the original blob directly
        const blob = file;
        const tempUrl = URL.createObjectURL(blob);
        // show temporary preview
        setImages(prev => [...prev, tempUrl]);

        // upload
        const result = await uploadToImageKit(blob, `blog_${Date.now()}_${file.name}`, '/blog');
        const url = result?.url || (result?.response && result.response.url) || null;
        if (url) {
          uploadedUrls.push(url);
        } else {
          setError('Upload failed: no URL returned');
        }
        // revoke tempUrl: we'll replace with server url later
      }

      // replace last temp previews with actual urls by mapping length
      setImages(prev => {
        // prev contains old images plus temp previews; we want to replace the last uploadedUrls.length items with uploadedUrls
        const keep = prev.slice(0, Math.max(0, prev.length - uploadedUrls.length));
        return [...keep, ...uploadedUrls];
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Upload failed');
    } finally {
      setIsLoading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content required');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // send to existing backend blog POST which expects image urls in images field or similar
      const postData: any = {
        title: title,
        content: content,
        images: images, // URLs
      };
      if (addPost) {
        await addPost(postData);
      } else {
        // fallback: call /api/blog directly
        const res = await fetch('/api/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(postData) });
        if (!res.ok) throw new Error('Failed to create post');
      }
      setTitle('');
      setContent('');
      setImages([]);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-2xl mb-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" className="w-full rounded-md p-2" />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" className="w-full rounded-md p-2" rows={6} />

        <div className="flex items-center gap-4">
          <input ref={imageInputRef} type="file" accept="image/*" multiple onChange={handleImageFiles} className="hidden" id="blog-images" />
          <label htmlFor="blog-images" className="px-4 py-2 bg-white/10 rounded-md cursor-pointer">Upload Image(s)</label>
          <span className="text-sm text-gray-300">{images.length}/{MAX_FILES}</span>
        </div>

        {images.length > 0 && (
          <div className="flex gap-4 flex-wrap mt-4">
            {images.map((src, idx) => (
              <div key={idx} className="w-24 h-24 bg-gray-800 rounded overflow-hidden">
                <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {error && <div className="text-sm text-red-400">{error}</div>}
        <div className="flex gap-4">
          <button type="submit" className="px-4 py-2 bg-brand-primary rounded text-white" disabled={isLoading}>{isLoading ? 'Posting...' : 'Create Post'}</button>
        </div>
      </form>
    </div>
  );
}


export default BlogCreatePost;
