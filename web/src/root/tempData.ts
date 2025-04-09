import { Story } from '@data/webedit/story/types';

// This file contains tmp data until it is provided by web edit

export interface Partner {
  name: string;
  src: string;
}

export const partners = [
  {
    name: 'Familjebostäder',
    src: '/partners/familjebostader.svg',
  },
  { name: 'Poseidon', src: '/partners/poseidon.svg' },
  {
    name: 'Bostadsbolaget',
    src: '/partners/bostadsbolaget.svg',
  },
  { name: 'Framtiden', src: '/partners/framtiden.png' },
  {
    name: 'Alten',
    src: '/partners/alten.svg',
  },
  { name: 'Göteborgsstad', src: '/partners/goteborgstad.svg' },
  {
    name: 'Volvo',
    src: '/partners/volvo.svg',
  },
  { name: 'Familjebostäder', src: '/partners/familjebostader.svg' },
] as Partner[];

export const stories = [
  {
    id: '1',
    imageURL: '/hero.jpg',
    title: 'New shop opens in Hjällbo',
    slug: 'new-shop-in-hjallbo',
    bodyText:
      "Why support us? Your generosity directly supports initiatives that make cycling accessible to all. Whether it's...",
  },
  {
    id: '2',
    imageURL: '/hero.jpg',
    title: 'New shop opens in Hjällbo',
    slug: 'new-shop-in-hjallbo-2',
    bodyText:
      "Why support us? Your generosity directly supports initiatives that make cycling accessible to all. Whether it's...",
  },
  {
    id: '3',
    title: 'IKEA rebuilds our latest shop.arhogun awrhg åoawin ..',
    slug: 'ikea-rebuild-latest-shop',
    bodyText:
      'With our new opening we needed to improve the someting thatWith our new opening we needed to improve the someting...',
  },
  {
    id: '4',
    title: '140 bikes saved this month',
    slug: '140-bikes-saved',
    bodyText:
      'With our new opening we needed to improve the someting thatWith our new opening we needed to improve the someting...',
  },
] as Story[];
