import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { GeneralContent } from '@data/webedit/general/types';

import { IconButton } from '@components/shadcn/Button';
import { Dialog, DialogTrigger } from '@components/shadcn/Dialog';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
// import { useToast } from '@components/shadcn/use-toast';

import { PortalTableActionsProps } from '../PortalTable';

export default function WebEditGeneralContentActions({
  // row: generalContent,
  disabled,
}: PortalTableActionsProps<GeneralContent>) {
  const [open, setOpen] = useState(false);
  // const { toast } = useToast();

  return (
    <Dialog>
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger asChild>
          <IconButton
            disabled={disabled}
            variant="ghost"
            icon={DotsHorizontalIcon}
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" className="w-[160px]">
          <DialogTrigger asChild>
            <DropdownMenu.Item
              onClick={(e) => e.stopPropagation()}
              onSelect={(e) => e.preventDefault()}
            >
              Delete
              <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
          </DialogTrigger>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Dialog>
  );
}
