import { Field, FieldProps, useDataForm } from './';
import { useState } from 'react';
import { Button } from '@components/shadcn/Button';
import { TrashIcon } from '@radix-ui/react-icons';

export interface ImageProps extends Omit<FieldProps, 'children'> {
  disableImageUpload?: string;
}

export const Image = ({ dataKey, label, disableImageUpload }: ImageProps) => {
  const { body, setBodyProp } = useDataForm();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setBodyProp(dataKey, '');
    setIsDeleting(true);
  };

  return (
    <Field label={label} dataKey={dataKey}>
      <div className="w-62 flex h-72 flex-col gap-2">
        <Button onClick={handleDelete} className="h-12 w-12">
          <TrashIcon />
          {/*remove this later*/}
          {isDeleting}
        </Button>
        {disableImageUpload ? (
          <p className="text-gray-500">{disableImageUpload}</p>
        ) : body[dataKey] ? (
          <div className="w-62 flex h-64 flex-col gap-2">
            <img
              src={body[dataKey]}
              alt="Uploaded"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          !disableImageUpload && <Button>UPLOAD IMAGE</Button>
        )}
      </div>
    </Field>
  );
};
Image.displayName = 'DataFormImage';
