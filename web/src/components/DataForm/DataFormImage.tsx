import { Field, FieldProps, useDataForm } from './';
import { Button } from '@components/shadcn/Button';
import { TrashIcon } from '@radix-ui/react-icons';

export interface ImageProps extends Omit<FieldProps, 'children'> {
  disableImageUpload?: boolean;
}

export const Image = ({ dataKey, label, disableImageUpload }: ImageProps) => {
  const { body, setBodyProp } = useDataForm();

  const handleDelete = () => {
    setBodyProp(dataKey, '');
  };

  return (
    <Field label={label} dataKey={dataKey}>
      <div
        className="relative flex h-[300px] w-full max-w-[300px] flex-col
          items-center justify-center gap-2 overflow-hidden rounded-lg border"
      >
        {disableImageUpload && (
          <p className="text-gray-500">
            Open on a mobile device to upload images
          </p>
        )}
        {body[dataKey] && (
          <div className="relative h-full w-full">
            <Button onClick={handleDelete} className="right-2 top-2 h-12 w-12">
              <TrashIcon />
            </Button>
            <img
              src={body[dataKey]}
              alt="Uploaded"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </Field>
  );
};

Image.displayName = 'DataFormImage';
