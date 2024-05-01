import { useMemo, Fragment } from 'react';
import { MinusIcon } from 'lucide-react';
import { CheckIcon } from '@radix-ui/react-icons';

import * as U from '@utils';
import * as Command from '@components/shadcn/Command';
import { EnumAttributes } from '@data/enums';

interface MultiSelectProps {
  enums: EnumAttributes[];
  selected: string[];
  setSelected: (selected: string[]) => void;
  heading?: string;
}

export default function MultiSelect({
  enums,
  selected,
  setSelected,
  heading,
}: MultiSelectProps) {
  // Derive checkbox values from parent values enums && selected

  const intermediate = useMemo(
    () =>
      enums.reduce<string[]>(
        (acc, e) =>
          e.children?.some((value) => selected.includes(value))
            ? acc.concat(e.value)
            : acc,
        [],
      ),
    [selected, enums],
  );

  const checked = useMemo(() => {
    const childrenOfChecked = enums.reduce<string[]>(
      (acc, e) =>
        selected.includes(e.value) && e.children ? acc.concat(e.children) : acc,
      [],
    );

    return selected.concat(childrenOfChecked);
  }, [selected, enums]);

  const toCheckBoxValue = (enumValue: string) =>
    intermediate.includes(enumValue)
      ? 'intermediate'
      : checked.includes(enumValue)
        ? 'checked'
        : 'unchecked';

  // Derive new selected values on click an propagate to parent

  const onClick = (self: EnumAttributes) => {
    const isSelected = selected.includes(self.value);
    const parent = enums.find(({ children }) => children?.includes(self.value));
    const isParentSelected = parent && selected.includes(parent.value);

    const siblings = parent?.children?.filter(
      (value) => value !== self.value && enums.some((e) => e.value === value),
    );

    const isAllSiblingsSelected = siblings?.every((childValue) =>
      selected.includes(childValue),
    );

    setSelected(
      isSelected
        ? U.toUpdatedArray(selected, { remove: self.value })
        : isParentSelected
          ? U.toUpdatedArray(selected, { add: siblings, remove: parent.value })
          : isAllSiblingsSelected
            ? U.toUpdatedArray(selected, {
                remove: parent?.children,
                add: parent?.value,
              })
            : U.toUpdatedArray(selected, {
                remove: self.children,
                add: self.value,
              }),
    );
  };

  //

  const allChildrenValues = enums
    .map((e) => e.children)
    .filter((e) => e)
    .flat();

  const rootEnums = enums.filter((e) => !allChildrenValues.includes(e.value));

  const toChildrenEnums = (children = [] as string[]) =>
    children
      .map((childValue) => enums.find((e) => e.value === childValue)!)
      .filter((x) => x);

  return (
    <Command.Group heading={heading}>
      {rootEnums.map((enumAttr) => (
        <Fragment key={enumAttr.value}>
          <SelectableItem
            enumAttr={enumAttr}
            checkBox={toCheckBoxValue(enumAttr.value)}
            onClick={() => onClick(enumAttr)}
          />
          {toChildrenEnums(enumAttr.children).map((child) => (
            <SelectableItem
              isIndented
              key={child.value}
              enumAttr={child}
              checkBox={toCheckBoxValue(child.value)}
              onClick={() => onClick(child)}
            />
          ))}
        </Fragment>
      ))}
    </Command.Group>
  );
}

//

interface SelectableItemProps {
  enumAttr: EnumAttributes;
  isIndented?: boolean;
  checkBox: 'checked' | 'unchecked' | 'intermediate';
  onClick: () => void;
}

function SelectableItem({
  enumAttr: e,
  isIndented,
  checkBox,
  onClick,
}: SelectableItemProps) {
  return (
    <Command.Item
      key={e.value}
      onSelect={onClick}
      disabled={checkBox === 'unchecked' && !e.count}
      className="w-full"
    >
      <div
        className={U.cn(
          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
          checkBox === 'unchecked'
            ? 'border-secondary-foreground opacity-50'
            : 'border-primary bg-primary text-primary-foreground',
          isIndented && 'ml-4',
        )}
      >
        {checkBox === 'checked' && <CheckIcon className="h-4 w-4" />}
        {checkBox === 'intermediate' && <MinusIcon className="h-4 w-4" />}
      </div>
      <div
        className={U.cn(
          'flex flex-grow items-center',
          checkBox !== 'unchecked' && !e.count && 'opacity-50',
        )}
      >
        {e.icon && <e.icon className="text-muted-foreground mr-2 h-4 w-4" />}
        <span>{e.name}</span>
        {e.count !== undefined && (
          <span
            className="ml-auto flex h-4 w-4 items-center justify-center
              font-mono text-xs"
          >
            {e.count}
          </span>
        )}
      </div>
    </Command.Item>
  );
}
