import * as U from '@utils';
import { Input as InputDumb } from '@components/shadcn/Input';

import { Field, FieldProps, useDataForm } from './';

export interface InputProps extends Omit<FieldProps, 'children'> {
  placeholder: string;
  type?: string;
  min?: number;
  max?: number;
}

export const Input = ({
  label,
  type = 'text',
  min,
  max,
  dataKey,
  placeholder,
  description,
}: InputProps) => {
  const { body, setBodyProp, isDisabled, isSkeleton } = useDataForm();

  return (
    <Field label={label} dataKey={dataKey} description={description}>
      <InputDumb
        type={type}
        min={min}
        max={max}
        id={dataKey}
        disabled={isDisabled}
        placeholder={placeholder}
        value={isSkeleton ? '' : body[dataKey] ?? ''}
        onChange={({ target: { value } }) => {
          if (body[dataKey] !== value) {
            setBodyProp(dataKey, type === 'number' ? Number(value) : value);
          }
        }}
        className={U.cn(
          'bg-background h-8',
          isDisabled && '!cursor-default !opacity-75',
        )}
      />
    </Field>
  );
};

Input.displayName = 'DataFormInput';
