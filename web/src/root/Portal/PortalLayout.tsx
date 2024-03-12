import { Button } from '@components/ui/Button';
import { Avatar, AvatarFallback } from '@components/ui/Avatar';
import { Separator } from '@components/ui/Separator';
import { matchPath, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';

export interface NavRoute {
  label: string;
  path: string;
}

export interface PortalLayoutProps {
  routes: NavRoute[];
  baseUrl: string;
  title: string;
}

export default function PortalLayout({ title, ...rest }: PortalLayoutProps) {
  return (
    <>
      <div className="px-4 pb-2 pt-4">
        <nav className="pb-3">
          <div className="flex items-center justify-center space-x-4">
            <h2 className="flex-1 text-lg font-semibold">
              Hjulverkstan
              <span className="font-normal text-muted-foreground">
                {' '}
                {title}
              </span>
            </h2>
            <div className="flex-shrink">
              {' '}
              <NavBar {...rest} />{' '}
            </div>
            <div className="flex flex-1 justify-end">
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

  const route = routes.find((route) =>
    matchPath(baseUrl + route.path, pathname),
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
          <Navigate to={baseUrl + el.path} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
