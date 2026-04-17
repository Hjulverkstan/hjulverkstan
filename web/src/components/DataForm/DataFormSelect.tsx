import { useState, useMemo } from 'react';

import * as C from '@utils/common';
import * as Popover from '@components/shadcn/Popover';
import * as Command from '@components/shadcn/Command';

import { Button } from '@components/shadcn/Button';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { EnumAttributes } from '@data/types';

import { Field, FieldProps, useDataForm } from './';
import { CheckIcon } from 'lucide-react';

export interface SelectProps extends Omit<FieldProps, 'children'> {
  enums: EnumAttributes[];
  isMultiSelect?: boolean;
  disabled?: boolean;
  fat?: boolean;
  allowDeselect?: boolean;
  preLine?: boolean;
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
  preLine,
}: SelectProps) => {
  const { isLoading, getBodyProp, setBodyProp, isDisabled } = useDataForm();
  const [open, setOpen] = useState(false);

  const isDisabledUnion = isDisabled || disabled;

  const buttonLabel = isMultiSelect
    ? getBodyProp(dataKey)?.length > 3
      ? `${getBodyProp(dataKey)?.length} selected`
      : getBodyProp(dataKey)
          ?.map((value: string) => {
            const e = enums.find((e) => e.value === value);
            const label = e?.shortLabel || e?.label;
            return label?.toString().replace(' | ', ' ');
          })
          .join(', ')
    : (() => {
        const e = enums.find((e) => e.value === getBodyProp(dataKey));
        const label = e?.shortLabel || e?.label;
        return label?.toString().replace(' | ', ' ');
      })();

  const Icon =
    !isMultiSelect &&
    getBodyProp(dataKey) !== undefined &&
    getBodyProp(dataKey) !== null &&
    enums.find((e) => e.value === getBodyProp(dataKey))?.icon;

  const sortedEnums = useMemo(
    () => enums.sort(C.toSortFnByProp('label')),
    [enums],
  );

  const hasData = Array.isArray(getBodyProp(dataKey))
    ? getBodyProp(dataKey).length
    : getBodyProp(dataKey) !== undefined && getBodyProp(dataKey) !== null;

  const renderItem = (e: EnumAttributes) => {
    const isSelected = isMultiSelect
      ? getBodyProp(dataKey)?.includes(e.value)
      : getBodyProp(dataKey) === e.value;

    const safeValue = String(e.label)
      .toLowerCase()
      .replace(/[^a-z0-9+]/g, '');
    return (
      <Command.Item
        key={e.value}
        value={safeValue}
        onSelect={() => {
          if (isMultiSelect) {
            const updatedBody = C.toUpdatedArray(getBodyProp(dataKey), {
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
        <div className={C.cn('flex w-full items-center', fat && 'py-1')}>
          {e.icon && <e.icon className="mr-2 h-4 w-4" />}
          <span className={C.cn('flex-grow', preLine && 'whitespace-pre-line')}>
            {e.label?.toString().replace(' | ', '\n')}
          </span>
          <CheckIcon
            className={C.cn(
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
            className={C.cn(
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
            <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
              {isMultiSelect ? (
                <>
                  {!!getBodyProp(dataKey)?.length && (
                    <Command.Group heading="Selected">
                      {sortedEnums
                        .filter((e) => getBodyProp(dataKey)?.includes(e.value))
                        .map(renderItem)}
                    </Command.Group>
                  )}
                  <Command.Group heading="Unselected">
                    {sortedEnums
                      .filter((e) => !getBodyProp(dataKey)?.includes(e.value))
                      .map(renderItem)}
                  </Command.Group>
                </>
              ) : (
                <Command.Group>{sortedEnums.map(renderItem)}</Command.Group>
              )}
            </div>
          </Command.Root>
        </Popover.Content>
      </Popover.Root>
    </Field>
  );
};

Select.displayName = 'DataFormSelect';
