import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from '@components/shadcn/Button';
import { cn } from '@utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shops', path: '/shops' },
    { name: 'Services', path: '/services' },
    { name: 'Stories', path: '/stories' },
    { name: 'Support', path: '/support' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-background sticky top-0 z-50">
      <div
        className="container mx-auto flex h-[84px] items-center justify-between
          px-4 lg:px-16"
      >
        <div
          className="text-foreground relative bottom-[5px] text-[26px]
            font-semibold"
        >
          Hjulverkstan
        </div>

        <nav className="font-inter hidden items-center gap-6 md:flex">
          {navLinks.map((link, index) => {
            const isLastLink = index === navLinks.length - 1;
            return (
              <Link
                key={link.name}
                to={link.path}
                variant={isLastLink ? 'defaultRounded' : 'link'}
                className={cn('text-base', !isLastLink && 'text-foreground')}
                onClick={handleNavClick}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground focus:ring-primary focus:outline-none
              focus:ring-2 focus:ring-inset"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <nav
            className="flex flex-col items-start space-y-1 px-2 pb-3 pt-2
              sm:px-3"
          >
            {navLinks.map((link, index) => {
              const isLastLink = index === navLinks.length - 1;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  variant={isLastLink ? 'defaultRounded' : 'link'}
                  className={cn(
                    'block rounded-md px-3 py-2 text-lg font-medium',
                    isLastLink
                      ? 'inline-flex w-auto items-center'
                      : 'text-foreground hover:bg-gray-50',
                  )}
                  onClick={handleNavClick}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
