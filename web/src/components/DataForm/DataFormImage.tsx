import { Field, FieldProps, Mode, useDataForm } from './';
import { TrashIcon } from '@radix-ui/react-icons';
import { useDeleteVehicleImageM } from '@data/vehicle/mutations';

export interface ImageProps extends Omit<FieldProps, 'children'> {
  disableImageUpload?: string;
}

export const Image = ({ dataKey, label, disableImageUpload }: ImageProps) => {
  const { body, setBodyProp, mode } = useDataForm();
  const deleteImageM = useDeleteVehicleImageM();

  const handleDelete = () => {
    setBodyProp(dataKey, '');
    if (body[dataKey]) {
      deleteImageM.mutate(body[dataKey]);
    }
  };

  return (
    <Field label={label} dataKey={dataKey}>
      <div
        className="relative flex h-[300px] w-full max-w-[300px] flex-col
          items-center justify-center gap-2 overflow-hidden rounded-lg border"
      >
        {disableImageUpload && !body[dataKey] && (
          <p
            className="flex h-full w-full items-center justify-center
              text-center text-gray-500"
          >
            {disableImageUpload}
          </p>
        )}
        {body[dataKey] && mode === Mode.READ && (
          <div className="relative h-full w-full">
            <img
              src={body[dataKey]}
              alt="Uploaded"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {body[dataKey] && mode === Mode.EDIT && (
          <div className="relative h-full w-full">
            <div
              className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer
                items-center justify-center bg-pink-600"
              onClick={handleDelete}
            >
              <TrashIcon className="h-6 w-6 text-white" />
            </div>
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
