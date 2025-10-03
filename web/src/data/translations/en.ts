import { BikeBrand, BikeSize, BikeType, BrakeType } from '@data/vehicle/types';

export default {
  home: 'Home',
  shops: 'Shops',
  services: 'Services',
  stories: 'Stories',
  support: 'Support',
  contact: 'Contact',

  homeTitle: 'Hjulverkstan',
  aboutTitle: 'Hjulverkstan - About',
  contactTitle: 'Hjulverkstan - Contact',
  shopsTitle: 'Hjulverkstan - Shops',
  vehicleDetailTitle: 'Hjulverkstan - Vehicles',
  supportTitle: 'Hjulverkstan - Support',
  servicesTitle: 'Hjulverkstan - Services',
  storiesTitle: 'Hjulverkstan - Stories',
  portalTitle: 'Hjulverkstan - Portal',

  open: 'Open',
  closed: 'Closed',
  rent: 'Rent',
  rentAria: 'Rent this bike',

  communityLinkLabel: 'Work with us',
  storiesLinkLabel: 'See all stories',
  shopsLinkLabel: 'See all shops',

  joinUsHeading: 'Join us',
  contactUsLinkLabel: 'Contact us',

  partnerHeading: 'Our partners',
  partnerLinkLabel: 'See all partners',

  footerSCBody: 'initiative by',
  footerSCLinkLabel: 'Save the Children',
  footerDevelopBody: 'development by',
  footerDevelopLinkLabel: 'ALTEN Sweden',
  footerOpenSourceBody: 'open source on',
  footerOpenSourceLinkLabel: 'GitHub',

  bikeTypeLabel: 'Bike Type',
  brandLabel: 'Brand',
  brakeTypeLabel: 'Brakes',
  gearCountLabel: 'Gears',
  sizeLabel: 'Size',
  regTagLabel: 'Reg. No.',

  [BikeType.MOUNTAINBIKE]: 'Mountainbike',
  [BikeType.ROAD]: 'Road',
  [BikeType.CHILD]: 'Child',
  [BikeType.ELECTRIC]: 'Electric',
  [BikeType.HYBRID]: 'Hybrid',
  [BikeType.BMX]: 'BMX',
  [BikeType.LADY]: 'Lady',

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
  [BikeBrand.OTHER]: 'Other',

  [BrakeType.FOOTBRAKE]: 'Footbrake',
  [BrakeType.CALIPER]: 'Caliper',
  [BrakeType.DISC]: 'Disc',

  [BikeSize.EXTRA_SMALL]: 'Extra Small',
  [BikeSize.SMALL]: 'Small',
  [BikeSize.MEDIUM]: 'Medium',
  [BikeSize.LARGE]: 'Large',
  [BikeSize.EXTRA_LARGE]: 'Extra Large',
} as const;
