import {
  instance,
  endpoints,
  createErrorHandler,
  parseResponseData,
} from '../api';

import { Location } from './types';

//

export interface GetLocationsRes {
  locations: Location[];
}

export const createGetLocations = () => ({
  queryKey: ['locations'],
  queryFn: () =>
    instance
      .get<GetLocationsRes>(endpoints.location)
      .then((res) => res.data.locations.map(parseResponseData) as Location[])
      .catch(createErrorHandler(endpoints.location)),
});
