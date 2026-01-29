import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import axios from 'axios';

const ImageUpload = ({ onUpload, label = "Upload Image" }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setError('');
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        // Assuming your backend handles signature, or simpler unsigned preset:
        // Using direct unsigned upload for simplicity in this demo. 
        // Best practice: Signed uploads via backend.

        try {
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                formData
            );

            setUploading(false);
            if (onUpload) {
                onUpload(res.data.secure_url);
            }
        } catch (err) {
            console.error('Upload Error:', err);
            setError('Failed to upload image. Please try again.');
            setUploading(false);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles: 1
    });

    const removeImage = (e) => {
        e.stopPropagation();
        setPreview('');
        if (onUpload) onUpload('');
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${isDragActive ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-purple-500/50 hover:bg-white/5'
                    }`}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <div className="relative group">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-lg object-contain"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FiX />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-purple-400">
                            {uploading ? (
                                <div className="loading-spinner w-6 h-6 border-2" />
                            ) : (
                                <FiUploadCloud className="text-2xl" />
                            )}
                        </div>
                        <div className="text-sm text-gray-400">
                            {uploading ? (
                                <span>Uploading...</span>
                            ) : (
                                <>
                                    <span className="text-purple-400 font-medium">Click to upload</span> or drag and drop
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default ImageUpload;
