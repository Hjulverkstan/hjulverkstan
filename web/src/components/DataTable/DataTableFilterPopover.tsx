import { ReactNode, createContext, useContext, useState } from 'react';

import * as U from '@utils';
import * as Command from '@components/shadcn/Command';
import * as Popover from '@components/shadcn/Popover';

import { useDataTable } from './';
import { Button } from '@components/shadcn/Button';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { Separator } from '@components/shadcn/Separator';
import { Badge } from '@components/shadcn/Badge';

//

export interface UseFilterPopoverReturn {
  setActiveLabels: (filterKey: string, labels: string[]) => void;
}

const FilterPopoverContext = createContext<UseFilterPopoverReturn | undefined>(
  undefined,
);

export const useFilterPopover = () => {
  const context = useContext(FilterPopoverContext);

  if (!context)
    throw new Error(
      'useFilterPopover must be a decendant of <PopoverFilter />',
    );

  return context;
};

//

export interface FilterPopoverProps {
  label: string;
  children: ReactNode;
  hasSearch?: boolean;
}

export const FilterPopover = ({
  label,
  children,
  hasSearch,
}: FilterPopoverProps) => {
  const { disabled, setFilterFn } = useDataTable();

  const [activeLabelsMap, setActiveLabelsMap] = useState<
    Record<string, string[]>
  >({});

  const setActiveLabels = (filterKey: string, labels: string[]) =>
    setActiveLabelsMap({ ...activeLabelsMap, [filterKey]: labels });

  const activeLabels = Object.values(activeLabelsMap).flat();
  const isActive = !!activeLabels.length;
  const filterKeys = Object.keys(activeLabelsMap);

  const resetFilters = () =>
    filterKeys.forEach((filterKey) => setFilterFn(filterKey, false));

  // We want to manually control open but passing persistMount to
  // <Popover.Content />. If the content was unmounted when closed our state
  // logic and useEffect would not work.

  const [isOpen, setIsOpen] = useState(false);

  return (
    <FilterPopoverContext.Provider value={{ setActiveLabels }}>
      <Popover.Root onOpenChange={setIsOpen} open={isOpen}>
        <Popover.Trigger asChild>
          <Button
            disabled={disabled}
            variant="accent"
            data-state={isActive && 'active'}
            subVariant="flat"
          >
            {!isActive && <PlusCircledIcon className="mr-2 h-4 w-4" />}
            {label}
            {isActive && (
              <>
                <Separator
                  orientation="vertical"
                  className={U.cn(
                    'ml-3 mr-2 h-4',
                    isActive && 'bg-secondary-border',
                  )}
                />
                <div className="ml--1 space-x-1 lg:flex">
                  <Badge
                    borderless
                    variant="contrast"
                    className="rounded-sm px-1 font-normal lg:hidden"
                  >
                    {activeLabels.length}
                  </Badge>
                  <div className="hidden space-x-1 lg:flex">
                    {activeLabels.length > 2 ? (
                      <Badge
                        borderless
                        variant="contrast"
                        className="rounded-sm px-1 font-normal"
                      >
                        {activeLabels.length}
                      </Badge>
                    ) : (
                      activeLabels.map((label, i) => (
                        <Badge
                          borderless
                          variant="contrast"
                          key={i}
                          className="rounded-sm px-1 font-normal"
                        >
                          {label}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </Button>
        </Popover.Trigger>
        <Popover.Content
          className="w-[200px] p-0"
          align="start"
          persistMount
          isOpen={isOpen}
        >
          <Command.Root>
            {hasSearch && <Command.Input placeholder="Search" />}
            <Command.List>
              <Command.Empty>No results found.</Command.Empty>
              {children}
              {isActive && (
                <>
                  <Command.Separator />
                  <Command.Group>
                    <Command.Item
                      onSelect={resetFilters}
                      className="justify-center text-center"
                    >
                      Clear filters
                    </Command.Item>
                  </Command.Group>
                </>
              )}
            </Command.List>
          </Command.Root>
        </Popover.Content>
      </Popover.Root>
    </FilterPopoverContext.Provider>
  );
};

FilterPopover.displayName = 'DataTableFilterPopover';
