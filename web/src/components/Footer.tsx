import React from 'react';
import { ArrowRight } from 'lucide-react';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { Link as RouterLink } from '@components/shadcn/Button';
import { Link } from 'react-router-dom';

interface Shop {
  name: string;
  address: string;
}

interface FooterLinkProps {
  to: string;
  imgSrc: string;
  imgAlt: string;
  text: string;
  linkLabel: string;
}

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shops', path: '/shops' },
  { name: 'Services', path: '/services' },
  { name: 'Stories', path: '/stories' },
  { name: 'Support', path: '/support' },
  { name: 'Contact', path: '/contact' },
];

function FooterLink({ to, imgSrc, imgAlt, text, linkLabel }: FooterLinkProps) {
  return (
    <div className="flex items-center gap-2">
      <span>{text}</span>
      <RouterLink
        to={to}
        target="_blank"
        rel="noopener noreferrer"
        variant="link"
        className="flex items-center gap-1 font-semibold text-gray-700
          hover:underline"
      >
        <img src={imgSrc} alt={imgAlt} className="h-4 w-auto" />
        <span>{linkLabel}</span>
      </RouterLink>
    </div>
  );
}

interface ShopCardProps {
  shop: Shop;
}

function ShopCard({ shop }: ShopCardProps) {
  const addressParts = shop.address.split(',');
  return (
    <div className="flex flex-col items-center lg:items-start">
      <div
        className="mb-1 inline-flex cursor-pointer items-center gap-1
          font-semibold text-black"
      >
        <span>{shop.name}</span>
        <ArrowRight className="h-4 w-4" />
      </div>
      <p className="text-sm">{addressParts[0]}</p>
      {addressParts[1] && <p className="text-sm">{addressParts[1].trim()}</p>}
      <div className="mt-2">
        <p className="text-sm">{'placeholderphone'}</p>
      </div>
      <div className="mt-2">
        <p className="text-sm font-semibold text-green-600">Open</p>
      </div>
    </div>
  );
}

function FooterText() {
  return (
    <div
      className="flex flex-col items-center gap-4 text-sm text-gray-600
        md:flex-row md:gap-6 md:text-base"
    >
      <FooterLink
        to="https://www.savethechildren.net"
        imgSrc="/stc.svg"
        imgAlt="Save the Children"
        text="initiative by"
        linkLabel="Save the Children"
      />

      <div className="hidden h-4 border-l border-gray-300 md:block" />

      <FooterLink
        to="https://www.alten.se"
        imgSrc="/alten.svg"
        imgAlt="ALTEN Sweden"
        text="development by"
        linkLabel="ALTEN Sweden"
      />

      <div className="hidden h-4 border-l border-gray-300 md:block" />

      <FooterLink
        to="https://github.com/Hjulverkstan"
        imgSrc="/github.svg"
        imgAlt="GitHub"
        text="open source on"
        linkLabel="GitHub"
      />
    </div>
  );
}

function FooterShop() {
  const { data } = usePreloadedDataLocalized();
  const shops: Shop[] = data?.shop || [];

  return (
    <div
      className="grid w-full grid-cols-1 gap-x-8 gap-y-10 text-center
        sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:text-left"
    >
      {shops.map((shop) => (
        <ShopCard key={shop.name} shop={shop} />
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      className="flex flex-col items-center gap-12 bg-[#F0F0F0] px-4 py-10
        md:gap-16 md:px-8 md:py-16 lg:px-16 lg:py-20"
    >
      <div className="flex w-full justify-center">
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 rounded-full
            bg-white px-6 py-3 text-sm text-gray-700 md:gap-8 md:px-8"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="cursor-pointer hover:underline"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="w-full border-t border-gray-300" aria-hidden="true" />

      <FooterShop />

      <div className="w-full border-t border-gray-300" aria-hidden="true" />

      <FooterText />
    </footer>
  );
}
