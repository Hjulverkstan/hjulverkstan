import { useQuery } from 'react-query';

import { ErrorRes } from '../api';
import { EnumAttributes } from '../enums';
import { Location } from './types';
import * as enums from './enums';
import * as api from './api';

//

export const useLocationsQ = () =>
  useQuery<Location[], ErrorRes>(api.createGetLocations());

export const useLocationsAsEnumsQ = () =>
  useQuery<Location[], ErrorRes, EnumAttributes[]>({
    ...api.createGetLocations(),
    select: (locations) =>
      locations.map((location) => {
        const { icon } = enums.locationType.find(
          (e) => e.value === location.locationType,
        )!;

        return { icon, name: location.name, value: location.id };
      }) ?? [],
  });
