import { CalendarIcon } from 'lucide-react';
import { format, formatISO } from 'date-fns';

import * as U from '@utils';
import { IconButton } from '@components/shadcn/Button';
import * as Popover from '@components/shadcn/Popover';
import { Calendar } from '@components/shadcn/Calendar';

import { Field, FieldProps } from './DataFormField';
import { useDataForm } from './DataFormProvider';
import { useState } from 'react';

export interface DataFormDateProps extends Omit<FieldProps, 'children'> {
  fromDate?: string;
}

export const DatePicker = ({
  label,
  dataKey,
  description,
  fromDate,
}: DataFormDateProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSkeleton, isDisabled, body, setBodyProp } = useDataForm();

  return (
    <Field label={label} dataKey={dataKey} description={description}>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <IconButton
            disabled={isDisabled}
            variant={'outline'}
            className={U.cn(
              !body[dataKey] && 'text-muted-foreground',
              isDisabled && '!opacity-75',
            )}
            icon={CalendarIcon}
            text={
              isSkeleton
                ? ''
                : body[dataKey]
                  ? format(body[dataKey], 'PPP')
                  : 'Pick a date'
            }
          />
        </Popover.Trigger>
        <Popover.Content className="w-auto p-0">
          <Calendar
            fromDate={fromDate !== undefined ? new Date(fromDate) : undefined}
            mode="single"
            selected={body[dataKey]}
            onSelect={(value?: Date) => {
              if (value)
                setBodyProp(
                  dataKey,
                  formatISO(value, { representation: 'date' }) + 'T00:00:00',
                );
              setIsOpen(false);
            }}
            initialFocus
          />
        </Popover.Content>
      </Popover.Root>
    </Field>
  );
};

DatePicker.displayName = 'DataFormDate';
