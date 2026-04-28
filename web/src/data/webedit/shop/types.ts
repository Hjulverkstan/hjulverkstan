import { Auditable } from '../../types';

export interface Shop extends Auditable {
  id: string;
  imageURL: string;
  locationId: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  openHours: OpenHours;
  hasTemporaryHours: boolean;
  hasVehicleBorrowing: boolean;
  slug: string;
}

export interface OpenHours {
  mon?: string;
  tue?: string;
  wed?: string;
  thu?: string;
  fri?: string;
  sat?: string;
  sun?: string;
}
