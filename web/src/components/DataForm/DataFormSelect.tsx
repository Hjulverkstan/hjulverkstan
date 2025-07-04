import { useState, useMemo } from 'react';

import * as U from '@utils';
import * as Popover from '@components/shadcn/Popover';
import * as Command from '@components/shadcn/Command';

import { Button } from '@components/shadcn/Button';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { EnumAttributes } from '@data/enums';

import { Field, FieldProps, useDataForm } from './';
import { CheckIcon } from 'lucide-react';

export interface SelectProps extends Omit<FieldProps, 'children'> {
  enums: EnumAttributes[];
  isMultiSelect?: boolean;
  disabled?: boolean;
  fat?: boolean;
  allowDeselect?: boolean;
}

export const Select = ({
  label,
  dataKey,
  isMultiSelect,
  enums,
  description,
  disabled,
  fat,
  allowDeselect,
}: SelectProps) => {
  const { isLoading, body, setBodyProp, isDisabled } = useDataForm();
  const [open, setOpen] = useState(false);

  const isDisabledUnion = isDisabled || disabled;

  const buttonLabel = isMultiSelect
    ? body[dataKey]?.length > 3
      ? `${body[dataKey]?.length} selected`
      : body[dataKey]
          ?.map((value: string) => enums.find((e) => e.value === value)?.label)
          .join(', ')
    : enums.find((e) => e.value === body[dataKey])?.label;

  const Icon =
    !isMultiSelect &&
    body[dataKey] !== undefined &&
    body[dataKey] !== null &&
    enums.find((e) => e.value === body[dataKey])?.icon;

  const sortedEnums = useMemo(
    () => enums.sort(U.toSortFnByProp('label')),
    [enums],
  );

  const hasData = Array.isArray(body[dataKey])
    ? body[dataKey].length
    : body[dataKey] !== undefined && body[dataKey] !== null;

  const renderItem = (e: EnumAttributes) => {
    const isSelected = isMultiSelect
      ? body[dataKey]?.includes(e.value)
      : body[dataKey] === e.value;

    return (
      <Command.Item
        key={e.label}
        value={e.label}
        onSelect={() => {
          if (isMultiSelect) {
            const updatedBody = U.toUpdatedArray(body[dataKey], {
              add: isSelected ? [] : e.value,
              remove: isSelected ? e.value : [],
            });
            setBodyProp(dataKey, updatedBody);
          } else {
            if (allowDeselect && isSelected) {
              setBodyProp(dataKey, undefined);
            } else {
              setBodyProp(dataKey, e.value);
            }
            setOpen(false);
          }
        }}
      >
        <div className={U.cn('flex w-full items-center', fat && 'py-1')}>
          {e.icon && <e.icon className="mr-2 h-4 w-4" />}
          <span className="flex-grow">{e.label}</span>
          <CheckIcon
            className={U.cn(
              'ml-2 h-4 w-4',
              fat && 'mr-1',
              isSelected ? 'opacity-100' : 'opacity-0',
            )}
          />
        </div>
      </Command.Item>
    );
  };

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
              isDisabledUnion && '!opacity-75',
              fat && 'h-10',
              !hasData && 'text-muted-foreground font-normal',
            )}
          >
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            {isLoading
              ? ''
              : hasData
                ? buttonLabel
                : allowDeselect
                  ? `No ${label.toLowerCase()} selected...`
                  : `Select ${label.toLowerCase()}...`}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </Popover.Trigger>
        <Popover.Content className="w-[15.5rem] p-0" id={dataKey}>
          <Command.Root>
            <Command.Input
              placeholder={`Search ${label.toLowerCase()}`}
              className="h-9"
            />
            <Command.Empty>No {label.toLowerCase()} found.</Command.Empty>
            {isMultiSelect ? (
              <>
                {!!body[dataKey]?.length && (
                  <Command.Group heading="Selected">
                    {sortedEnums
                      .filter((e) => body[dataKey]?.includes(e.value))
                      .map(renderItem)}
                  </Command.Group>
                )}
                <Command.Group heading="Unselected">
                  {sortedEnums
                    .filter((e) => !body[dataKey]?.includes(e.value))
                    .map(renderItem)}
                </Command.Group>
              </>
            ) : (
              <Command.Group>{sortedEnums.map(renderItem)}</Command.Group>
            )}
          </Command.Root>
        </Popover.Content>
      </Popover.Root>
    </Field>
  );
};

Select.displayName = 'DataFormSelect';
