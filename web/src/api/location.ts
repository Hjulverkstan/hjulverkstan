import {
  instance,
  endpoints,
  createErrorHandler,
  parseResponseData,
} from './index';

export enum LocationType {
  STORAGE = 'STORAGE',
  SHOP = 'SHOP',
}

export interface Location {
  id: string;
  locationType: LocationType;
  address: string;
  name: string;
}

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
