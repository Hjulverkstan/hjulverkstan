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

import { EnumAttributes, EnumAttributesRaw } from '../enums';
import {
  BikeBrand,
  BikeSize,
  BikeType,
  BrakeType,
  StrollerType,
  VehicleStatus,
  VehicleType,
} from './types';
import { ticketStatus, ticketType } from '@data/ticket/enums';

//

export const vehicleType: EnumAttributesRaw[] = [
  {
    dataKey: 'vehicleType',
    value: VehicleType.BIKE,
    translationKey: 'enumVehicleTypeBike',
    icon: Bike,
    children: Object.values(BikeType),
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.STROLLER,
    translationKey: 'enumVehicleTypeStroller',
    icon: Baby,
    children: Object.values(StrollerType),
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.SCOOTER,
    translationKey: 'enumVehicleTypeScooter',
    icon: AlertCircle,
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.SKATE,
    translationKey: 'enumVehicleTypeSkate',
    icon: AlertCircle,
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.BATCH,
    translationKey: 'enumVehicleTypeBatch',
    icon: Warehouse,
  },
  {
    dataKey: 'vehicleType',
    value: VehicleType.OTHER,
    translationKey: 'enumVehicleTypeOther',
    icon: HelpCircle,
  },
];

export const bikeType: EnumAttributesRaw[] = [
  {
    dataKey: 'bikeType',
    value: BikeType.BMX,
    translationKey: 'enumBikeTypeBMX',
  },
  {
    dataKey: 'bikeType',
    value: BikeType.CHILD,
    translationKey: 'enumBikeTypeChild',
  },
  {
    dataKey: 'bikeType',
    value: BikeType.ELECTRIC,
    translationKey: 'enumBikeTypeElectric',
  },
  {
    dataKey: 'bikeType',
    value: BikeType.HYBRID,
    translationKey: 'enumBikeTypeHybrid',
  },
  {
    dataKey: 'bikeType',
    value: BikeType.LADY,
    translationKey: 'enumBikeTypeLady',
  },
  {
    dataKey: 'bikeType',
    value: BikeType.MOUNTAINBIKE,
    translationKey: 'enumBikeTypeMountainBike',
  },
  {
    dataKey: 'bikeType',
    value: BikeType.ROAD,
    translationKey: 'enumBikeTypeRoad',
  },
];

export const strollerType: EnumAttributes[] = [
  { dataKey: 'strollerType', value: StrollerType.SINGLE, label: 'Single' },
  { dataKey: 'strollerType', value: StrollerType.DOUBLE, label: 'Double' },
];

export const vehicleStatus: EnumAttributes[] = [
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

export const brakeType: EnumAttributesRaw[] = [
  {
    dataKey: 'brakeType',
    value: BrakeType.CALIPER,
    translationKey: 'enumBikeBrakeTypeCaliper',
  },
  {
    dataKey: 'brakeType',
    value: BrakeType.DISC,
    translationKey: 'enumBikeBrakeTypeDisc',
  },
  {
    dataKey: 'brakeType',
    value: BrakeType.FOOTBRAKE,
    translationKey: 'enumBikeBrakeTypeFootbrake',
  },
];

export const size: EnumAttributesRaw[] = [
  {
    dataKey: 'size',
    value: BikeSize.EXTRA_SMALL,
    translationKey: 'enumBikeSizeXS',
  },
  { dataKey: 'size', value: BikeSize.SMALL, translationKey: 'enumBikeSizeS' },
  { dataKey: 'size', value: BikeSize.MEDIUM, translationKey: 'enumBikeSizeM' },
  { dataKey: 'size', value: BikeSize.LARGE, translationKey: 'enumBikeSizeL' },
  {
    dataKey: 'size',
    value: BikeSize.EXTRA_LARGE,
    translationKey: 'enumBikeSizeXL',
  },
];

export const brand: EnumAttributesRaw[] = [
  {
    dataKey: 'brand',
    value: BikeBrand.MONARK,
    translationKey: 'enumBikeBrandMonark',
  },
  {
    dataKey: 'brand',
    value: BikeBrand.SKEPPSHULT,
    translationKey: 'enumBikeBrandSkeppshult',
  },
  {
    dataKey: 'brand',
    value: BikeBrand.YOSEMITE,
    translationKey: 'enumBikeBrandYosemite',
  },
  {
    dataKey: 'brand',
    value: BikeBrand.CRESCENT,
    translationKey: 'enumBikeBrandCrescent',
  },
  {
    dataKey: 'brand',
    value: BikeBrand.SPECIALIZED,
    translationKey: 'enumBikeBrandSpecialized',
  },
  {
    dataKey: 'brand',
    value: BikeBrand.NISHIKI,
    translationKey: 'enumBikeBrandNishiki',
  },
  {
    dataKey: 'brand',
    value: BikeBrand.SJOSALA,
    translationKey: 'enumBikeBrandSjosala',
  },
  {
    dataKey: 'brand',
    value: BikeBrand.KRONAN,
    translationKey: 'enumBikeBrandKronan',
  },
  {
    dataKey: 'brand',
    value: BikeBrand.PELAGO,
    translationKey: 'enumBikeBrandPelago',
  },
  {
    dataKey: 'brand',
    value: BikeBrand.BIANCHI,
    translationKey: 'enumBikeBrandBianchi',
  },
  {
    dataKey: 'brand',
    value: BikeBrand.OTHER,
    translationKey: 'enumBikeBrandOther',
  },
];

export const isCustomerOwned: EnumAttributes[] = [
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

export const ticketTypes = ticketType.map((e) => ({
  ...e,
  dataKey: 'ticketTypes',
}));

export const ticketStatuses = ticketStatus.map((e) => ({
  ...e,
  dataKey: 'ticketStatuses',
}));
