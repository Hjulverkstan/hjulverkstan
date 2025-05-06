import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

import { IconButton, Link } from '@components/shadcn/Button';

export const navLinks = [
  { name: 'Home', path: '/' },
  {
    name: 'Shops',
    path: '/shops',
  },
  { name: 'Services', path: '/services' },
  {
    name: 'Stories',
    path: '/stories',
  },
  { name: 'Support', path: '/support' },
  {
    name: 'Contact',
    path: '/contact',
  },
];

export default function PageNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinksContent = navLinks.map((link, i) => (
    <Link
      key={link.name}
      to={link.path}
      variant={i === navLinks.length - 1 ? 'default' : 'link'}
      size={i === navLinks.length - 1 ? 'default' : 'none'}
      subVariant="rounded"
      onClick={() => setIsOpen(false)}
    >
      {link.name}
    </Link>
  ));

  return (
    <header className="bg-background fixed w-full top-0 z-50">
      <div
        className="container mx-auto flex items-center justify-between px-6 py-5
          lg:px-16"
      >
        <div className="text-foreground relative text-2xl font-semibold">
          Hjulverkstan
        </div>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinksContent}
        </nav>

        <IconButton
          className="-my-1 -mr-2 md:hidden"
          onClick={() => setIsOpen((x) => !x)}
          aria-label="Toggle menu"
          variant="ghost"
          size="large"
          icon={isOpen ? X : Menu}
        />
      </div>

      {isOpen && (
        <div className="md:hidden">
          <nav
            className="border-muted flex flex-col items-center gap-6 space-y-1
              border-t border-b px-2 py-12 sm:px-3"
          >
            {navLinksContent}
          </nav>
        </div>
      )}
    </header>
  );
}
