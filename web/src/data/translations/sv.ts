import { BikeBrand, BikeSize, BikeType, BrakeType } from '@data/vehicle/types';

export default {
  home: 'Hem',
  shops: 'Verkstäder',
  services: 'Tjänster',
  stories: 'Berättelser',
  support: 'Support',
  contact: 'Kontakt',

  homeTitle: 'Hjulverkstan',
  aboutTitle: 'Hjulverkstan - Om oss',
  contactTitle: 'Hjulverkstan - Kontakt',
  shopsTitle: 'Hjulverkstan - Verkstäder',
  vehicleDetailTitle: 'Hjulverkstan - Cyklar',
  supportTitle: 'Hjulverkstan - Support',
  servicesTitle: 'Hjulverkstan - Tjänster',
  storiesTitle: 'Hjulverkstan - Berättelser',
  portalTitle: 'Hjulverkstan - Portal',

  open: 'Öppet',
  closed: 'Stängt',
  rent: 'Hyr',
  rentAria: 'Hyr den här cykeln',

  communityLinkLabel: 'Arbeta med oss',
  storiesLinkLabel: 'Se alla berättelser',
  shopsLinkLabel: 'Se alla verkstäder',

  joinUsHeading: 'Bli en av oss',
  contactUsLinkLabel: 'Kontakta oss',

  partnerHeading: 'Våra partners',
  partnerLinkLabel: 'Se alla partners',

  footerSCBody: 'initiativ av',
  footerSCLinkLabel: 'Rädda Barnen',
  footerDevelopBody: 'utvecklat av',
  footerDevelopLinkLabel: 'ALTEN Sverige',
  footerOpenSourceBody: 'öppen källkod på',
  footerOpenSourceLinkLabel: 'GitHub',

  bikeTypeLabel: 'Cykeltyp',
  brandLabel: 'Märke',
  brakeTypeLabel: 'Bromsar',
  gearCountLabel: 'Växlar',
  sizeLabel: 'Storlek',
  regTagLabel: 'Reg.nr',

  [BikeType.MOUNTAINBIKE]: 'Mountainbike',
  [BikeType.ROAD]: 'Landsvägscykel',
  [BikeType.CHILD]: 'Barncykel',
  [BikeType.ELECTRIC]: 'Elcykel',
  [BikeType.HYBRID]: 'Hybridcykel',
  [BikeType.BMX]: 'BMX',
  [BikeType.LADY]: 'Damcykel',

  [BikeBrand.MONARK]: 'Monark',
  [BikeBrand.SKEPPSHULT]: 'Skeppshult',
  [BikeBrand.YOSEMITE]: 'Yosemite',
  [BikeBrand.CRESCENT]: 'Crescent',
  [BikeBrand.SPECIALIZED]: 'Specialized',
  [BikeBrand.NISHIKI]: 'Nishiki',
  [BikeBrand.SJOSALA]: 'Sjösala',
  [BikeBrand.KRONAN]: 'Kronan',
  [BikeBrand.PELAGO]: 'Pelago',
  [BikeBrand.BIANCHI]: 'Bianchi',
  [BikeBrand.OTHER]: 'Annat',

  [BrakeType.FOOTBRAKE]: 'Fotbroms',
  [BrakeType.CALIPER]: 'Fälgbroms',
  [BrakeType.DISC]: 'Skivbroms',

  [BikeSize.EXTRA_SMALL]: 'Extra liten',
  [BikeSize.SMALL]: 'Liten',
  [BikeSize.MEDIUM]: 'Medium',
  [BikeSize.LARGE]: 'Stor',
  [BikeSize.EXTRA_LARGE]: 'Extra stor',
} as const;
