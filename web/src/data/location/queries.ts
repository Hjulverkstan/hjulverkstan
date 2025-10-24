import { useQuery } from '@tanstack/react-query';

import { StandardError } from '../api';
import { EnumAttributes } from '../types';
import { Location } from './types';
import * as enumsRaw from './enums';
import * as api from './api';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { findEnum } from '@utils/enums';

//

export const useLocationsQ = () =>
  useQuery<Location[], StandardError>({
    ...api.createGetLocations(),
    select: (locations) =>
      locations?.map((location) => ({
        ...location,
        vehicleCount: location.vehicleIds?.length || 0,
      })),
  });

export interface UseLocationQProps {
  id: string;
}

export const useLocationQ = ({ id }: UseLocationQProps) =>
  useQuery<Location, StandardError>({
    ...api.createGetLocation({ id }),
    enabled: !!id,
  });

//

export const useLocationsAsEnumsQ = ({ dataKey = 'locationId' } = {}) => {
  const enums = useTranslateRawEnums(enumsRaw);

  return useQuery<Location[], StandardError, EnumAttributes[]>({
    ...api.createGetLocations(),
    select: (locations) =>
      locations?.map((location) => ({
        dataKey,
        icon: findEnum(enums, location.locationType).icon,
        label: location.name,
        value: location.id,
      })) ?? [],
  });
};
