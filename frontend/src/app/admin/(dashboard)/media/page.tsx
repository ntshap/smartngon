"use client";

import { useState, useCallback } from "react";
import { uploadImage } from "@/lib/admin-queries";
import {
    Upload,
    Image as ImageIcon,
    Copy,
    Check,
    X,
    Loader2
} from "lucide-react";

interface UploadedImage {
    url: string;
    name: string;
    uploadedAt: Date;
}

export default function MediaAdminPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleUpload(files[0]);
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleUpload(files[0]);
        }
    };

    const handleUpload = async (file: File) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Hanya file gambar yang diperbolehkan");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Ukuran file maksimal 5MB");
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            const url = await uploadImage(file, "assets", "admin-uploads");

            if (url) {
                setUploadedImages((prev) => [
                    { url, name: file.name, uploadedAt: new Date() },
                    ...prev,
                ]);
            } else {
                setError("Gagal mengupload gambar");
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError("Terjadi kesalahan saat upload");
        }

        setIsUploading(false);
    };

    const handleCopy = async (url: string) => {
        await navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    const handleRemove = (url: string) => {
        setUploadedImages((prev) => prev.filter((img) => img.url !== url));
    };

    return (
        <div className="space-y-6 pt-12 lg:pt-0">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Media Library</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Upload dan kelola gambar untuk website
                </p>
            </div>

            {/* Upload Area */}
            <div
                className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors ${dragActive
                        ? "border-lime-500 bg-lime-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    disabled={isUploading}
                />

                <div className="flex flex-col items-center">
                    {isUploading ? (
                        <>
                            <Loader2 className="h-10 w-10 animate-spin text-lime-500" />
                            <p className="mt-3 text-sm font-medium text-slate-900">
                                Mengupload gambar...
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-50">
                                <Upload className="h-6 w-6 text-lime-600" />
                            </div>
                            <p className="mt-3 text-sm font-medium text-slate-900">
                                Drag & drop gambar di sini
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                atau klik untuk memilih file (maks. 5MB)
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    <X className="h-4 w-4" />
                    {error}
                </div>
            )}

            {/* Uploaded Images */}
            {uploadedImages.length > 0 && (
                <div>
                    <h2 className="mb-4 text-sm font-medium text-slate-900">
                        Gambar yang Diupload ({uploadedImages.length})
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {uploadedImages.map((image) => (
                            <div
                                key={image.url}
                                className="group overflow-hidden rounded-xl border border-slate-200 bg-white"
                            >
                                <div className="relative aspect-video overflow-hidden bg-slate-100">
                                    <img
                                        src={image.url}
                                        alt={image.name}
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        onClick={() => handleRemove(image.url)}
                                        className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                                <div className="p-3">
                                    <p className="truncate text-sm font-medium text-slate-900">
                                        {image.name}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={image.url}
                                            readOnly
                                            className="flex-1 truncate rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-600"
                                        />
                                        <button
                                            onClick={() => handleCopy(image.url)}
                                            className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${copiedUrl === image.url
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                }`}
                                        >
                                            {copiedUrl === image.url ? (
                                                <>
                                                    <Check className="h-3 w-3" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3 w-3" />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {uploadedImages.length === 0 && !isUploading && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-12">
                    <ImageIcon className="h-10 w-10 text-slate-300" />
                    <p className="mt-3 text-sm text-slate-500">
                        Belum ada gambar yang diupload
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        Upload gambar untuk mendapatkan URL yang bisa digunakan di konten
                    </p>
                </div>
            )}

            {/* Tips */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-medium text-slate-900">Tips Penggunaan</h3>
                <ul className="mt-2 space-y-1 text-xs text-slate-600">
                    <li>• Setelah upload, klik &quot;Copy&quot; untuk menyalin URL gambar</li>
                    <li>• Paste URL tersebut ke form yang membutuhkan gambar</li>
                    <li>• Format yang didukung: JPG, PNG, GIF, WebP</li>
                    <li>• Gambar disimpan di Supabase Storage</li>
                </ul>
            </div>
        </div>
    );
}
