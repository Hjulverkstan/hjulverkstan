import {
  BabyIcon,
  Bike,
  CircleDashed,
  CircleFadingPlus,
  CircleSlash,
  Compass,
  LucideIcon,
  Package,
  Wrench,
  Warehouse,
  HelpCircle,
  AlertCircle,
  Store,
} from 'lucide-react';

import { Row } from '@components/DataTable';
import {
  TicketType,
  BrakeType,
  VehicleStatus,
  VehicleType,
  BikeSize,
  BikeType,
  StrollerType,
  BikeBrand,
  LocationType,
} from '@api';

//

export interface EnumAttributes {
  value: string;
  name: string;
  icon?: LucideIcon;
  /* Following fields aggregated in some bussines logic down the line */
  children?: string[];
  count?: number;
  dataKey?: string;
}

export interface RowEnumAttrMap {
  [key: string]: EnumAttributes[];
}

/**
 * Used to create a matchFn used by <DataTable.FilterSearch />. While we can
 * match any word on any fields we find on a row, with enums we want to match on
 * the localised name and not its enum value. Also when matching on enums the
 * word should start with the enum. For instance searching 'avail' should not
 * match for 'unavail'...
 */

export const enumMatchFn = (enumMap: RowEnumAttrMap, word: string, row: Row) =>
  Object.entries(enumMap).some(([key, enums]) =>
    enums.some(
      (el) => el.value === row[key] && el.name.toLowerCase().startsWith(word),
    ),
  );

export const toLabel = (enums: EnumAttributes[], key: string) => {
  const enumAttr = enums.find(({ value }) => value === key);

  if (!enumAttr)
    throw Error(
      `toLabel was given a key [${key}] that was not the options [${enums.map((e) => e.value).join()}]`,
    );

  return { name: enumAttr.name, icon: enumAttr.icon };
};

// Vehicle

// Shorthand so that enum atrributes can be onelines:

const VS = VehicleStatus;
const VT = VehicleType;

export const vehicle = {
  vehicleType: [
    {
      value: VT.BIKE,
      name: 'Bike',
      icon: Bike,
      children: Object.values(BikeType),
    },
    {
      value: VT.STROLLER,
      name: 'Stroller',
      icon: BabyIcon,
      children: Object.values(StrollerType),
    },
    { value: VT.SCOOTER, name: 'Scooter', icon: AlertCircle },
    { value: VT.SKATE, name: 'Skate', icon: AlertCircle },
    { value: VT.BATCH, name: 'Batch', icon: Warehouse },
    { value: VT.OTHER, name: 'Other', icon: HelpCircle },
  ],
  bikeType: [
    { value: BikeType.BMX, name: 'BMX' },
    { value: BikeType.CHILD, name: 'Child' },
    { value: BikeType.ELECTRIC, name: 'Electric' },
    { value: BikeType.HYBRID, name: 'Hybrid' },
    { value: BikeType.LADY, name: 'Lady' },
    { value: BikeType.MOUNTAINBIKE, name: 'Mountain' },
    { value: BikeType.ROAD, name: 'Road' },
  ],
  strollerType: [
    { value: StrollerType.SINGLE, name: 'Single' },
    { value: StrollerType.DOUBLE, name: 'Double' },
  ],
  vehicleStatus: [
    { value: VS.AVAILABLE, name: 'Available', icon: CircleFadingPlus },
    { value: VS.UNAVAILABLE, name: 'Unavailable', icon: CircleDashed },
    { value: VS.BROKEN, name: 'Broken', icon: CircleSlash },
  ],
  brakeType: [
    { value: BrakeType.CALIPER, name: 'Caliper' },
    { value: BrakeType.DISC, name: 'Disc' },
    { value: BrakeType.FOOTBRAKE, name: 'Footbrake' },
  ],
  size: [
    { value: BikeSize.EXTRA_SMALL, name: 'XS' },
    { value: BikeSize.SMALL, name: 'S' },
    { value: BikeSize.MEDIUM, name: 'M' },
    { value: BikeSize.LARGE, name: 'L' },
    { value: BikeSize.EXTRA_LARGE, name: 'XL' },
  ],
  brand: [
    { value: BikeBrand.MONARK, name: 'Monark' },
    { value: BikeBrand.SKEPPSHULT, name: 'Skeppshult' },
    { value: BikeBrand.YOSEMITE, name: 'Yosemite' },
    { value: BikeBrand.CRESCENT, name: 'Crescent' },
    { value: BikeBrand.SPECIALIZED, name: 'Specialized' },
    { value: BikeBrand.NISHIKI, name: 'Nishiki' },
    { value: BikeBrand.SJOSALA, name: 'Sjösala' },
    { value: BikeBrand.KRONAN, name: 'Kronan' },
    { value: BikeBrand.PELAGO, name: 'Pelago' },
    { value: BikeBrand.BIANCHI, name: 'Bianchi' },
    { value: BikeBrand.OTHER, name: 'Other' },
  ],
};

// Tickets

export const ticket = {
  type: [
    { value: TicketType.RENT, name: 'Rent', icon: Compass },
    { value: TicketType.REPAIR, name: 'Repair', icon: Wrench },
    { value: TicketType.DONATE, name: 'Donate', icon: Package },
  ],
};

// Tickets

export const location = {
  locationType: [
    { value: LocationType.SHOP, name: 'Shop', icon: Store },
    { value: LocationType.STORAGE, name: 'Storage', icon: Warehouse },
  ],
};
