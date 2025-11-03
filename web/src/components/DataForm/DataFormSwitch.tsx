import { Switch as SwitchDumb } from '@components/shadcn/Switch';

import * as C from '@utils/common';
import { Field, FieldProps, useDataForm } from './';

export interface DataFormSwitchProps extends Omit<FieldProps, 'children'> {
  onLabel: string;
  offLabel: string;
  disabled?: boolean;
}

export const Switch = ({
  label,
  onLabel,
  offLabel,
  dataKey,
  description,
  disabled,
}: DataFormSwitchProps) => {
  const { getBodyProp, setBodyProp, isDisabled, isLoading } = useDataForm();

  return (
    <Field label={label} dataKey={dataKey} description={description}>
      <div
        className={C.cn(
          'align-center flex gap-2 rounded-md border px-4 py-2 text-sm',
        )}
      >
        <SwitchDumb
          checked={getBodyProp(dataKey)}
          onCheckedChange={(val) => setBodyProp(dataKey, val)}
          isSkeleton={isLoading}
          disabled={isDisabled || disabled}
        />
        <span>
          {getBodyProp(dataKey) !== undefined &&
            (getBodyProp(dataKey) ? onLabel : offLabel)}
        </span>
      </div>
    </Field>
  );
};

Switch.displayName = 'DataFormSwitch';
