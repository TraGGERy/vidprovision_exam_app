'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface QuestionImageProps {
  imageUrl: string;
  alt: string;
}

const QuestionImage = ({ imageUrl, alt }: QuestionImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset zoom state when image changes
  useEffect(() => {
    setIsZoomed(false);
  }, [imageUrl]);

  // If no image URL or there was an error loading the image, show a placeholder
  if (!imageUrl || imageError) {
    return (
      <div className="mb-4 sm:mb-6 flex justify-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 sm:p-6 flex items-center justify-center w-full max-w-md h-40 sm:h-48 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out">
          <div className="text-gray-500 dark:text-gray-400 text-center">
            <svg className="w-10 h-10 mx-auto mb-2 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-medium">Image not available</p>
            {imageError && imageUrl && (
              <p className="text-xs sm:text-sm mt-2 opacity-75">Could not load image</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 sm:mb-6 flex justify-center">
      <div 
        className={`relative max-w-md w-full transition-all duration-300 ease-in-out ${isZoomed ? 'z-10' : ''}`}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          </div>
        )}
        <div 
          className={`overflow-hidden rounded-2xl transition-all duration-300 ease-in-out ${isZoomed ? 'fixed inset-4 sm:inset-10 md:inset-20 bg-black/90 flex items-center justify-center z-50' : 'relative shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700'}`}
        >
          <Image
            src={`/${imageUrl}`}
            alt={alt}
            width={1200}
            height={900}
            priority
            className={`w-full h-auto transition-all duration-300 ease-in-out ${isZoomed ? 'max-h-full object-contain p-4' : 'max-h-64 sm:max-h-80 object-contain'} ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              console.error(`Failed to load image: ${imageUrl}`);
              setImageError(true);
              setImageLoading(false);
            }}
          />
          {isZoomed && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/80 text-white hover:bg-gray-700/80 transition-colors"
              aria-label="Close fullscreen image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {!imageLoading && !isZoomed && (
          <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-gray-800/60 text-white text-xs hidden sm:block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionImage;