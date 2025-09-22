
import React from 'react';
import { GeneratedImage } from '../types';
import { DownloadIcon } from './icons';

interface GalleryProps {
  images: GeneratedImage[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  if (images.length === 0) {
    return null;
  }

  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `ai-generated-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full mt-16">
      <h2 className="text-3xl font-bold text-white text-center mb-8">Your Creations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.id} className="group relative rounded-lg overflow-hidden shadow-lg shadow-purple-900/20">
            <img src={image.src} alt={image.prompt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col items-center justify-center p-4">
              <p className="text-white text-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-4">{image.prompt}</p>
              <button
                onClick={() => handleDownload(image)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90 hover:bg-purple-500"
              >
                <DownloadIcon className="w-5 h-5" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
