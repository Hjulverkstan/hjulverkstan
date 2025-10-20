import { ReactNode, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import * as C from '@utils/common';
import * as ShadCollapsible from '@components/shadcn/Collapsible';

import { Mode, useDataForm } from './';

export interface CollapsibleProps {
  label: string;
  children: ReactNode;
}

export const Collapsible = ({ label, children }: CollapsibleProps) => {
  const { isDisabled, mode } = useDataForm();
  const [isOpen, setIsOpen] = useState(mode === Mode.CREATE);

  useEffect(() => {
    if (mode === Mode.CREATE) setIsOpen(true);
  }, [mode]);

  return (
    <ShadCollapsible.Root open={isOpen} onOpenChange={setIsOpen}>
      <ShadCollapsible.Trigger asChild>
        <div
          className={C.cn(
            `align-center space-between text flex cursor-pointer items-center
rounded-md border px-4 py-2 text-sm font-medium`,
            isDisabled && '!opacity-75',
          )}
        >
          <span className="w-full">{label}</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </ShadCollapsible.Trigger>
      <ShadCollapsible.Content>
        <div className="my-4 flex flex-col gap-4">{children}</div>
      </ShadCollapsible.Content>
    </ShadCollapsible.Root>
  );
};

Collapsible.displayName = 'DataFormCollapsible';
