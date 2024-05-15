import { Switch as SwitchDumb } from '@components/shadcn/Switch';

import * as U from '@utils';
import { Field, FieldProps, useDataForm } from './';

export interface DataFormSwitchProps extends Omit<FieldProps, 'children'> {
  onLabel: string;
  offLabel: string;
}

export const Switch = ({
  label,
  onLabel,
  offLabel,
  dataKey,
  description,
}: DataFormSwitchProps) => {
  const { body, setBodyProp, isDisabled, isSkeleton } = useDataForm();

  return (
    <Field label={label} dataKey={dataKey} description={description}>
      <div
        className={U.cn(
          'align-center flex gap-2 rounded-md border px-4 py-2 text-sm',
        )}
      >
        <SwitchDumb
          checked={body[dataKey]}
          onCheckedChange={(val) => setBodyProp(dataKey, val)}
          isSkeleton={isSkeleton}
          disabled={isDisabled}
        />
        <span>
          {body[dataKey] !== undefined && (body[dataKey] ? onLabel : offLabel)}
        </span>
      </div>
    </Field>
  );
};

Switch.displayName = 'DataFormSwitch';
