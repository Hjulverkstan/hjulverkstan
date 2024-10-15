import * as U from '@utils';
import { Input as InputDumb } from '@components/shadcn/Input';

import { Field, FieldProps, useDataForm } from './';

export interface InputProps extends Omit<FieldProps, 'children'> {
  placeholder: string;
  type?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export const Input = ({
  label,
  type = 'text',
  min,
  max,
  dataKey,
  placeholder,
  description,
  disabled,
}: InputProps) => {
  const { body, setBodyProp, isDisabled } = useDataForm();

  const formIsDisabled = isDisabled || disabled;

  return (
    <Field label={label} dataKey={dataKey} description={description}>
      <InputDumb
        type={type}
        min={min}
        max={max}
        id={dataKey}
        disabled={formIsDisabled}
        placeholder={placeholder}
        value={body[dataKey]}
        onChange={({ target: { value } }) => {
          if (body[dataKey] !== value) {
            setBodyProp(dataKey, type === 'number' ? Number(value) : value);
          }
        }}
        className={U.cn(
          'bg-background h-8',
          formIsDisabled && '!cursor-default !opacity-75',
        )}
      />
    </Field>
  );
};

Input.displayName = 'DataFormInput';
