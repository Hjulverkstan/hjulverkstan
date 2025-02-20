import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { IconButton } from '@components/shadcn/Button';
import { PortalTableActionsProps } from '../PortalTable';
import { GeneralContent } from '@data/webedit/general/types';
import { useNavigate } from 'react-router-dom';

export default function WebEditGeneralContentActions({
  row: generalContent,
  disabled,
}: PortalTableActionsProps<GeneralContent>) {
  const navigate = useNavigate();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton
          disabled={disabled}
          variant="ghost"
          icon={DotsHorizontalIcon}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-[160px]">
        <DropdownMenu.Item
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`./${generalContent.id}/edit`, { replace: true });
          }}
        >
          Edit
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
