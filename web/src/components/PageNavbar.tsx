import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Globe, Menu, X } from 'lucide-react';

import { IconButton, Link } from '@components/shadcn/Button';
import * as Select from '@components/shadcn/Select';
import { useScrolledPastElement } from '@hooks/useScrolledPastElement';
import { cn } from '@utils/common';

import { useTranslations } from '@hooks/useTranslations';
import { useCurrentLocale } from '@hooks/useCurrentLocale';
import { usePreloadedData } from '@hooks/usePreloadedData';
import * as enums from '@data/translations/enums';
import { LangSlug } from '@data/webedit/types';
import { findEnum } from '@utils/enums';

export const navLinks = [
  { translationKey: 'home', path: '/' },
  {
    translationKey: 'shops',
    path: '/shops',
  },
  { translationKey: 'services', path: '/services' },
  {
    translationKey: 'stories',
    path: '/stories',
  },
  { translationKey: 'support', path: '/support' },
  {
    translationKey: 'contact',
    path: '/contact',
  },
] as const;

export interface PageNavbarProps {
  hasHeroSection?: boolean;
}

export default function PageNavbar({ hasHeroSection }: PageNavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currLocale = useCurrentLocale();
  const { locales } = usePreloadedData();

  const [isOpen, setIsOpen] = useState(false);
  const scrolledPast = hasHeroSection
    ? useScrolledPastElement('section', 71)
    : false;

  const onHero = !scrolledPast && hasHeroSection && !isOpen;

  const { t } = useTranslations();

  const handleLangSelect = (locale: LangSlug) => {
    const { pathname, search, hash } = location;

    const nonLocalisedPath = pathname.replace(
      new RegExp(`^/(?:${locales.join('|')})(?=/|$)`, 'i'),
      '',
    );

    navigate(`/${locale}${nonLocalisedPath}${search ?? ''}${hash ?? ''}`, {
      replace: true,
    });
  };

  const navLinksContent = navLinks.map((link, i) => (
    <Link
      key={link.translationKey}
      to={link.path}
      variant={i === navLinks.length - 1 ? 'default' : 'link'}
      subVariant="rounded"
      onClick={() => setIsOpen(false)}
      className="h-8 lg:last:ml-2"
    >
      {t(link.translationKey)}
    </Link>
  ));

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-colors duration-300',
        'bg-background text-foreground',
        onHero &&
          'text-background lg:bg-background lg:text-foreground bg-transparent',
      )}
    >
      <div
        className="container mx-auto flex items-center justify-between px-6 py-5
          lg:px-16"
      >
        <div
          className={cn(
            'relative text-2xl font-semibold transition-opacity duration-300',
            onHero && 'opacity-0 lg:opacity-100',
          )}
        >
          Hjulverkstan
        </div>
        <div className="flex items-center justify-end gap-6">
          <nav className="hidden items-center gap-2 lg:flex">
            {navLinksContent}
          </nav>
          <Select.Root value={currLocale} onValueChange={handleLangSelect}>
            <Select.Trigger className="h-8 rounded-full">
              <div className="px-1 lg:flex lg:items-center">
                <Globe
                  className="text-muted-foreground mr-2 hidden lg:inline-flex"
                  size={16}
                />
                <Select.Value />
              </div>
            </Select.Trigger>
            <Select.Content onCloseAutoFocus={(e) => e.preventDefault()}>
              {locales.map((value) => (
                <Select.Item value={value}>
                  {findEnum(enums, value).label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          <IconButton
            className="-mx-1 lg:hidden"
            onClick={() => setIsOpen((x) => !x)}
            aria-label="Toggle menu"
            variant="ghost"
            size="large"
            icon={isOpen ? X : Menu}
          />
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden">
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
