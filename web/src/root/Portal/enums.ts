import {
  BabyIcon,
  Bike,
  CircleDashed,
  CircleFadingPlus,
  CircleSlash,
  Compass,
  HandMetal,
  LucideIcon,
  Package,
  Wrench,
} from 'lucide-react';

import { FilterOption } from '@components/FacetedFilterDropdown';
import {
  TicketType,
  BrakeType,
  VehicleStatus,
  VehicleType,
  BikeSize,
  BikeType,
  StrollerType,
} from '@api';
import { Row } from '@components/DataTable';

//

export interface EnumAttributes {
  value: string;
  name: string;
  icon?: LucideIcon;
}

export type RowEnumAttributesMap<DataObj extends Record<string, any>> = Record<
  keyof DataObj,
  EnumAttributes[]
>;

/**
 * Used to create a matchFn used by <DataTable.FilterSearch />. While we can
 * match any word on any fields we find on a row, with enums we want to match on
 * the localised name and not its enum value. Also when matching on enums the
 * word should start with the enum. For instance searching 'avail' should not
 * match for 'unavail'...
 */

export const enumMatchFn = (
  enumMap: RowEnumAttributesMap<Row>,
  word: string,
  row: Row,
) =>
  Object.entries(enumMap).some(([key, enums]) =>
    enums.some(
      (el) => el.value === row[key] && el.name.toLowerCase().startsWith(word),
    ),
  );

export const toLabel = (options: FilterOption[], key: string) => {
  const option = options.find(({ value }) => value === key);

  if (!option)
    throw Error(
      `toLabel was given a key [${key}] that was not the options [${options.map((o) => o.value).join()}]`,
    );

  return option;
};

// Vehicle

const VS = VehicleStatus; // Lets keep enums bellow 80 chars as well :)

export const vehicle = {
  vehicleType: [
    { value: VehicleType.BIKE, name: 'Bike', icon: Bike },
    { value: VehicleType.STROLLER, name: 'Stroller', icon: BabyIcon },
    { value: VehicleType.SCOOTER, name: 'Scooter', icon: HandMetal },
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
};

// Tickets

export const ticket = {
  type: [
    { value: TicketType.RENT, name: 'Rent', icon: Compass },
    { value: TicketType.REPAIR, name: 'Repair', icon: Wrench },
    { value: TicketType.DONATE, name: 'Donate', icon: Package },
  ],
};
