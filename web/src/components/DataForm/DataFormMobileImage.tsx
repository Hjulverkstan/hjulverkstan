import { Field, ImageProps, useDataForm } from './';
import { useDeleteImageM, useUploadImageM } from '@data/image/mutations';
import React, { ComponentType, useEffect, useRef, useState } from 'react';
import { ImageUpIcon, Trash2Icon } from 'lucide-react';
import { IconButton } from '@components/shadcn/Button';
import { useEditVehicleM } from '@data/vehicle/mutations';

import { Vehicle } from '@data/vehicle/types';

export interface MobileImageProps extends ImageProps {
  icon?: ComponentType<{ className?: string }>;
}

export const MobileImage = ({
  dataKey,
  label,
  icon: Icon,
}: MobileImageProps) => {
  const { body, setBodyProp, registerManualIssue } = useDataForm();
  const uploadImageM = useUploadImageM();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const editVehicleM = useEditVehicleM();
  const deleteImageM = useDeleteImageM();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    // If there’s no image or a deletion is already in progress, do nothing.
    if (!body[dataKey] || deleteImageM.isPending) return;

    deleteImageM
      .mutateAsync({ imageURL: body[dataKey] })
      .then(() => {
        // Store the current image URL as tempDeleteImageURL if needed
        setBodyProp('tempDeleteImageURL', body[dataKey]);
        // Remove the image from the form state
        setBodyProp(dataKey, null);
        // Update the backend: send the updated vehicle (with image removed)
        return editVehicleM.mutateAsync({
          ...body,
          [dataKey]: null,
        } as Vehicle);
      })
      .catch((error) => {
        console.error('Image deletion failed:', error);
        registerManualIssue('image', 'Image deletion failed.');
      })
      .finally(() => {
        registerManualIssue('image', null);
      });

    setShowOptions(false);
  };

  // Uploads images
  // Remains the same from DataFormImage.tsx
  const handleImageUpload = async (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.DragEvent<HTMLDivElement>,
  ) => {
    const file =
      'files' in event.target
        ? event.target.files?.[0]
        : (event as React.DragEvent<HTMLDivElement>).dataTransfer.files[0];

    if (!file || uploadImageM.isPending) {
      return;
    }

    registerManualIssue('image', 'Uploading image, please wait.');

    uploadImageM
      .mutateAsync({ file })
      .then((imageURL) => {
        setBodyProp(dataKey, imageURL);

        // Updates the vehicle directly in the backend.
        editVehicleM.mutateAsync({
          ...body,
          [dataKey]: imageURL,
        } as Vehicle);
      })
      .catch((error) => {
        console.error('Image upload failed:', error);
        registerManualIssue('image', 'Image upload failed.');
      })
      .finally(() => {
        registerManualIssue('image', null);
      });
  };

  useEffect(() => {
    setImageError(false);
  }, [body[dataKey]]);

  const handleError = () => {
    setImageError(true);
  };

  // Handles clicks for the upload button.
  const handleUploadClick = (/*e: React.MouseEvent<HTMLButtonElement>*/) => {
    // e.stopPropagation();
    fileInputRef.current?.click();
  };

  // Tapping the container toggles the overlay
  // If the overlay is already open, tapping anywhere in the container cancels edit mode.
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

  // Listen for global edit mode events so that only one overlay is open at a time.
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

  // Close the overlay if a click occurs outside the container.
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
    <Field label={label} dataKey={dataKey} hideLabel>
      <div ref={containerRef} className="relative h-full w-full">
        <div
          className="relative flex h-full w-full items-center justify-center
            overflow-hidden rounded-xl border bg-gray-100 hover:cursor-pointer"
          onClick={handleContainerClick}
        >
          {body[dataKey] && !imageError ? (
            <img
              src={body[dataKey]}
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

        {/* Overlay with two equally sized boxes centered horizontally */}
        {showOptions && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            onClick={() => setShowOptions(false)}
          >
            {/* Button group is wrapped in a div that stops propagation */}
            <div
              className="flex w-full max-w-md space-x-2 p-1"
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton
                className="flex-1 border border-red-950 bg-red-600 p-2
                  text-center text-black"
                icon={ImageUpIcon}
                onClick={handleUploadClick}
              />
              <IconButton
                className="flex-1 border border-red-950 bg-red-600 p-2
                  text-center text-black"
                icon={Trash2Icon}
                onClick={handleDelete}
              />
            </div>
          </div>
        )}
      </div>
    </Field>
  );
};

MobileImage.displayName = 'DataFormMobileImage';
