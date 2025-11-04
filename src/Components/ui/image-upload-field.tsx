'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Button } from './button';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageData {
    url: string;
    alt: string;
    isPrimary: boolean;
    file?: File; // Optional file for local preview
}

interface ImageUploadFieldProps {
    value: ImageData[];
    onChange: (images: ImageData[]) => void;
}

export function ImageUploadField({ value, onChange }: ImageUploadFieldProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const createPreviewUrls = useCallback((files: File[]) => {
        const newImages = files.map((file, index) => ({
            url: URL.createObjectURL(file),
            alt: `Image ${value.length + index + 1}`,
            isPrimary: value.length === 0 && index === 0,
            file: file // Store the file for later upload
        }));

        onChange([...value, ...newImages]);
        toast.success(`${files.length} image${files.length > 1 ? 's' : ''} selected for upload`);
    }, [value, onChange]);

    const handleFileSelect = useCallback((files: File[]) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length !== files.length) {
            toast.error('Only image files are allowed');
        }
        if (imageFiles.length > 0) {
            createPreviewUrls(imageFiles);
        }
    }, [createPreviewUrls]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        handleFileSelect(files);
    }, [handleFileSelect]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        handleFileSelect(files);
        // Reset input
        e.target.value = '';
    }, [handleFileSelect]);

    const removeImage = useCallback((index: number) => {
        const newImages = value.filter((_, i) => i !== index);
        // If we removed the primary image, make the first remaining image primary
        if (value[index].isPrimary && newImages.length > 0) {
            newImages[0].isPrimary = true;
        }
        onChange(newImages);
    }, [value, onChange]);

    const setPrimaryImage = useCallback((index: number) => {
        const newImages = value.map((img, i) => ({
            ...img,
            isPrimary: i === index
        }));
        onChange(newImages);
    }, [value, onChange]);

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <Upload className={`w-12 h-12 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-900">
                            {isDragOver ? 'Drop images here' : 'Drag & drop images here'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            or{' '}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-blue-600 hover:text-blue-500 font-medium"
                            >
                                browse files
                            </button>
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Image Preview Grid */}
            {value.length > 0 && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Uploaded Images</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {value.map((image, index) => (
                            <div key={index} className="relative group border rounded-lg overflow-hidden bg-white">
                                <div className="aspect-video bg-gray-100 relative">
                                    <img
                                        src={image.url}
                                        alt={image.alt}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                        }}
                                    />
                                    {image.isPrimary && (
                                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                            Primary
                                        </div>
                                    )}
                                </div>

                                {/* Overlay with controls */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="flex gap-2">
                                        {!image.isPrimary && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => setPrimaryImage(index)}
                                                className="text-xs"
                                            >
                                                Set Primary
                                            </Button>
                                        )}
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => removeImage(index)}
                                            className="text-xs"
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Remove upload progress indicator since we're not uploading immediately */}
        </div>
    );
}