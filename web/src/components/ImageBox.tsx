import { useDeleteImageM, useUploadImageM } from '@data/image/mutations';
import React, { ComponentType, useEffect, useRef, useState } from 'react';
import { Vehicle } from '@data/vehicle/types';
import { IconButton } from '@components/shadcn/Button';
import { ImageUpIcon, Trash2Icon } from 'lucide-react';

export interface ImageBoxProps {
  // The key of the field being updated (e.g. "imageURL")
  dataKey: string;
  // The current image URL (or null if none)
  value: string | null;
  // Callback to update the image URL in local state
  onChange: (newValue: string | null) => void;
  // Function to update the vehicle on the backend.
  // It should accept a partial vehicle update and return a promise.
  onBackendUpdate: (updatedFields: Partial<Vehicle>) => Promise<Vehicle>;
  // Optional icon to display when there's no image.
  icon?: ComponentType<{ className?: string }>;
}

export const ImageBox = ({
  dataKey,
  value,
  onChange,
  onBackendUpdate,
  icon: Icon,
}: ImageBoxProps) => {
  const uploadImageM = useUploadImageM();
  const deleteImageM = useDeleteImageM();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Deletes the image: calls the delete mutation, clears the value,
  // and updates the backend.
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!value || deleteImageM.isPending) return;

    deleteImageM
      .mutateAsync({ imageURL: value })
      .then(() => {
        // Clear the local value
        onChange(null);
        // Update the backend with the new (null) value.
        return onBackendUpdate({ [dataKey]: null });
      })
      .catch((error) => {
        console.error('Image deletion failed:', error);
      });

    setShowOptions(false);
  };

  // Uploads an image: when a file is chosen, uploads it, then updates local state
  // and calls the backend update.
  const handleImageUpload = async (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.DragEvent<HTMLDivElement>,
  ) => {
    const file =
      'files' in event.target
        ? event.target.files?.[0]
        : (event as React.DragEvent<HTMLDivElement>).dataTransfer.files[0];

    if (!file || uploadImageM.isPending) return;

    uploadImageM
      .mutateAsync({ file })
      .then((imageURL) => {
        // Update local state with the new image URL.
        onChange(imageURL);
        // Update the backend.
        return onBackendUpdate({ [dataKey]: imageURL });
      })
      .catch((error) => {
        console.error('Image upload failed:', error);
      });
  };

  useEffect(() => {
    setImageError(false);
  }, [value]);

  const handleError = () => {
    setImageError(true);
  };

  // When the upload button is clicked, trigger the hidden file input.
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Toggling the overlay: clicking on the container shows (or hides) the options.
  const handleContainerClick = () => {
    if (!showOptions) {
      window.dispatchEvent(
        new CustomEvent('mobileImageEditOpen', { detail: dataKey }),
      );
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  // Listen for global events so that only one overlay is open at a time.
  useEffect(() => {
    const handleGlobalEditOpen = (event: CustomEvent) => {
      if (event.detail !== dataKey) {
        setShowOptions(false);
      }
    };
    window.addEventListener(
      'mobileImageEditOpen',
      handleGlobalEditOpen as EventListener,
    );
    return () => {
      window.removeEventListener(
        'mobileImageEditOpen',
        handleGlobalEditOpen as EventListener,
      );
    };
  }, [dataKey]);

  // Close the overlay if a click happens outside the container.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <div
        className="relative flex h-full w-full items-center justify-center
          overflow-hidden rounded-xl border bg-gray-100 hover:cursor-pointer"
        onClick={handleContainerClick}
      >
        {value && !imageError ? (
          <img
            src={value}
            alt="Uploaded"
            className="relative aspect-video w-full"
            onError={handleError}
          />
        ) : Icon ? (
          <Icon className="h-16 w-16 text-gray-400" />
        ) : (
          <div className="text-gray-400">No Image</div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          id={`file-upload-${dataKey}`}
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {showOptions && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          onClick={() => setShowOptions(false)}
        >
          <div
            className="flex w-full max-w-md space-x-2 p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              className="flex-1 border border-red-950 bg-red-600 p-2 text-center
                text-black"
              icon={ImageUpIcon}
              onClick={handleUploadClick}
            />
            <IconButton
              className="flex-1 border border-red-950 bg-red-600 p-2 text-center
                text-black"
              icon={Trash2Icon}
              onClick={handleDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};
