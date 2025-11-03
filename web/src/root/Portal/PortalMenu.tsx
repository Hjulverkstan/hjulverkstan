import { useNavigate } from 'react-router-dom';

import { ProtectedByRole, useAuth } from '@components/Auth';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { Button } from '@components/shadcn/Button';
import { Avatar, AvatarFallback } from '@components/shadcn/Avatar';
import { AuthRole } from '@data/auth/types';
import usePortalSlugs from '@hooks/useSlugs';

export const PortalMenu = () => {
  const { auth, logOut } = useAuth();

  if (!auth) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{auth.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-56" align="end" forceMount>
        <DropdownMenu.Label className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{auth.username}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {auth.email}
            </p>
          </div>
        </DropdownMenu.Label>
        <ProtectedByRole roles={[AuthRole.ADMIN]}>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <PortalMenuItem appSlug="/shop" label="Shop" />
            <PortalMenuItem appSlug="/admin" label="Admin" />
            <PortalMenuItem appSlug="/web-edit" label="WebEdit" />
          </DropdownMenu.Group>
        </ProtectedByRole>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={logOut}>Log out</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

const PortalMenuItem = ({
  label,
  appSlug: itemAppSlug,
}: {
  appSlug: string;
  label: string;
}) => {
  const { baseUrl, appSlug } = usePortalSlugs();
  const navigate = useNavigate();

  const isActive = appSlug === itemAppSlug;

  return (
    <DropdownMenu.Item
      onClick={() => !isActive && navigate(baseUrl + itemAppSlug)}
    >
      <span className={isActive ? 'font-medium' : 'text-muted-foreground'}>
        {label}
      </span>
    </DropdownMenu.Item>
  );
};
