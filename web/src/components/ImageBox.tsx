import { useDeleteImageM, useUploadImageM } from '@data/image/mutations';
import React, { ComponentType, useEffect, useRef, useState } from 'react';
import { Vehicle } from '@data/vehicle/types';
import { IconButton } from '@components/shadcn/Button';
import { ImageUpIcon, Trash2Icon } from 'lucide-react';
import Spinner from '@components/Spinner';
import { useImageEditContext } from '../root/Portal/PortalMobileInventory/ImageEditContext';

export interface ImageBoxProps {
  // The key of the field being updated (e.g. "imageURL")
  dataKey: string;
  // A unique key for overlay control (e.g. vehicle.id)
  overlayKey: string;
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
  overlayKey,
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

  const { activeKey, setActiveKey } = useImageEditContext();
  const showOptions = activeKey === overlayKey;

  // Use a ref to keep track of the active key without reattaching the listener.
  const activeKeyRef = useRef(activeKey);
  useEffect(() => {
    activeKeyRef.current = activeKey;
  }, [activeKey]);

  // Attach mousedown listener once.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (activeKeyRef.current === overlayKey) {
          setActiveKey(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [overlayKey, setActiveKey]);

  // Deletes the image: calls the delete mutation, clears the value,
  // and updates the backend.
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!value || deleteImageM.isPending) {
      setActiveKey(null); // Closes the options on delete if there is no image.
      return;
    }

    deleteImageM
      .mutateAsync({ imageURL: value })
      .then(() => onBackendUpdate({ [dataKey]: null }))
      .then(() => {
        onChange(null);
        setActiveKey(null);
      })
      .catch((error) => {
        console.error('Image deletion failed:', error);
      });
  };

  // Uploads an image: when a file is chosen, uploads it, then updates local state
  // and calls the backend update.
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || uploadImageM.isPending) return;

    uploadImageM
      .mutateAsync({ file })
      .then((imageURL) =>
        onBackendUpdate({ [dataKey]: imageURL }).then(() => imageURL),
      )
      .then((imageURL) => {
        onChange(imageURL);
        setActiveKey(null);
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
    // Toggle this ImageBox as active.
    setActiveKey(activeKey === overlayKey ? null : overlayKey);
  };

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <div
        className="relative flex h-full w-full items-center justify-center
          overflow-hidden rounded-xl border bg-gray-100 hover:cursor-pointer"
        onClick={handleContainerClick}
      >
        {uploadImageM.isPending ? (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full
              bg-gray-200 p-2"
          >
            <Spinner className="h-5 w-5 flex-shrink-0 " visible />
          </div>
        ) : (
          <>
            {value && !imageError ? (
              <img
                src={value}
                alt="Uploaded"
                className="relative aspect-video w-full object-cover"
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
          </>
        )}
      </div>

      {showOptions && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          onClick={() => setActiveKey(null)}
        >
          <div
            className="flex w-full max-w-md items-center justify-center
              space-x-2 p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              variant="mobileDestructive"
              size="default"
              icon={ImageUpIcon}
              onClick={handleUploadClick}
            />
            <IconButton
              variant="mobileDestructive"
              icon={Trash2Icon}
              onClick={handleDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};
