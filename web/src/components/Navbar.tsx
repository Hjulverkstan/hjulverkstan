import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom'; // Using Link for both desktop and mobile views

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div
        className="container mx-auto flex h-16 items-center justify-between px-4
          sm:px-6 lg:px-8"
      >
        <div className="text-foreground text-xl font-bold">Hjulverkstan</div>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/shops" className="hover:underline">
            Shops
          </Link>
          <Link to="/services" className="hover:underline">
            Services
          </Link>
          <Link to="/stories" className="hover:underline">
            Stories
          </Link>
          <Link to="/support" className="hover:underline">
            Support
          </Link>
          <Link
            to="/contact"
            className="bg-primary text-primary-foreground hover:bg-primary/90
              rounded-full px-4 py-2 text-sm font-medium no-underline
              transition-colors"
          >
            Contact
          </Link>
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
            <Link
              to="/"
              onClick={handleNavClick}
              className="text-foreground block rounded-md px-3 py-2 text-base
                font-medium hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              to="/shops"
              onClick={handleNavClick}
              className="text-foreground block rounded-md px-3 py-2 text-base
                font-medium hover:bg-gray-50"
            >
              Shops
            </Link>
            <Link
              to="/services"
              onClick={handleNavClick}
              className="text-foreground block rounded-md px-3 py-2 text-base
                font-medium hover:bg-gray-50"
            >
              Services
            </Link>
            <Link
              to="/stories"
              onClick={handleNavClick}
              className="text-foreground block rounded-md px-3 py-2 text-base
                font-medium hover:bg-gray-50"
            >
              Stories
            </Link>
            <Link
              to="/support"
              onClick={handleNavClick}
              className="text-foreground block rounded-md px-3 py-2 text-base
                font-medium hover:bg-gray-50"
            >
              Support
            </Link>
            <Link
              to="/contact"
              onClick={handleNavClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90
                mt-2 block rounded-full px-4 py-2 text-center text-base
                font-medium no-underline transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
