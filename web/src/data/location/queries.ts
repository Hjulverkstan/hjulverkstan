import { useQuery } from '@tanstack/react-query';

import { StandardError } from '../api';
import { EnumAttributes } from '../enums';
import { Location } from './types';
import * as enums from './enums';
import * as api from './api';

//

export const useLocationsQ = () =>
  useQuery<Location[], StandardError>(api.createGetLocations());

export interface UseLocationQProps {
  id: string;
}

export const useLocationQ = ({ id }: UseLocationQProps) =>
  useQuery<Location, StandardError>({
    ...api.createGetLocation({ id }),
    enabled: !!id,
  });

//

export const useLocationsAsEnumsQ = ({ dataKey = 'locationId' } = {}) =>
  useQuery<Location[], StandardError, EnumAttributes[]>({
    ...api.createGetLocations(),
    select: (locations) =>
      locations?.map((location) => ({
        dataKey,
        icon: enums.find(location.locationType).icon,
        label: location.name,
        value: location.id,
      })) ?? [],
  });
