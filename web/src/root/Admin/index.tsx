import {
  Routes,
  Route,
  useLocation,
  Navigate,
  matchPath,
} from 'react-router-dom';

import Inventory from './Inventory';
import Welcome from './Welcome';
import { Separator } from '@components/ui/Separator';
import { Avatar, AvatarFallback } from '@components/ui/Avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';

const adminRoutes = [
  { path: '/', label: 'Start' },
  { path: '/inventory', label: 'Inventory' },
];

export default function Admin() {
  return (
    <>
      <AdminHeader title="Shop" baseUrl="/admin" routes={adminRoutes} />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="inventory" element={<Inventory />} />
        </Routes>
      </div>
    </>
  );
}

//

interface NavRoute {
  label: string;
  path: string;
}

interface AdminNavProps {
  routes: NavRoute[];
  baseUrl: string;
  title: string;
}

function AdminHeader({ title, ...rest }: AdminNavProps) {
  return (
    <div className="px-4 pb-2 pt-4">
      <nav className="pb-3">
        <div className="flex items-center justify-center space-x-4">
          <h2 className="flex-1 text-lg font-semibold">
            Hjulverkstan
            <span className="font-normal text-muted-foreground"> {title}</span>
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
  );
}

interface NavBarProps {
  baseUrl: string;
  routes: NavRoute[];
}

function NavBar({ baseUrl, routes }: NavBarProps) {
  const { pathname } = useLocation();
  const { path } = routes.find((route) =>
    matchPath(baseUrl + route.path, pathname),
  )!;

  return (
    <Tabs defaultValue={path} className="">
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
