import { FC, useState, ChangeEvent, useEffect } from "react";

interface ImageUploaderProps {
    existingFile: File | null;
    onImageSelect: (file: File) => void;
    onImageDelete: () => void;
}

const ImageUploader: FC<ImageUploaderProps> = ({ existingFile, onImageSelect, onImageDelete }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (existingFile) {
            const url = URL.createObjectURL(existingFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [existingFile]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            onImageSelect(file);
        }
    };

    return (
        <div className="mb-2">
            {!existingFile ? (
                <input type="file" accept="image/*" onChange={handleChange} />
            ) : (
                <div>
                    <img src={previewUrl || ""} alt="Preview" className="max-w-full max-h-60 mb-2 rounded" />
                    <button
                        type="button"
                        onClick={onImageDelete}
                        className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400"
                    >
                        ❌ Remove Image
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
