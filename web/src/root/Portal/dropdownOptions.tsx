import {
  BabyIcon,
  Bike,
  CircleDashed,
  CircleFadingPlus,
  CircleSlash,
} from 'lucide-react';

import { VehicleStatus, VehicleType } from '@api';
import { FilterOption } from '@components/FacetedFilterDropdown';
import IconLabel from '@components/IconLabel';

//

export const toLabel = (options: FilterOption[], key: string) => {
  const option = options.find(({ value }) => value === key);

  if (!option)
    throw Error(
      `toLabel was given a key [${key}] that was not the options [${options.map((o) => o.value).join()}]`,
    );

  return <IconLabel name={option.name} icon={option.icon} />;
};

//

export const vehicleTypeOptions = [
  { value: VehicleType.BIKE, name: 'Bike', icon: Bike },
  { value: VehicleType.STROLLER, name: 'Stroller', icon: BabyIcon },
];

export const vehicleStatusOptions = [
  { value: VehicleStatus.AVAILABLE, name: 'Available', icon: CircleFadingPlus },
  { value: VehicleStatus.UNAVAILABLE, name: 'Unavailable', icon: CircleDashed },
  { value: VehicleStatus.BROKEN, name: 'Broken', icon: CircleSlash },
];
