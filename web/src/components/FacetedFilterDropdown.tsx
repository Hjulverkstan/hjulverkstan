import { CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@utils';
import * as Command from '@components/ui/Command';

// It is unfortinate to make an import from root here as components should be
// decoupled from specific intricate bussines down the component tree of root.
// But time is limited and i want to produce enought before i leave...
import { EnumAttributes } from '../root/Portal/enums';

export interface EnumAttributesWithCount extends EnumAttributes {
  count?: number;
}

interface FacetedFilterDropdownProps {
  enums: EnumAttributesWithCount[];
  hasSearch?: boolean;
  selected: string[];
  setSelected: (selected: string[]) => void;
}

export default function FacetedFilterDropdown({
  enums,
  hasSearch = false,
  selected,
  setSelected,
}: FacetedFilterDropdownProps) {
  const onOptionClick = (value: string) =>
    setSelected(
      selected.includes(value)
        ? selected.filter((selectedValue) => selectedValue !== value)
        : selected.concat(value),
    );

  return (
    <Command.Root>
      {hasSearch && <Command.Input placeholder="Search" />}
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <Command.Group>
          {enums.map(({ value, count, name, icon: Icon }) => (
            <Command.Item key={value} onSelect={() => onOptionClick(value)}>
              <div
                className={cn(
                  `mr-2 flex h-4 w-4 items-center justify-center rounded-sm
                  border border-primary`,
                  selected.includes(value)
                    ? 'bg-primary text-primary-foreground'
                    : 'opacity-50 [&_svg]:invisible',
                )}
              >
                <CheckIcon className={cn('h-4 w-4')} />
              </div>
              {Icon && <Icon className="mr-2 h-4 w-4 text-muted-foreground" />}
              <span>{name}</span>
              {count && (
                <span
                  className="ml-auto flex h-4 w-4 items-center justify-center
                    font-mono text-xs"
                >
                  {count}
                </span>
              )}
            </Command.Item>
          ))}
        </Command.Group>
        {selected.length > 0 && (
          <>
            <Command.Separator />
            <Command.Group>
              <Command.Item
                onSelect={() => setSelected([])}
                className="justify-center text-center"
              >
                Clear filters
              </Command.Item>
            </Command.Group>
          </>
        )}
      </Command.List>
    </Command.Root>
  );
}
