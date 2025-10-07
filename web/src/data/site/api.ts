import { GetVehicleParams, GetVehicleRes } from '../vehicle/api';
import { Vehicle } from '../vehicle/types';
import { createErrorHandler, endpoints, instance } from '../api';
import { ListResponse } from '../types';

// GET ALL PUBLIC VEHICLES

export interface GetPublicVehiclesByLocationParams {
  locationId: string;
}

export type GetPublicVehiclesByLocationRes = ListResponse<Vehicle>;

export const createGetPublicVehiclesByLocation = ({
  locationId,
}: GetPublicVehiclesByLocationParams) => ({
  queryKey: [endpoints.site, 'vehicle/location', locationId],
  queryFn: () => {
    return instance
      .get<GetPublicVehiclesByLocationRes>(
        `${endpoints.site}/location/${locationId}`,
      )
      .then((res) => res.data.content)
      .catch(createErrorHandler(endpoints.site));
  },
});

// GET PUBLIC VEHICLE

export const createGetPublicVehicleById = ({ id }: GetVehicleParams) => ({
  queryKey: [endpoints.site, 'vehicle', id],
  queryFn: () =>
    instance
      .get<GetVehicleRes>(`${endpoints.site}/${id}`)
      .then((res) => res.data)
      .catch(createErrorHandler(`${endpoints.site}/${id}`)),
});
