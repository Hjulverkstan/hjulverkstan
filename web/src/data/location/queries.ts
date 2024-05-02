import { useQuery } from 'react-query';

import { ErrorRes } from '../api';
import { EnumAttributes } from '../enums';
import { Location } from './types';
import * as enums from './enums';
import * as api from './api';

//

export const useLocationsQ = () =>
  useQuery<Location[], ErrorRes>(api.createGetLocations());

export const useLocationsAsEnumsQ = ({ dataKey = 'locationId' } = {}) =>
  useQuery<Location[], ErrorRes, EnumAttributes[]>({
    ...api.createGetLocations(),
    select: (locations) =>
      locations?.map((location) => ({
        dataKey,
        icon: enums.find(location.locationType).icon,
        name: location.name,
        value: location.id,
      })) ?? [],
  });
