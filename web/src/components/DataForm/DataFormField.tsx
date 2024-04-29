import { ReactNode } from 'react';

import { useDataForm } from './';
import { Label } from '@components/shadcn/Label';

export interface FieldProps {
  label: string;
  description?: string;
  dataKey: string;
  children: ReactNode;
}

export const Field = ({
  dataKey,
  label,
  description,
  children,
}: FieldProps) => {
  const { fieldErrorMap } = useDataForm();

  return (
    <div className="flex flex-col space-y-2">
      <Label className="px-2" htmlFor={dataKey}>
        {label}
      </Label>
      {children}
      {description && (
        <p className="text-muted-foreground px-2 text-[0.8rem]">
          {description}
        </p>
      )}
      {fieldErrorMap[dataKey] && (
        <div
          className="bg-destructive-fill text-destructive-foreground rounded-md
            px-4 py-2 text-sm"
        >
          {fieldErrorMap[dataKey]}
        </div>
      )}
    </div>
  );
};

Field.displayName = 'DataFormField';
