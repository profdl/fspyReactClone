import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useStore } from '../store/useStore';

export const ImageUploader: React.FC = () => {
  const setImageUrl = useStore((state) => state.setImageUrl);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setImageUrl(url);
      }
    },
    [setImageUrl]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setImageUrl(url);
      }
    },
    [setImageUrl]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer hover:border-blue-500 transition-colors"
    >
      <Upload className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-gray-600 mb-2">Drag and drop an image here</p>
      <p className="text-gray-400 text-sm mb-4">or</p>
      <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
        Browse Files
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileInput}
        />
      </label>
    </div>
  );
};