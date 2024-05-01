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
    name: 'Bike',
    icon: Bike,
    children: Object.values(BikeType),
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.STROLLER,
    name: 'Stroller',
    icon: Baby,
    children: Object.values(StrollerType),
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.SCOOTER,
    name: 'Scooter',
    icon: AlertCircle,
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.SKATE,
    name: 'Skate',
    icon: AlertCircle,
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.BATCH,
    name: 'Batch',
    icon: Warehouse,
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.OTHER,
    name: 'Other',
    icon: HelpCircle,
  },
];

export const bikeType = [
  { dataKey: 'bikeType', value: BikeType.BMX, name: 'BMX' },
  { dataKey: 'bikeType', value: BikeType.CHILD, name: 'Child' },
  { dataKey: 'bikeType', value: BikeType.ELECTRIC, name: 'Electric' },
  { dataKey: 'bikeType', value: BikeType.HYBRID, name: 'Hybrid' },
  { dataKey: 'bikeType', value: BikeType.LADY, name: 'Lady' },
  { dataKey: 'bikeType', value: BikeType.MOUNTAINBIKE, name: 'Mountain' },
  { dataKey: 'bikeType', value: BikeType.ROAD, name: 'Road' },
];

export const strollerType = [
  { dataKey: 'strollerType', value: StrollerType.SINGLE, name: 'Single' },
  { dataKey: 'strollerType', value: StrollerType.DOUBLE, name: 'Double' },
];

export const vehicleStatus = [
  {
    dataKey: 'vehicleStatus',
    value: VehicleStatus.AVAILABLE,
    name: 'Available',
    icon: CircleFadingPlus,
  },
  {
    dataKey: 'vehicleStatus',
    value: VehicleStatus.UNAVAILABLE,
    name: 'Unavailable',
    icon: CircleDashed,
  },
  {
    dataKey: 'vehicleStatus',
    value: VehicleStatus.BROKEN,
    name: 'Broken',
    icon: CircleSlash,
  },
];

export const brakeType = [
  { dataKey: 'brakeType', value: BrakeType.CALIPER, name: 'Caliper' },
  { dataKey: 'brakeType', value: BrakeType.DISC, name: 'Disc' },
  { dataKey: 'brakeType', value: BrakeType.FOOTBRAKE, name: 'Footbrake' },
];

export const size = [
  { dataKey: 'size', value: BikeSize.EXTRA_SMALL, name: 'XS' },
  { dataKey: 'size', value: BikeSize.SMALL, name: 'S' },
  { dataKey: 'size', value: BikeSize.MEDIUM, name: 'M' },
  { dataKey: 'size', value: BikeSize.LARGE, name: 'L' },
  { dataKey: 'size', value: BikeSize.EXTRA_LARGE, name: 'XL' },
];

export const brand = [
  { dataKey: 'brand', value: BikeBrand.MONARK, name: 'Monark' },
  { dataKey: 'brand', value: BikeBrand.SKEPPSHULT, name: 'Skeppshult' },
  { dataKey: 'brand', value: BikeBrand.YOSEMITE, name: 'Yosemite' },
  { dataKey: 'brand', value: BikeBrand.CRESCENT, name: 'Crescent' },
  { dataKey: 'brand', value: BikeBrand.SPECIALIZED, name: 'Specialized' },
  { dataKey: 'brand', value: BikeBrand.NISHIKI, name: 'Nishiki' },
  { dataKey: 'brand', value: BikeBrand.SJOSALA, name: 'Sjösala' },
  { dataKey: 'brand', value: BikeBrand.KRONAN, name: 'Kronan' },
  { dataKey: 'brand', value: BikeBrand.PELAGO, name: 'Pelago' },
  { dataKey: 'brand', value: BikeBrand.BIANCHI, name: 'Bianchi' },
  { dataKey: 'brand', value: BikeBrand.OTHER, name: 'Other' },
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
