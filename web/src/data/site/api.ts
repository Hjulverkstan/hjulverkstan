import { Vehicle } from '@data/vehicle/types';
import { createErrorHandler, endpoints, instance } from '@data/api';
import { GetVehicleParams, GetVehicleRes } from '@data/vehicle/api';

// GET ALL PUBLIC VEHICLES

export interface GetPublicVehiclesByLocationParams {
  locationId: string;
}

export interface GetPublicVehiclesByLocationRes {
  vehicles: Vehicle[];
}

export const createGetPublicVehiclesByLocation = ({
  locationId,
}: GetPublicVehiclesByLocationParams) => ({
  queryKey: [endpoints.site, 'vehicle/location', locationId],
  queryFn: () => {
    return instance
      .get<GetPublicVehiclesByLocationRes>(
        `${endpoints.site}/location/${locationId}`,
      )
      .then((res) => res.data.vehicles)
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
