import React, { ComponentType } from 'react';

export interface ImageBoxProps {
  imageURL: string;
  icon?: ComponentType<{ className?: string }>;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function ImageBox({
  imageURL,
  icon: Icon,
  onClick,
}: ImageBoxProps) {
  return (
    <div className="flex w-full flex-col pb-3">
      <div
        className="relative flex aspect-video w-full items-center justify-center
          rounded-xl bg-gray-100 sm:max-w-2xl"
        onClick={onClick}
      >
        {imageURL ? (
          <img
            src={imageURL}
            alt={undefined}
            draggable={false}
            className="absolute inset-0 h-full w-full rounded-xl object-cover"
          />
        ) : (
          Icon && <Icon className="h-16 w-16 text-gray-400" />
        )}
      </div>
    </div>
  );
}
