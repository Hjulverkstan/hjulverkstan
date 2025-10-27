import { ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { Languages, LucideIcon } from 'lucide-react';

import { Label } from '@components/shadcn/Label';

import { useDataForm } from './';

const labelVariants = cva('flex gap-1.5 px-2', {
  variants: {
    variant: {
      default: '',
      translation: '!text-purple-foreground [&>label]:!text-purple-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface FieldProps extends VariantProps<typeof labelVariants> {
  label: string;
  description?: string;
  dataKey: string;
  children: ReactNode;
  icon?: LucideIcon;
  labelClassName?: string;
}

export const Field = ({
  dataKey,
  label,
  description,
  children,
  variant,
}: FieldProps) => {
  const { fieldErrorMap } = useDataForm();

  return (
    <div className="flex flex-col space-y-2">
      <span className={labelVariants({ variant })}>
        {variant === 'translation' && <Languages className="h-4 w-4" />}
        <Label htmlFor={dataKey}>{label}</Label>
      </span>
      {children}
      {description && (
        <p className="text-muted-foreground px-2 text-[0.8rem]">
          {description}
        </p>
      )}
      {fieldErrorMap[dataKey] && (
        <div
          className="bg-red-fill text-red-foreground rounded-md px-4 py-2
            text-sm"
        >
          {fieldErrorMap[dataKey]}
        </div>
      )}
    </div>
  );
};

Field.displayName = 'DataFormField';
