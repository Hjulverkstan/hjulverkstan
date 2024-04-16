import {
  BabyIcon,
  Bike,
  CircleDashed,
  CircleFadingPlus,
  CircleSlash,
  Compass,
  HandMetal,
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
  ScooterType,
} from '@api';

//

export const toLabel = (options: FilterOption[], key: string) => {
  const option = options.find(({ value }) => value === key);

  if (!option)
    throw Error(
      `toLabel was given a key [${key}] that was not the options [${options.map((o) => o.value).join()}]`,
    );

  return option;
};

//

export const vehicleTypeOptions = [
  { value: VehicleType.BIKE, name: 'Bike', icon: Bike },
  { value: VehicleType.STROLLER, name: 'Stroller', icon: BabyIcon },
  { value: VehicleType.SCOOTER, name: 'Scooter', icon: HandMetal },
];

export const vehicleStatusOptions = [
  { value: VehicleStatus.AVAILABLE, name: 'Available', icon: CircleFadingPlus },
  { value: VehicleStatus.UNAVAILABLE, name: 'Unavailable', icon: CircleDashed },
  { value: VehicleStatus.BROKEN, name: 'Broken', icon: CircleSlash },
];

export const ticketTypeOptions = [
  { value: TicketType.RENT, name: 'Rent', icon: Compass },
  { value: TicketType.REPAIR, name: 'Repair', icon: Wrench },
  { value: TicketType.DONATE, name: 'Donate', icon: Package },
];

export const brakeTypeOptions = [
  { value: BrakeType.CALIPER, name: 'Caliper' },
  { value: BrakeType.DISC, name: 'Disc' },
  { value: BrakeType.FOOTBRAKE, name: 'Footbrake' },
];

export const sizeOptions = [
  { value: BikeSize.EXTRA_SMALL, name: 'XS' },
  { value: BikeSize.SMALL, name: 'S' },
  { value: BikeSize.MEDIUM, name: 'M' },
  { value: BikeSize.LARGE, name: 'L' },
  { value: BikeSize.EXTRA_LARGE, name: 'XL' },
];

export const bikeTypeOptions = [
  { value: BikeType.BMX, name: 'BMX' },
  { value: BikeType.CHILD, name: 'Child' },
  { value: BikeType.ELECTRIC, name: 'Electric' },
  { value: BikeType.HYBRID, name: 'Hybrid' },
  { value: BikeType.LADY, name: 'Lady' },
  { value: BikeType.MOUNTAINBIKE, name: 'Mountain' },
  { value: BikeType.ROAD, name: 'Road' },
];

export const strollerTypeOptions = [
  { value: StrollerType.SINGLE, name: 'Single' },
  { value: StrollerType.DOUBLE, name: 'Double' },
];

export const scooterTypeOptions = [
  { value: ScooterType.STANDARD, name: 'Standard' },
  { value: ScooterType.ELECTRIC, name: 'Electric' },
  { value: ScooterType.STUNT, name: 'Stunt' },
  { value: ScooterType.OFF_ROAD, name: 'Off road' },
];
