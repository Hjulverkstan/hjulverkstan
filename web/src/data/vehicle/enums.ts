import {
  AlertCircle,
  Baby,
  Bike,
  CircleDashed,
  CircleFadingPlus,
  CircleSlash,
  HelpCircle,
  Warehouse,
} from 'lucide-react';

import { createFindFn, createMatchFn } from '../enums';
import {
  VehicleType,
  BikeType,
  StrollerType,
  VehicleStatus,
  BrakeType,
  BikeSize,
  BikeBrand,
} from './types';

//

export const vehicleType = [
  {
    dataKey: 'vehicleType',
    value: VehicleType.BIKE,
    label: 'Bike',
    icon: Bike,
    children: Object.values(BikeType),
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.STROLLER,
    label: 'Stroller',
    icon: Baby,
    children: Object.values(StrollerType),
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.SCOOTER,
    label: 'Scooter',
    icon: AlertCircle,
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.SKATE,
    label: 'Skate',
    icon: AlertCircle,
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.BATCH,
    label: 'Batch',
    icon: Warehouse,
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.OTHER,
    label: 'Other',
    icon: HelpCircle,
  },
];

export const bikeType = [
  { dataKey: 'bikeType', value: BikeType.BMX, label: 'BMX' },
  { dataKey: 'bikeType', value: BikeType.CHILD, label: 'Child' },
  { dataKey: 'bikeType', value: BikeType.ELECTRIC, label: 'Electric' },
  { dataKey: 'bikeType', value: BikeType.HYBRID, label: 'Hybrid' },
  { dataKey: 'bikeType', value: BikeType.LADY, label: 'Lady' },
  { dataKey: 'bikeType', value: BikeType.MOUNTAINBIKE, label: 'Mountain' },
  { dataKey: 'bikeType', value: BikeType.ROAD, label: 'Road' },
];

export const strollerType = [
  { dataKey: 'strollerType', value: StrollerType.SINGLE, label: 'Single' },
  { dataKey: 'strollerType', value: StrollerType.DOUBLE, label: 'Double' },
];

export const vehicleStatus = [
  {
    dataKey: 'vehicleStatus',
    value: VehicleStatus.AVAILABLE,
    label: 'Available',
    variant: 'successOutline',
    icon: CircleFadingPlus,
  },
  {
    dataKey: 'vehicleStatus',
    value: VehicleStatus.UNAVAILABLE,
    label: 'Unavailable',
    variant: 'outline',
    icon: CircleDashed,
  },
  {
    dataKey: 'vehicleStatus',
    value: VehicleStatus.BROKEN,
    label: 'Broken',
    variant: 'destructiveOutline',
    icon: CircleSlash,
  },
];

export const brakeType = [
  { dataKey: 'brakeType', value: BrakeType.CALIPER, label: 'Caliper' },
  { dataKey: 'brakeType', value: BrakeType.DISC, label: 'Disc' },
  { dataKey: 'brakeType', value: BrakeType.FOOTBRAKE, label: 'Footbrake' },
];

export const size = [
  { dataKey: 'size', value: BikeSize.EXTRA_SMALL, label: 'XS' },
  { dataKey: 'size', value: BikeSize.SMALL, label: 'S' },
  { dataKey: 'size', value: BikeSize.MEDIUM, label: 'M' },
  { dataKey: 'size', value: BikeSize.LARGE, label: 'L' },
  { dataKey: 'size', value: BikeSize.EXTRA_LARGE, label: 'XL' },
];

export const brand = [
  { dataKey: 'brand', value: BikeBrand.MONARK, label: 'Monark' },
  { dataKey: 'brand', value: BikeBrand.SKEPPSHULT, label: 'Skeppshult' },
  { dataKey: 'brand', value: BikeBrand.YOSEMITE, label: 'Yosemite' },
  { dataKey: 'brand', value: BikeBrand.CRESCENT, label: 'Crescent' },
  { dataKey: 'brand', value: BikeBrand.SPECIALIZED, label: 'Specialized' },
  { dataKey: 'brand', value: BikeBrand.NISHIKI, label: 'Nishiki' },
  { dataKey: 'brand', value: BikeBrand.SJOSALA, label: 'Sjösala' },
  { dataKey: 'brand', value: BikeBrand.KRONAN, label: 'Kronan' },
  { dataKey: 'brand', value: BikeBrand.PELAGO, label: 'Pelago' },
  { dataKey: 'brand', value: BikeBrand.BIANCHI, label: 'Bianchi' },
  { dataKey: 'brand', value: BikeBrand.OTHER, label: 'Other' },
];

//

export const all = [
  ...vehicleType,
  ...bikeType,
  ...strollerType,
  ...vehicleStatus,
  ...brakeType,
  ...size,
  ...brand,
];

export const find = createFindFn(all);
export const matchFn = createMatchFn(all);
