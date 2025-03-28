import { Field, FieldProps, Mode, useDataForm } from './';
import { useUploadImageM } from '@data/image/mutations';
import React, { useEffect, useRef, useState } from 'react';
import Error from '@components/Error';
import Spinner from '@components/Spinner';
import { ImageUpIcon, Trash2Icon } from 'lucide-react';
import { endpoints } from '@data/api';
import { IconButton } from '@components/shadcn/Button';
import { createErrorToast } from '../../root/Portal/toast';
import { useToast } from '@components/shadcn/use-toast';

export interface ImageProps extends Omit<FieldProps, 'children'> {
  disableImageUpload?: string;
}

export const Image = ({ dataKey, label, disableImageUpload }: ImageProps) => {
  const { body, setBodyProp, mode, registerManualIssue } = useDataForm();
  const uploadImageM = useUploadImageM();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);

  const handleDelete = () => {
    setBodyProp('tempDeleteImageURL', body[dataKey]);
    setBodyProp(dataKey, null);
  };

  const handleImageUpload = async (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.DragEvent<HTMLDivElement>,
  ) => {
    const file =
      'files' in event.target
        ? event.target.files?.[0]
        : (event as React.DragEvent<HTMLDivElement>).dataTransfer.files[0];

    if (!file) return;

    registerManualIssue('image', 'Cannot save while image is uploading.');

    uploadImageM
      .mutateAsync({ file })
      .then((imageURL) => {
        setBodyProp(dataKey, imageURL);
      })
      .catch(() => {
        toast(
          createErrorToast({
            verbLabel: 'Upload',
            dataLabel: 'Image',
          }),
        );
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEvent = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDropEvent = async (event: React.DragEvent<HTMLDivElement>) => {
    handleDragEvent(event);
    await handleImageUpload(event);
  };

  return (
    <Field label={label} dataKey={dataKey}>
      <div
        className={`relative flex h-[200px] max-w-[500px] flex-col items-center
        justify-center gap-2 overflow-hidden rounded-lg border ${
          !body[dataKey] ? 'border-dashed bg-gray-100' : ''
        }`}
      >
        {mode === Mode.EDIT && body[dataKey] && (
          <IconButton
            variant="destructive"
            className="absolute right-2 top-2 z-10"
            icon={Trash2Icon}
            onClick={handleDelete}
          />
        )}
        {uploadImageM.isPending ? (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full
              bg-gray-200 p-2"
          >
            <Spinner className="h-5 w-5 flex-shrink-0 " visible />
          </div>
        ) : (
          <>
            {!disableImageUpload && mode === Mode.EDIT && body[dataKey] && (
              <>
                <IconButton
                  variant="outline"
                  className="absolute right-12 top-2 z-10"
                  icon={ImageUpIcon}
                  onClick={handleUploadClick}
                />
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
            {body[dataKey] ? (
              <div
                className="relative flex h-full w-full items-center
                  justify-center bg-gray-100"
              >
                {!imageError ? (
                  <img
                    src={body[dataKey]}
                    alt="Uploaded"
                    className="h-full w-full object-cover"
                    onError={handleError}
                  />
                ) : (
                  <Error
                    error={{ error: 'NOT_FOUND', endpoint: endpoints.image }}
                  />
                )}
              </div>
            ) : disableImageUpload ? (
              <p
                className="absolute flex h-full w-full items-center
                  justify-center text-center text-sm text-gray-500"
              >
                {disableImageUpload}
              </p>
            ) : (
              !disableImageUpload &&
              mode === Mode.EDIT && (
                <div
                  className="relative flex h-full w-full flex-col items-center
                    justify-center text-center"
                  onDragOver={handleDragEvent}
                  onDragEnter={handleDragEvent}
                  onDragLeave={handleDragEvent}
                  onDrop={handleDropEvent}
                >
                  <input
                    type="file"
                    id={`file-upload-${dataKey}`}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div
                    className="flex h-8 w-8 items-center justify-center
                      rounded-full bg-gray-200 p-2"
                  >
                    <ImageUpIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-500">Drag images here, or</p>
                  <label
                    htmlFor={`file-upload-${dataKey}`}
                    className="cursor-pointer text-sm font-bold text-pink-600
                      transition-opacity hover:opacity-60"
                  >
                    browse
                  </label>
                </div>
              )
            )}
          </>
        )}
      </div>
    </Field>
  );
};

Image.displayName = 'DataFormImage';
