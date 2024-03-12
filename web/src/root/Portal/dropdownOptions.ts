import { VehicleStatus, VehicleType } from '@api';
import {
  BabyIcon,
  Bike,
  CircleDashed,
  CircleFadingPlus,
  CircleSlash,
} from 'lucide-react';

export const vehicleTypeOptions = [
  { value: VehicleType.BIKE, name: 'Bike', icon: Bike },
  { value: VehicleType.STROLLER, name: 'Stroller', icon: BabyIcon },
];

export const vehicleStatusOptions = [
  { value: VehicleStatus.AVAILABLE, name: 'Available', icon: CircleFadingPlus },
  { value: VehicleStatus.UNAVAILABLE, name: 'Unavailable', icon: CircleDashed },
  { value: VehicleStatus.BROKEN, name: 'Broken', icon: CircleSlash },
];
