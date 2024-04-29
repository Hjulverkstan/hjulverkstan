import { useState, ComponentType } from 'react';

import * as U from '@utils';
import * as Popover from '@components/shadcn/Popover';
import * as Command from '@components/shadcn/Command';

import { Field, FieldProps, useDataForm } from './';
import { Button } from '@components/shadcn/Button';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { CheckIcon } from 'lucide-react';

export interface SelectOption {
  name: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
}

export interface SelectProps extends Omit<FieldProps, 'children'> {
  options: SelectOption[];
  disabled?: boolean;
}

export const Select = ({
  label,
  dataKey,
  options,
  description,
  disabled,
}: SelectProps) => {
  const { isSkeleton, body, setBodyProp, isDisabled } = useDataForm();
  const [open, setOpen] = useState(false);

  const isDisabledUnion = isDisabled || disabled;

  return (
    <Field label={label} dataKey={dataKey} description={description}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button
            id={dataKey}
            disabled={isDisabledUnion}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={U.cn(
              'justify-between',
              isDisabledUnion && 'opacity-70',
              !body[dataKey] && 'text-muted-foreground font-normal',
            )}
          >
            {isSkeleton
              ? ''
              : body[dataKey]
                ? options.find((option) => option.value === body[dataKey])?.name
                : `Select ${label.toLowerCase()}...`}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </Popover.Trigger>
        <Popover.Content className="w-[200px] p-0" id={dataKey}>
          <Command.Root>
            <Command.Input
              placeholder={`Search ${label.toLowerCase()}`}
              className="h-9"
            />
            <Command.Empty>No {label.toLowerCase()} found.</Command.Empty>
            <Command.Group>
              {options.map(({ value, name }) => (
                <Command.Item
                  key={value}
                  value={value}
                  onSelect={() => {
                    if (value !== body[dataKey]) setBodyProp(dataKey, value);
                    setOpen(false);
                  }}
                >
                  {name}
                  <CheckIcon
                    className={U.cn(
                      'ml-auto h-4 w-4',
                      value === body[dataKey] ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </Command.Item>
              ))}
            </Command.Group>
          </Command.Root>
        </Popover.Content>
      </Popover.Root>
    </Field>
  );
};

Select.displayName = 'DataFormSelect';
