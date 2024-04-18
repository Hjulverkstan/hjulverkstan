import React from 'react';
import { matchPath, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useIsFetching } from 'react-query';

import { Button } from '@components/ui/Button';
import { Avatar, AvatarFallback } from '@components/ui/Avatar';
import { Separator } from '@components/ui/Separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';
import { useAuth } from '@components/Auth';
import Spinner from '@components/Spinner';

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

export default function PortalLayout({ title, ...rest }: PortalLayoutProps) {
  const isFetching = useIsFetching();
  const { logOut } = useAuth();

  const handleLogout = (event: React.FormEvent) => {
    event.preventDefault();
    logOut();
  };

  return (
    <>
      <div className="px-4 pt-2">
        <nav className="mb-2">
          <div className="flex items-center justify-center space-x-4">
            <h2 className="flex-1 text-lg font-semibold">
              Hjulverkstan
              <span className="font-normal text-muted-foreground">
                {' '}
                {title}
              </span>
            </h2>
            <div className="flex-shrink pt-2">
              {' '}
              <NavBar {...rest} />{' '}
            </div>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
            <div className="flex flex-1 items-center justify-end">
              <Spinner visible={!!isFetching} className="mr-4 h-6 w-6" />
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </div>
        </nav>
        <Separator className="opacity-40" />
      </div>
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}

interface NavBarProps {
  baseUrl: string;
  routes: NavRoute[];
}

function NavBar({ baseUrl, routes }: NavBarProps) {
  const { pathname } = useLocation();

  const route = routes.find(({ path, hasNestedRoutes = '' }) =>
    matchPath(baseUrl + path + (hasNestedRoutes && '/*'), pathname),
  )!;

  if (!route) {
    console.error(
      'PortalLayout routes:',
      routes.map((route) => baseUrl + route.path),
    );
    throw Error(`PortalLayout NavBar: Unknown route ${pathname}`);
  }

  return (
    <Tabs defaultValue={route.path} className="">
      <TabsList>
        {routes.map((el) => (
          <TabsTrigger key={el.path} value={el.path}>
            {el.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {routes.map((el) => (
        <TabsContent key={el.path} value={el.path}>
          {el.path !== route.path && <Navigate to={baseUrl + el.path} />}
        </TabsContent>
      ))}
    </Tabs>
  );
}
