import React from 'react';
import { ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { Link } from '@components/shadcn/Button';
import type { Shop } from '@data/webedit/shop/types';
import { OpenBadge } from '@components/OpenBadge';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { SectionContent } from '@components/SectionContent';
import { useTranslations } from '@hooks/useTranslations';
import { navLinks } from '@components/PageNavbar';

//

interface FooterLinkProps {
  to: string;
  imgSrc: string;
  text: string;
  linkLabel: string;
}

function FooterLink({ to, imgSrc, text, linkLabel }: FooterLinkProps) {
  return (
    <div className="flex items-center gap-5 text-base">
      <span className="font-dm-mono">{text}</span>
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground flex items-center gap-3 font-medium
          hover:opacity-80"
      >
        <img src={imgSrc} alt={text} className="h-7" />
        <span>{linkLabel}</span>
      </a>
    </div>
  );
}

//

interface ShopCardProps {
  shop: Shop;
}

function ShopCard({ shop }: ShopCardProps) {
  const fullAddress = shop.address || '';

  const parts = fullAddress.split(',');
  const street = parts[0];
  const city = parts[1];

  return (
    <div className="flex flex-col items-start gap-2 text-lg">
      <NavLink to={`/shops/${shop.slug}`}>
        <div
          className="text-foreground transition-gap group inline-flex
            items-center gap-1.5 font-bold hover:opacity-80"
        >
          <span>{shop.name}</span>
          <ArrowRight className="h-5 w-5 transition-all group-hover:ml-0.5" />
        </div>
      </NavLink>

      <div className="space-y-1">
        <p>
          {street}

          {city ? (
            <>
              ,<br className="hidden sm:block" />
              {city.trim()}
            </>
          ) : null}
        </p>
      </div>

      <div>
        <p>070 123 45 67</p>
      </div>
      <div>
        <OpenBadge variant="minimal" openHours={shop.openHours} />
      </div>
    </div>
  );
}
//

const FooterDivider = () => (
  <SectionContent>
    <div className="border-border-dark w-full border-t" aria-hidden="true" />
  </SectionContent>
);

//

export default function PageFooter() {
  const { data } = usePreloadedDataLocalized();

  const { t } = useTranslations();

  return (
    <footer className="bg-secondary flex flex-col gap-16 py-32">
      <SectionContent className="flex justify-center">
        <nav
          aria-label="Footer navigation"
          className="bg-muted text-muted-foreground flex flex-wrap
            justify-center gap-y-2 rounded-full px-6 py-3"
        >
          {navLinks.map((link) => (
            <Link variant="link" key={link.translationKey} to={link.path}>
              {t(link.translationKey)}
            </Link>
          ))}
        </nav>
      </SectionContent>

      <FooterDivider />

      <SectionContent
        className="grid grid-cols-[repeat(auto-fit,_minmax(16rem,_1fr))] gap-x-8
          gap-y-10"
      >
        {data.shops.slice(0, 5).map((shop) => (
          <div
            key={shop.id || shop.name}
            className="flex-grow basis-full sm:basis-[47%] md:basis-[30%]
              lg:basis-[18%]"
          >
            <ShopCard shop={shop} />
          </div>
        ))}
      </SectionContent>

      <FooterDivider />

      <SectionContent
        className="text-muted-foreground flex w-full flex-col items-center
          justify-center gap-8 xl:flex-row"
      >
        <FooterLink
          to="https://www.savethechildren.net"
          imgSrc="/icons/stc.svg"
          text={t('footerSaveTheChildrenBody')}
          linkLabel={t('footerSaveTheChildrenLinkLabel')}
        />
        <div className="border-border hidden h-10 border-l xl:block" />
        <FooterLink
          to="https://www.alten.se"
          imgSrc="/icons/alten.svg"
          text={t('footerDevelopBody')}
          linkLabel={t('footerDevelopLinkLabel')}
        />
        <div className="border-border hidden h-10 border-l xl:block" />
        <FooterLink
          to="https://github.com/Hjulverkstan"
          imgSrc="/icons/github.svg"
          text={t('footerOpenSourceBody')}
          linkLabel={t('footerOpenSourceLinkLabel')}
        />
      </SectionContent>
    </footer>
  );
}
