import {
  AlertCircle,
  Archive,
  Baby,
  Bike,
  Building,
  CircleDashed,
  CircleFadingPlus,
  CircleSlash,
  HelpCircle,
  UserCheck,
  Warehouse,
} from 'lucide-react';

import { createFindFn, createMatchFn } from '../enums';
import {
  BikeBrand,
  BikeSize,
  BikeType,
  BrakeType,
  StrollerType,
  VehicleStatus,
  VehicleType,
} from './types';

//

export const vehicleType = [
  {
    dataKey: 'vehicleType',
    value: VehicleType.BIKE,
    label: 'Bike',
    icon: Bike,
    children: Object.values(BikeType),
    generalContentKey: 'vehicleTypeBike',
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.STROLLER,
    label: 'Stroller',
    icon: Baby,
    children: Object.values(StrollerType),
    generalContentKey: 'vehicleTypeStroller',
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.SCOOTER,
    label: 'Scooter',
    icon: AlertCircle,
    generalContentKey: 'vehicleTypeScooter',
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.SKATE,
    label: 'Skate',
    icon: AlertCircle,
    generalContentKey: 'vehicleTypeSkate',
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.BATCH,
    label: 'Batch',
    icon: Warehouse,
    generalContentKey: 'vehicleTypeBatch',
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.OTHER,
    label: 'Other',
    icon: HelpCircle,
    generalContentKey: 'vehicleTypeOther',
  },
];

export const bikeType = [
  { dataKey: 'bikeType', value: BikeType.BMX, label: 'BMX', generalContentKey: 'vehicleBikeTypeBmx' },
  { dataKey: 'bikeType', value: BikeType.CHILD, label: 'Child', generalContentKey: 'vehicleBikeTypeChild' },
  { dataKey: 'bikeType', value: BikeType.ELECTRIC, label: 'Electric', generalContentKey: 'vehicleBikeTypeElectric' },
  { dataKey: 'bikeType', value: BikeType.HYBRID, label: 'Hybrid', generalContentKey: 'vehicleBikeTypeHybrid' },
  { dataKey: 'bikeType', value: BikeType.LADY, label: 'Lady', generalContentKey: 'vehicleBikeTypeLady' },
  { dataKey: 'bikeType', value: BikeType.MOUNTAINBIKE, label: 'Mountain', generalContentKey: 'vehicleBikeTypeMountain' },
  { dataKey: 'bikeType', value: BikeType.ROAD, label: 'Road', generalContentKey: 'vehicleBikeTypeRoad' },
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
    variant: 'greenOutline' as 'greenOutline',
    icon: CircleFadingPlus,
  },
  {
    dataKey: 'vehicleStatus',
    value: VehicleStatus.UNAVAILABLE,
    label: 'Unavailable',
    variant: 'outline' as 'outline',
    icon: CircleDashed,
  },
  {
    dataKey: 'vehicleStatus',
    value: VehicleStatus.BROKEN,
    label: 'Broken',
    variant: 'redOutline' as 'redOutline',
    icon: CircleSlash,
  },
  {
    dataKey: 'vehicleStatus',
    value: VehicleStatus.ARCHIVED,
    label: 'Archived',
    variant: 'secondary' as 'secondary',
    icon: Archive,
  },
];

export const brakeType = [
  { dataKey: 'brakeType', value: BrakeType.CALIPER, label: 'Caliper', generalContentKey: 'vehicleBrakeTypeCaliper' },
  { dataKey: 'brakeType', value: BrakeType.DISC, label: 'Disc', generalContentKey: 'vehicleBrakeTypeDisc' },
  { dataKey: 'brakeType', value: BrakeType.FOOTBRAKE, label: 'Footbrake', generalContentKey: 'vehicleBrakeTypeFootbrake' },
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
  { dataKey: 'brand', value: BikeBrand.OTHER, label: 'Other', generalContentKey: 'vehicleBrandOther' },
];

//

export const isCustomerOwned = [
  {
    dataKey: 'isCustomerOwned',
    value: true,
    label: 'Customer',
    variant: 'secondary' as 'secondary',
    icon: UserCheck,
  },
  {
    dataKey: 'isCustomerOwned',
    value: false,
    label: 'Hjulverkstan',
    variant: 'outline' as 'outline',
    icon: Building,
  },
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
  ...isCustomerOwned,
];

export const find = createFindFn(all);
export const matchFn = createMatchFn(all);
