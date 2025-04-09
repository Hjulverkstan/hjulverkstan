import React from 'react';
import { ArrowRight } from 'lucide-react';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { Link, Link as RouterLink } from '@components/shadcn/Button';
import type { Shop } from '@data/webedit/shop/types';
import { OpenBadge } from '@components/OpenBadge';
import { cn } from '@utils';

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
    <div className="ml-4 flex items-center">
      <span>{text}</span>
      <RouterLink
        to={to}
        target="_blank"
        rel="noopener noreferrer"
        variant="link"
        className="text-foreground flex items-center gap-4 text-lg font-semibold
          hover:underline"
      >
        <img src={imgSrc} alt={imgAlt} className="h-8" />
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
    <div className="flex flex-col items-center gap-2 text-lg lg:items-start">
      <div
        className="text-foreground inline-flex cursor-pointer items-center gap-3
          font-bold"
      >
        <span>{shop.name}</span>
        <ArrowRight className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <p>{addressParts[0]}</p>
        {addressParts[1] && <p>{addressParts[1].trim()}</p>}
      </div>
      <div>
        <p>{'placeholderphone'}</p>
      </div>
      <div>
        <OpenBadge variant="minimal" openHours={shop.openHours} />
      </div>
    </div>
  );
}

function FooterText() {
  return (
    <div
      className="text-muted-foreground flex w-full flex-row flex-wrap
        items-center justify-center gap-x-3 gap-y-2 tracking-wide md:text-xl"
    >
      <FooterLink
        to="https://www.savethechildren.net"
        imgSrc="/stc.svg"
        imgAlt="Save the Children"
        text="initiative by"
        linkLabel="Save the Children"
      />
      <div className="border-divider h-10 border-l" />
      <FooterLink
        to="https://www.alten.se"
        imgSrc="/alten.svg"
        imgAlt="ALTEN Sweden"
        text="development by"
        linkLabel="ALTEN Sweden"
      />
      <div className="border-divider h-10 border-l" />
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
    <div className="flex w-full flex-wrap gap-x-8 gap-y-10">
      {shops.slice(0, 5).map((shop) => (
        <div
          key={shop.id || shop.name}
          className="flex-grow basis-full sm:basis-[47%] md:basis-[30%]
            lg:basis-[18%]"
        >
          <ShopCard shop={shop} />
        </div>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-surface-alt py-10 md:py-16 lg:py-20">
      <div
        className={cn(
          'mx-auto flex w-full max-w-[1920px] flex-col items-center gap-12 px-4',
          'md:gap-16 md:px-[140px]',
        )}
      >
        <div>
          <nav
            aria-label="Footer navigation"
            className="bg-card-gray text-muted-foreground flex flex-wrap
              justify-center gap-y-2 rounded-full px-4 py-4"
          >
            {navLinks.map((link) => (
              <Link
                variant="link"
                key={link.name}
                to={link.path}
                className="text-foreground text-lg font-normal hover:underline"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-divider w-full border-t" aria-hidden="true" />

        <FooterShop />

        <div className="border-divider w-full border-t" aria-hidden="true" />

        <FooterText />
      </div>
    </footer>
  );
}
