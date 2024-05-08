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

export type GetLocationRes = Location;

export interface GetLocationParams {
  id: string;
}

export const createGetLocation = ({ id }: GetLocationParams) => ({
  queryKey: ['vehicle', id],
  queryFn: () =>
    instance
      .get<GetLocationRes>(`${endpoints.location}/${id}`)
      .then((res) => parseResponseData(res.data) as Location)
      .catch(createErrorHandler(endpoints.location)),
});

// MUTATIONS

const transformBody = ({
  id,
  locationType,
  vehicleIds,
  address,
  name,
  comment,
}: Partial<Location>) => ({
  id,
  locationType,
  vehicleIds,
  address,
  name,
  comment,
});

export type CreateLocationRes = Location;

export const createCreateLocation = () => ({
  mutationFn: (body: CreateLocationRes) =>
    instance
      .post<CreateLocationRes>(endpoints.location, transformBody(body))
      .then((res) => parseResponseData(res.data) as Location)
      .catch(createErrorHandler(endpoints.location)),
});

export type EditLocationRes = Location;
export type EditLocationParams = Location;
export const createEditLocation = () => ({
  mutationFn: (body: EditLocationParams) =>
    instance
      .put<EditLocationRes>(
        `${endpoints.location}/${body.id}`,
        transformBody(body),
      )
      .then((res) => parseResponseData(res.data) as Location)
      .catch(createErrorHandler(endpoints.location)),
});

export const createDeleteLocation = () => ({
  mutationFn: (id: string) =>
    instance
      .delete<GetLocationRes>(`${endpoints.location}/${id}`)
      .then((res) => parseResponseData(res.data) as Location)
      .catch(createErrorHandler(endpoints.location)),
});
