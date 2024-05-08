import { useIsFetching } from 'react-query';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { ProtectedByRole, useAuth } from '@components/Auth';
import { Avatar, AvatarFallback } from '@components/shadcn/Avatar';
import { Button } from '@components/shadcn/Button';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { Separator } from '@components/shadcn/Separator';
import { Tabs, TabsList, TabsTrigger } from '@components/shadcn/Tabs';
import Spinner from '@components/Spinner';
import useSlugs from '@hooks/useSlugs';
import { AuthRole } from '@data/auth/types';

export interface NavRoute {
  label: string;
  path: string;
  hasNestedRoutes?: boolean;
}

export interface PortalLayoutProps {
  routes: NavRoute[];
  baseUrl: string;
  title: string;
}

export default function PortalLayout({
  title,
  baseUrl,
  routes,
}: PortalLayoutProps) {
  const isFetching = useIsFetching();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const route = routes.find(({ path }) => pathname.startsWith(baseUrl + path));

  return (
    <>
      <div className="flex h-screen flex-col px-4 pt-2">
        <nav
          className="mb-2 flex flex-shrink items-center justify-center space-x-4
            py-1"
        >
          <h2 className="flex-1 text-lg font-semibold">
            Hjulverkstan
            <span className="text-muted-foreground font-normal"> {title}</span>
          </h2>
          <Tabs value={route?.path}>
            <TabsList>
              {routes.map((el) => (
                <TabsTrigger
                  key={el.path}
                  value={el.path}
                  onClick={() => navigate(baseUrl + el.path)}
                >
                  {el.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex flex-1 items-center justify-end">
            <Spinner visible={!!isFetching} className="mr-4 h-6 w-6" />
            <AvatarDropdown />
          </div>
        </nav>
        <Separator className="mb-4 opacity-40" />
        <Outlet />
      </div>
    </>
  );
}

//

function AvatarDropdown() {
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
            <AvatarDropdownAppItem appSlug="/shop" label="Shop" />
            <AvatarDropdownAppItem appSlug="/admin" label="Admin" />
            <AvatarDropdownAppItem appSlug="/web-edit" label="WebEdit" />
          </DropdownMenu.Group>
        </ProtectedByRole>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={logOut}>Log out</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function AvatarDropdownAppItem({
  label,
  appSlug: itemAppSlug,
}: {
  appSlug: string;
  label: string;
}) {
  const { baseUrl, appSlug } = useSlugs();
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
}
