import { CalendarIcon } from 'lucide-react';
import { format, formatISO } from 'date-fns';

import * as C from '@utils/common';
import { IconButton } from '@components/shadcn/Button';
import * as Popover from '@components/shadcn/Popover';
import { Calendar } from '@components/shadcn/Calendar';

import { Field, FieldProps } from './DataFormField';
import { useDataForm } from './DataFormProvider';
import { useState } from 'react';

export interface DataFormDateProps extends Omit<FieldProps, 'children'> {
  fromDate?: Date;
}

export const DatePicker = ({
  label,
  dataKey,
  description,
  fromDate,
}: DataFormDateProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, isDisabled, getBodyProp, setBodyProp } = useDataForm();

  return (
    <Field label={label} dataKey={dataKey} description={description}>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <IconButton
            disabled={isDisabled}
            variant={'outline'}
            className={C.cn(
              !getBodyProp(dataKey) && 'text-muted-foreground',
              isDisabled && '!opacity-75',
            )}
            icon={CalendarIcon}
            text={
              isLoading
                ? ''
                : getBodyProp(dataKey)
                  ? format(getBodyProp(dataKey), 'PPP')
                  : 'Pick a date'
            }
          />
        </Popover.Trigger>
        <Popover.Content className="w-auto p-0">
          <Calendar
            fromDate={fromDate}
            mode="single"
            selected={getBodyProp(dataKey)}
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
