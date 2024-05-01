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
