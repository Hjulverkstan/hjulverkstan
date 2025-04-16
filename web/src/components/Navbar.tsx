import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@components/shadcn/Button'; // Using Link for both desktop and mobile views

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
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div
        className="container mx-auto flex h-16 items-center justify-between px-4
          sm:px-6 lg:px-8"
      >
        <div className="text-foreground text-xl font-bold">Hjulverkstan</div>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="hover:inline"
              onClick={handleNavClick}
            >
              {link.name}
            </Link>
          ))}
          <Button variant="defaultRounded">
            <Link to="/contact">Contact</Link>
          </Button>
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

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-4 py-2 text-sm text-gray-700
                  hover:bg-gray-100"
                onClick={handleNavClick}
              >
                {link.name}
              </Link>
            ))}
            <Button variant="defaultRounded">
              <Link to="/contact" onClick={handleNavClick}>
                Contact
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
