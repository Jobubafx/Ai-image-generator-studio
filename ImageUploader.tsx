import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';
import { SourceImage } from '../types';

interface ImageUploaderProps {
  onImageUpload: (image: SourceImage) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const fileToSourceImage = (file: File): Promise<SourceImage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          const base64 = event.target.result.split(',')[1];
          resolve({ base64, mimeType: file.type, name: file.name });
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFile = useCallback(async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      try {
        const sourceImage = await fileToSourceImage(file);
        onImageUpload(sourceImage);
      } catch (error) {
        console.error("Error processing file:", error);
        alert("There was an error processing your image. Please try again.");
      }
    } else {
      alert("Please upload a valid image file.");
    }
  }, [onImageUpload]);

  // Fix: Corrected DragEvent handler type from HTMLDivElement to HTMLLabelElement.
  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  // Fix: Corrected DragEvent handler type from HTMLDivElement to HTMLLabelElement.
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // Fix: Corrected DragEvent handler type from HTMLDivElement to HTMLLabelElement.
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [handleFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-white mb-2">Upload Your Image</h2>
      <p className="text-gray-400 mb-8">Start by uploading a photo to transform.</p>
      
      <label
        htmlFor="file-upload"
        className={`relative block w-full rounded-lg border-2 border-dashed p-12 text-center transition-colors duration-300 ${isDragging ? 'border-purple-500 bg-gray-800' : 'border-gray-600 hover:border-purple-400'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center text-gray-400">
          <UploadIcon className="w-12 h-12 mb-4" />
          <span className="block text-xl font-semibold text-white">Drag & drop an image here</span>
          <span className="mt-2">or</span>
          <span className="mt-2 font-medium text-purple-400 cursor-pointer">browse to upload</span>
        </div>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default ImageUploader;
