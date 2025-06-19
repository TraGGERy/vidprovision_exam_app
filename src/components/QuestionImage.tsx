'use client';

import { useState } from 'react';
import Image from 'next/image';

interface QuestionImageProps {
  imageUrl: string;
  alt: string;
}

const QuestionImage = ({ imageUrl, alt }: QuestionImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // If no image URL or there was an error loading the image, show a placeholder
  if (!imageUrl || imageError) {
    return (
      <div className="mb-4 flex justify-center">
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center w-full max-w-md h-48">
          <div className="text-gray-500 text-center">
            <p className="font-medium">Image not available</p>
            {imageError && imageUrl && (
              <p className="text-sm mt-2">Could not load: {imageUrl}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 flex justify-center">
      <div className="relative max-w-md w-full">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <img
          src={`/${imageUrl}`}
          alt={alt}
          className="rounded-lg shadow-md w-full h-auto max-h-64 object-contain"
          onLoad={() => setImageLoading(false)}
          onError={() => {
            console.error(`Failed to load image: ${imageUrl}`);
            setImageError(true);
            setImageLoading(false);
          }}
        />
      </div>
    </div>
  );
};

export default QuestionImage;