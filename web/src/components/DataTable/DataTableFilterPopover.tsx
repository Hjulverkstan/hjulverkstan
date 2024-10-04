import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

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
  subscribeToClearFilters: (callback: () => void) => () => void;
}

const FilterPopoverContext = createContext<UseFilterPopoverReturn | undefined>(
  undefined,
);

export const useFilterPopover = ({
  onClear,
}: { onClear?: () => void } = {}) => {
  const context = useContext(FilterPopoverContext);

  if (!context) {
    throw new Error(
      'useFilterPopover must be a descendant of <PopoverFilter />',
    );
  }

  // Subscribe to clear filters action
  useEffect(() => {
    if (onClear) {
      const unsubscribe = context.subscribeToClearFilters(onClear);
      return () => unsubscribe();
    }
  }, [onClear, context]);

  return context;
};

//

export interface FilterPopoverProps {
  label: ReactNode;
  children: ReactNode;
  hasSearch?: boolean;
  width?: number;
  /**
   * Mount the children without using the cmdk wrapper used in order to render
   * components from [<Command />](../shadcn/Command.tsx)
   */
  withoutCmdk?: boolean;
  hideIcon?: boolean;
}

export const FilterPopover = ({
  label,
  children,
  hasSearch,
  withoutCmdk = false,
  width = 250,
  hideIcon = false,
}: FilterPopoverProps) => {
  const { disabled } = useDataTable();
  const [activeLabelsMap, setActiveLabelsMap] = useState<
    Record<string, string[]>
  >({});
  const [isOpen, setIsOpen] = useState(false);

  const activeLabels = Object.values(activeLabelsMap).flat();
  const isActive = !!activeLabels.length;

  // For the usePopoverFilter hook

  const clearFilterListeners = useRef<(() => void)[]>([]);

  const subscribeToClearFilters = (callback: () => void) => {
    clearFilterListeners.current.push(callback);
    return () => {
      clearFilterListeners.current = clearFilterListeners.current.filter(
        (fn) => fn !== callback,
      );
    };
  };

  // For the usePopoverFilter hook

  const setActiveLabels = useCallback(
    (filterKey: string, labels: string[]) =>
      setActiveLabelsMap((state) => ({ ...state, [filterKey]: labels })),
    [],
  );

  // For the reset button in the popover filter

  const resetFilters = () => {
    setActiveLabelsMap({}); // Clear all active labels
    clearFilterListeners.current.forEach((fn) => fn());
  };

  // We want to manually control open but passing persistMount to
  // <Popover.Content />. If the content was unmounted when closed our state
  // logic and useEffect would not work.

  const clearFilterContent = isActive && (
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
  );

  return (
    <FilterPopoverContext.Provider
      value={{ setActiveLabels, subscribeToClearFilters }}
    >
      <Popover.Root onOpenChange={setIsOpen} open={isOpen}>
        <Popover.Trigger asChild>
          <Button
            disabled={disabled}
            variant="accent"
            data-state={isActive && 'active'}
            subVariant="flat"
          >
            {!isActive && !hideIcon && (
              <PlusCircledIcon className="mr-2 h-4 w-4" />
            )}
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
          className="p-0"
          style={{ width }}
          align="start"
          persistMount
          isOpen={isOpen}
        >
          {withoutCmdk ? (
            <>
              {children}
              <Command.Root>{clearFilterContent}</Command.Root>
            </>
          ) : (
            <Command.Root>
              {hasSearch && <Command.Input placeholder="Search" />}
              <Command.List>
                <Command.Empty>No results found.</Command.Empty>
                {children}
                {clearFilterContent}
              </Command.List>
            </Command.Root>
          )}
        </Popover.Content>
      </Popover.Root>
    </FilterPopoverContext.Provider>
  );
};

FilterPopover.displayName = 'DataTableFilterPopover';
