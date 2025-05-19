import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

import { IconButton, Link } from '@components/shadcn/Button';
import { useScrolledPastElement } from '@hooks/useScrolledPastElement';
import { cn } from '@utils';

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

export interface PageNavbarProps {
  hasHeroSection?: boolean;
}

export default function PageNavbar({ hasHeroSection }: PageNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scrolledPast = hasHeroSection
    ? useScrolledPastElement('section', 71)
    : false;
  const onHero = !scrolledPast && hasHeroSection && !isOpen;

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
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-colors duration-300',
        'bg-background text-foreground',
        onHero &&
          'text-background md:bg-background md:text-foreground bg-transparent',
      )}
    >
      <div
        className="container mx-auto flex items-center justify-between px-6 py-5
          lg:px-16"
      >
        <div
          className={cn(
            'relative text-2xl font-semibold transition-opacity duration-300',
            onHero && 'opacity-0 md:opacity-100',
          )}
        >
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
              border-b border-t px-2 py-12 sm:px-3"
          >
            {navLinksContent}
          </nav>
        </div>
      )}
    </header>
  );
}
