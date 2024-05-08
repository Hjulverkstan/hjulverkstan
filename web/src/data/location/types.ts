export enum LocationType {
  STORAGE = 'STORAGE',
  SHOP = 'SHOP',
}

export interface Location {
  id: string;
  locationType: LocationType;
  vehicleIds: string[];
  address: string;
  name: string;
  comment: string;
  //
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}
