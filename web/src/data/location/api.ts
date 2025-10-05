import { createErrorHandler, endpoints, instance } from '../api';

import { Location } from './types';

// GET ALL

export interface GetLocationsRes {
  locations: Location[];
}

export const createGetLocations = () => ({
  queryKey: [endpoints.location],
  queryFn: () =>
    instance
      .get<GetLocationsRes>(endpoints.location)
      .then((res) => res.data.locations)
      .catch(createErrorHandler(endpoints.location)),
});

// GET

export type GetLocationRes = Location;
export interface GetLocationParams {
  id: string;
}

export const createGetLocation = ({ id }: GetLocationParams) => ({
  queryKey: [endpoints.location, id],
  queryFn: () =>
    instance
      .get<GetLocationRes>(`${endpoints.location}/${id}`)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.location)),
});

// CREATE

export type CreateLocationRes = Location;
export type CreateLocationParams = Omit<Location, 'id'>;

export const createCreateLocation = () => ({
  mutationFn: (body: CreateLocationParams) =>
    instance
      .post<CreateLocationRes>(endpoints.location, body)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.location)),
});

// EDIT

export type EditLocationRes = Location;
export type EditLocationParams = Location;

export const createEditLocation = () => ({
  mutationFn: ({ id, ...body }: EditLocationParams) =>
    instance
      .put<EditLocationRes>(`${endpoints.location}/${id}`, body)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.location)),
});

// DELETE

export const createDeleteLocation = () => ({
  mutationFn: (id: string) =>
    instance
      .delete(`${endpoints.location}/${id}`)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.location)),
});
