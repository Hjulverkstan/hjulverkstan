import { useMemo, Fragment } from 'react';

import * as C from '@utils/common';
import { EnumAttributes } from '@data/types';
import * as Command from '@components/shadcn/Command';
import MultiSelectItem from '@components/MutliSelectItem';

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
        ? C.toUpdatedArray(selected, { remove: self.value })
        : isParentSelected
          ? C.toUpdatedArray(selected, { add: siblings, remove: parent.value })
          : isAllSiblingsSelected
            ? C.toUpdatedArray(selected, {
                remove: parent?.children,
                add: parent?.value,
              })
            : C.toUpdatedArray(selected, {
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
          <MultiSelectItem
            enumAttr={enumAttr}
            checkBox={toCheckBoxValue(enumAttr.value)}
            onClick={() => onClick(enumAttr)}
          />
          {toChildrenEnums(enumAttr.children).map((child) => (
            <MultiSelectItem
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
