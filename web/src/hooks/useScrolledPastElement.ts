import { useEffect, useState } from 'react';

export function useScrolledPastElement(selector: string, offset = 0): boolean {
  const [hasScrolledPast, setHasScrolledPast] = useState(false);

  useEffect(() => {
    const target = document.querySelector<HTMLElement>(selector);
    if (!target) return;

    const handleScroll = () => {
      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const currentScroll = window.scrollY + offset;
      setHasScrolledPast(currentScroll >= targetTop);
    };

    // Run on mount in case the page is already scrolled
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selector, offset]);

  return hasScrolledPast;
}
