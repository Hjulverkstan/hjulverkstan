import React, { ComponentType, forwardRef } from 'react';

export interface ImageCardProps {
  imageURL: string;
  onClick: () => void;
  icon?: ComponentType<{ className?: string }>;
}

export const ImageCard = forwardRef<HTMLDivElement, ImageCardProps>(
  ({ imageURL, onClick, icon: Icon }, ref) => {
    return (
      <div
        onClick={onClick}
        ref={ref}
        className="relative flex h-full w-full items-center justify-center
          overflow-hidden rounded-xl border bg-gray-100 hover:cursor-pointer"
      >
        {imageURL && imageURL.length > 10 ? (
          <img
            src={imageURL}
            className="relative aspect-video w-full object-cover"
          />
        ) : Icon ? (
          <Icon className="h-16 w-16 text-gray-400" />
        ) : (
          <div className="text-gray-400">No Image</div>
        )}
      </div>
    );
  },
);
