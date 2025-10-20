import type { JSONContent } from '@tiptap/core';

export interface Shop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  imageURL: string;
  openHours: OpenHours;
  hasTemporaryHours: boolean;
  locationId: string;
  bodyText: JSONContent;
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
