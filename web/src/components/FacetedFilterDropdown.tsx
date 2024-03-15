import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';

import { cn } from '@utils';
import { Badge } from '@components/ui/Badge';
import { Separator } from '@components/ui/Separator';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@components/ui/Command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/ui/Popover';

import { Button } from '@components/ui/Button';

export interface FilterOption {
  name: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface FacetedFilterDropdownProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  setSelected: (selected: string[]) => void;
  disabled?: boolean;
}

export default function FacetedFilterDropdown({
  label,
  options,
  selected,
  setSelected,
  disabled = false,
}: FacetedFilterDropdownProps) {
  const onOptionClick = (option: FilterOption) =>
    setSelected(
      selected.includes(option.value)
        ? selected.filter((el) => el !== option.value)
        : selected.concat(option.value),
    );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          size="sm"
          className="h-8 border-dashed"
        >
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {label}
          {selected.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="space-x-1 lg:flex">
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selected.length}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selected.length > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {selected.length} selected
                    </Badge>
                  ) : (
                    options
                      .filter((option) => selected.includes(option.value))
                      .map((option) => (
                        <Badge
                          variant="secondary"
                          key={option.value}
                          className="rounded-sm px-1 font-normal"
                        >
                          {option.name}
                        </Badge>
                      ))
                  )}
                </div>
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={label} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => onOptionClick(option)}
                >
                  <div
                    className={cn(
                      `mr-2 flex h-4 w-4 items-center justify-center rounded-sm
                      border border-primary`,
                      selected.includes(option.value)
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible',
                    )}
                  >
                    <CheckIcon className={cn('h-4 w-4')} />
                  </div>
                  {option.icon && (
                    <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{option.name}</span>
                  {option.count && (
                    <span
                      className="ml-auto flex h-4 w-4 items-center
                        justify-center font-mono text-xs"
                    >
                      {option.count}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            {selected.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setSelected([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
