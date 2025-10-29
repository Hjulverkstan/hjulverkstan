import { Auditable } from '../types';

export enum LocationType {
  STORAGE = 'STORAGE',
  SHOP = 'SHOP',
}

export interface Location extends Auditable {
  id: string;
  locationType: LocationType;
  vehicleIds: string[];
  address: string;
  name: string;
  comment: string;
}
